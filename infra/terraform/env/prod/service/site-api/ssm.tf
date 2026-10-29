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
