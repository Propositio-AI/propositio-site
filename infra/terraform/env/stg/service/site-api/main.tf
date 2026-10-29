data "aws_caller_identity" "current" {}

locals {
  parameter_prefix = var.parameter_prefix
}
