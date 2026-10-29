resource "aws_sns_topic" "alarms" {
  count = var.alarm_email == null ? 0 : 1
  name  = "${var.name_prefix}-site-api-alarms"
  tags  = var.tags
}

resource "aws_sns_topic_subscription" "alarms_email" {
  count     = var.alarm_email == null ? 0 : 1
  topic_arn = aws_sns_topic.alarms[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "errors" {
  alarm_name          = "${var.name_prefix}-site-api-errors"
  namespace           = "Propositio/SiteApi"
  metric_name         = "HandledErrors"
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = aws_sns_topic.alarms[*].arn
  ok_actions          = aws_sns_topic.alarms[*].arn
  tags                = var.tags
}

resource "aws_cloudwatch_log_metric_filter" "errors" {
  name           = "${var.name_prefix}-site-api-errors"
  log_group_name = aws_cloudwatch_log_group.function.name
  pattern        = "?error ?mail_error"

  metric_transformation {
    name      = "HandledErrors"
    namespace = "Propositio/SiteApi"
    value     = "1"
  }
}
