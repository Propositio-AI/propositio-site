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
