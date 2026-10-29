data "aws_caller_identity" "current" {}

locals {
  parameter_prefix = var.parameter_prefix
}

resource "aws_kms_key" "parameters" {
  description             = "${var.name_prefix} site API parameters"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags                    = var.tags
}

resource "aws_kms_alias" "parameters" {
  name          = "alias/${var.name_prefix}-site-api"
  target_key_id = aws_kms_key.parameters.key_id
}

resource "aws_ssm_parameter" "microcms_api_key" {
  name   = "${local.parameter_prefix}/microcms-api-key"
  type   = "SecureString"
  key_id = aws_kms_key.parameters.arn
  value  = "CHANGE_ME"
  tags   = var.tags
  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "turnstile_secret_key" {
  name   = "${local.parameter_prefix}/turnstile-secret-key"
  type   = "SecureString"
  key_id = aws_kms_key.parameters.arn
  value  = "disabled"
  tags   = var.tags
  lifecycle { ignore_changes = [value] }
}

resource "aws_dynamodb_table" "contacts" {
  name         = "${var.name_prefix}-contacts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "email_hash"
    type = "S"
  }
  attribute {
    name = "created_at"
    type = "S"
  }

  global_secondary_index {
    name            = "email-created-at"
    projection_type = "KEYS_ONLY"

    key_schema {
      attribute_name = "email_hash"
      key_type       = "HASH"
    }
    key_schema {
      attribute_name = "created_at"
      key_type       = "RANGE"
    }
  }

  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true }
  tags = var.tags
}

data "archive_file" "function" {
  type        = "zip"
  source_file = "${path.module}/handler.py"
  output_path = "${path.root}/${var.name_prefix}-site-api.zip"
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "function" {
  name               = "${var.name_prefix}-site-api"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.function.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "function" {
  statement {
    actions = ["ssm:GetParameter"]
    resources = [
      aws_ssm_parameter.microcms_api_key.arn,
      aws_ssm_parameter.turnstile_secret_key.arn,
    ]
  }
  statement {
    actions   = ["kms:Decrypt"]
    resources = [aws_kms_key.parameters.arn]
  }
  statement {
    actions   = ["dynamodb:PutItem", "dynamodb:Query"]
    resources = [aws_dynamodb_table.contacts.arn, "${aws_dynamodb_table.contacts.arn}/index/*"]
  }
  statement {
    actions = ["ses:SendEmail"]
    resources = [
      "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identity/${var.ses_identity}",
      "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:configuration-set/${var.ses_configuration_set}",
    ]
    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"
      values   = [var.mail_from]
    }
  }
}

resource "aws_iam_role_policy" "function" {
  name   = "site-api"
  role   = aws_iam_role.function.id
  policy = data.aws_iam_policy_document.function.json
}

resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/${var.name_prefix}-site-api"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}

resource "aws_lambda_function" "this" {
  function_name    = "${var.name_prefix}-site-api"
  role             = aws_iam_role.function.arn
  runtime          = "python3.13"
  architectures    = ["arm64"]
  handler          = "handler.lambda_handler"
  filename         = data.archive_file.function.output_path
  source_code_hash = data.archive_file.function.output_base64sha256
  memory_size      = 256
  timeout          = 15

  environment {
    variables = {
      CONTACTS_TABLE          = aws_dynamodb_table.contacts.name
      CONTACT_NOTIFY_TO       = var.contact_notify_to
      MAIL_FROM               = var.mail_from
      MICROCMS_SERVICE_DOMAIN = var.microcms_service_domain
      MICROCMS_API_KEY_PARAM  = aws_ssm_parameter.microcms_api_key.name
      TURNSTILE_SECRET_PARAM  = aws_ssm_parameter.turnstile_secret_key.name
      SES_CONFIGURATION_SET   = var.ses_configuration_set
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.function,
    aws_iam_role_policy.function,
    aws_iam_role_policy_attachment.logs,
  ]
  tags = var.tags
}

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.name_prefix}-site-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.web_origins
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
  tags = var.tags
}

resource "aws_apigatewayv2_integration" "function" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.this.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 15000
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.function.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 20
    throttling_rate_limit  = 10
  }
  tags = var.tags
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

resource "aws_acm_certificate" "api" {
  domain_name       = var.api_domain_name
  validation_method = "DNS"
  lifecycle { create_before_destroy = true }
  tags = var.tags
}

resource "aws_route53_record" "certificate" {
  for_each = {
    for option in aws_acm_certificate.api.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }
  zone_id         = var.hosted_zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 60
  records         = [each.value.record]
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "api" {
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate : record.fqdn]
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = var.api_domain_name
  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
  tags = var.tags
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.this.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.default.id
}

resource "aws_route53_record" "api" {
  zone_id = var.hosted_zone_id
  name    = var.api_domain_name
  type    = "A"
  alias {
    name                   = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

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
