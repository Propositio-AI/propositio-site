data "aws_iam_policy_document" "ecs_tasks_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    # 他アカウントのタスクからの混乱した代理（confused deputy）を防ぐ
    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

# ---------------------------------------------------------------------------
# 実行ロール：ECSエージェントがイメージの取得・ログ出力・秘密値の取得に使う
# ---------------------------------------------------------------------------
resource "aws_iam_role" "api_execution" {
  name               = "${local.name_prefix}-api-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy_attachment" "api_execution_managed" {
  role       = aws_iam_role.api_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "api_execution_secrets" {
  statement {
    actions = ["ssm:GetParameter", "ssm:GetParameters"]
    resources = [
      aws_ssm_parameter.db_host.arn,
      aws_ssm_parameter.db_port.arn,
      aws_ssm_parameter.db_name.arn,
      aws_ssm_parameter.db_user.arn,
      aws_ssm_parameter.db_password.arn,
      aws_ssm_parameter.microcms_api_key.arn,
      aws_ssm_parameter.turnstile_secret_key.arn,
    ]
  }
  statement {
    actions   = ["kms:Decrypt"]
    resources = [aws_kms_key.parameters.arn]
  }
}

resource "aws_iam_role_policy" "api_execution_secrets" {
  name   = "read-secrets"
  role   = aws_iam_role.api_execution.id
  policy = data.aws_iam_policy_document.api_execution_secrets.json
}

# ---------------------------------------------------------------------------
# タスクロール：アプリ自身の権限（SESでの送信のみ）
# ---------------------------------------------------------------------------
resource "aws_iam_role" "api_task" {
  name               = "${local.name_prefix}-api-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

data "aws_iam_policy_document" "api_task" {
  # 認証済みドメインから、決められた送信元アドレスでのみ送信できる
  statement {
    sid     = "SendContactMail"
    actions = ["ses:SendEmail"]
    resources = [
      "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identity/${var.domain_name}",
      "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:configuration-set/${local.ses_configuration_set}",
    ]
    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"
      values   = [var.mail_from]
    }
  }

  # ECS Exec（稼働中のコンテナへの接続）
  dynamic "statement" {
    for_each = var.enable_execute_command ? [1] : []
    content {
      sid = "EcsExec"
      actions = [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel",
      ]
      resources = ["*"]
    }
  }
}

resource "aws_iam_role_policy" "api_task" {
  name   = "api"
  role   = aws_iam_role.api_task.id
  policy = data.aws_iam_policy_document.api_task.json
}

# GitHub Actions用OIDC ProviderとデプロイRoleはpropositio-infraが所有する。
# 既存stateに旧Roleがある場合はAWSから削除せずstateから外し、GitHub Environmentを
# 共通基盤のRoleへ切り替えた後に旧Roleを明示的に廃止する。
removed {
  from = aws_iam_role_policy.github_deploy

  lifecycle {
    destroy = false
  }
}

removed {
  from = aws_iam_role.github_deploy

  lifecycle {
    destroy = false
  }
}
