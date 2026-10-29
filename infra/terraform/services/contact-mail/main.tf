resource "aws_sesv2_configuration_set" "this" {
  configuration_set_name = var.service_name
  tags                   = var.tags

  reputation_options { reputation_metrics_enabled = true }
  suppression_options { suppressed_reasons = ["BOUNCE", "COMPLAINT"] }
  sending_options { sending_enabled = true }
}

resource "aws_sesv2_email_identity" "this" {
  email_identity         = var.domain_name
  configuration_set_name = aws_sesv2_configuration_set.this.configuration_set_name
  tags                   = var.tags

  dkim_signing_attributes { next_signing_key_length = "RSA_2048_BIT" }
}

resource "aws_route53_record" "dkim" {
  count = 3

  zone_id = var.hosted_zone_id
  name    = "${aws_sesv2_email_identity.this.dkim_signing_attributes[0].tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 1800
  records = ["${aws_sesv2_email_identity.this.dkim_signing_attributes[0].tokens[count.index]}.dkim.amazonses.com"]
}

resource "aws_sesv2_email_identity_mail_from_attributes" "this" {
  email_identity         = aws_sesv2_email_identity.this.email_identity
  mail_from_domain       = "${var.mail_from_subdomain}.${var.domain_name}"
  behavior_on_mx_failure = "USE_DEFAULT_VALUE"
}

resource "aws_route53_record" "mail_from_mx" {
  zone_id = var.hosted_zone_id
  name    = aws_sesv2_email_identity_mail_from_attributes.this.mail_from_domain
  type    = "MX"
  ttl     = 1800
  records = ["10 feedback-smtp.${var.aws_region}.amazonses.com"]
}

resource "aws_route53_record" "mail_from_spf" {
  zone_id = var.hosted_zone_id
  name    = aws_sesv2_email_identity_mail_from_attributes.this.mail_from_domain
  type    = "TXT"
  ttl     = 1800
  records = ["v=spf1 include:amazonses.com ~all"]
}

resource "aws_route53_record" "dmarc" {
  count = var.dmarc_record == null ? 0 : 1

  zone_id = var.hosted_zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 1800
  records = [var.dmarc_record]
}

resource "aws_sns_topic" "alarms" {
  count = var.alarm_email == null ? 0 : 1
  name  = "${var.service_name}-shared-alarms"
  tags  = var.tags
}

resource "aws_sns_topic_subscription" "alarms_email" {
  count = var.alarm_email == null ? 0 : 1

  topic_arn = aws_sns_topic.alarms[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "ses_bounce_rate" {
  alarm_name          = "${var.service_name}-ses-bounce-rate"
  alarm_description   = "SES bounce rate is approaching the account review threshold"
  namespace           = "AWS/SES"
  metric_name         = "Reputation.BounceRate"
  statistic           = "Maximum"
  period              = 3600
  evaluation_periods  = 1
  threshold           = 0.03
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = aws_sns_topic.alarms[*].arn
  tags                = var.tags
}

resource "aws_cloudwatch_metric_alarm" "ses_complaint_rate" {
  alarm_name          = "${var.service_name}-ses-complaint-rate"
  alarm_description   = "SES complaint rate is approaching the account review threshold"
  namespace           = "AWS/SES"
  metric_name         = "Reputation.ComplaintRate"
  statistic           = "Maximum"
  period              = 3600
  evaluation_periods  = 1
  threshold           = 0.0005
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = aws_sns_topic.alarms[*].arn
  tags                = var.tags
}
