resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/${var.name_prefix}-site-api"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}
