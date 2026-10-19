# AWSアカウント内で環境（stg / prod）をまたいで1つだけ持つリソース。
#   - ECR: APIのコンテナイメージ。stgでビルドした同じイメージをprodへ昇格させる
#   - SES: 送信ドメインの認証（DKIM・MAIL FROM）と設定セット
# GitHub ActionsのOIDCプロバイダーとデプロイRoleはpropositio-infraが管理する。

data "aws_caller_identity" "current" {}

data "terraform_remote_state" "platform" {
  backend = "s3"
  config = {
    bucket       = "${local.defaults.TF_PLATFORM_PROJECT_NAME}-terraform-state-${data.aws_caller_identity.current.account_id}"
    key          = "shared/terraform.tfstate"
    region       = local.aws_region
    use_lockfile = true
  }
}

data "aws_route53_zone" "main" {
  name         = local.platform.route53_zone_name
  private_zone = false
}

# ---------------------------------------------------------------------------
# ECR
# ---------------------------------------------------------------------------
resource "aws_ecr_repository" "api" {
  name = "${local.platform.resource_prefix}-api"
  # 同じタグ（コミットSHA）を上書きできないようにし、デプロイされたイメージを一意に特定できるようにする
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "タグなしイメージは7日で削除する"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "ロールバック用に直近50件を残し、それより古いイメージは削除する"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 50
        }
        action = { type = "expire" }
      },
    ]
  })
}

# ---------------------------------------------------------------------------
# SES（送信のみ。既存のメール受信設定は変更しない）
# ---------------------------------------------------------------------------
resource "aws_sesv2_configuration_set" "main" {
  configuration_set_name = local.platform.resource_prefix

  reputation_options {
    reputation_metrics_enabled = true
  }

  # バウンス・苦情があった宛先へは以後送らない（送信元の評判を守る）
  suppression_options {
    suppressed_reasons = ["BOUNCE", "COMPLAINT"]
  }

  sending_options {
    sending_enabled = true
  }
}

resource "aws_sesv2_email_identity" "domain" {
  email_identity         = local.platform.route53_zone_name
  configuration_set_name = aws_sesv2_configuration_set.main.configuration_set_name

  dkim_signing_attributes {
    next_signing_key_length = "RSA_2048_BIT"
  }
}

# Easy DKIM：3つのCNAMEで署名鍵を公開する（DMARCはDKIMの整合で満たす）
resource "aws_route53_record" "ses_dkim" {
  count = 3

  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${aws_sesv2_email_identity.domain.dkim_signing_attributes[0].tokens[count.index]}._domainkey.${local.platform.route53_zone_name}"
  type    = "CNAME"
  ttl     = 1800
  records = ["${aws_sesv2_email_identity.domain.dkim_signing_attributes[0].tokens[count.index]}.dkim.amazonses.com"]
}

# カスタムMAIL FROM（Return-Path）。バウンスはこのサブドメイン経由でSESに戻る
resource "aws_sesv2_email_identity_mail_from_attributes" "domain" {
  email_identity         = aws_sesv2_email_identity.domain.email_identity
  mail_from_domain       = "${local.mail_from_subdomain}.${local.platform.route53_zone_name}"
  behavior_on_mx_failure = "USE_DEFAULT_VALUE"
}

resource "aws_route53_record" "ses_mail_from_mx" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = aws_sesv2_email_identity_mail_from_attributes.domain.mail_from_domain
  type    = "MX"
  ttl     = 1800
  records = ["10 feedback-smtp.${local.aws_region}.amazonses.com"]
}

resource "aws_route53_record" "ses_mail_from_spf" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = aws_sesv2_email_identity_mail_from_attributes.domain.mail_from_domain
  type    = "TXT"
  ttl     = 1800
  records = ["v=spf1 include:amazonses.com ~all"]
}

resource "aws_route53_record" "dmarc" {
  count = var.dmarc_record == null ? 0 : 1

  zone_id = data.aws_route53_zone.main.zone_id
  name    = "_dmarc.${local.platform.route53_zone_name}"
  type    = "TXT"
  ttl     = 1800
  records = [var.dmarc_record]
}

# 送信元の評判の監視。AWSはバウンス率5%・苦情率0.1%を超えると審査・停止の対象にする
resource "aws_sns_topic" "alarms" {
  count = var.alarm_email == null ? 0 : 1
  name  = "${local.platform.resource_prefix}-shared-alarms"
}

resource "aws_sns_topic_subscription" "alarms_email" {
  count = var.alarm_email == null ? 0 : 1

  topic_arn = aws_sns_topic.alarms[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "ses_bounce_rate" {
  alarm_name          = "${local.platform.resource_prefix}-ses-bounce-rate"
  alarm_description   = "SESのバウンス率が高い（5%で審査対象）"
  namespace           = "AWS/SES"
  metric_name         = "Reputation.BounceRate"
  statistic           = "Maximum"
  period              = 3600
  evaluation_periods  = 1
  threshold           = 0.03
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = aws_sns_topic.alarms[*].arn
}

resource "aws_cloudwatch_metric_alarm" "ses_complaint_rate" {
  alarm_name          = "${local.platform.resource_prefix}-ses-complaint-rate"
  alarm_description   = "SESの苦情率が高い（0.1%で審査対象）"
  namespace           = "AWS/SES"
  metric_name         = "Reputation.ComplaintRate"
  statistic           = "Maximum"
  period              = 3600
  evaluation_periods  = 1
  threshold           = 0.0005
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = aws_sns_topic.alarms[*].arn
}

# 以前このstateで管理していたOIDC Providerがある場合は削除せずstateから外す。
# propositio-infra側へimportしてから、このrootをapplyすること。
removed {
  from = aws_iam_openid_connect_provider.github

  lifecycle {
    destroy = false
  }
}
