locals {
  name_prefix = "${var.project_name}-${var.environment}"
  api_port    = 8000
  # shared で作ったリソースは同じ命名規則で参照する
  ecr_repository_name   = "${var.project_name}-api"
  ses_configuration_set = var.project_name
}

data "aws_caller_identity" "current" {}

data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

data "aws_ecr_repository" "api" {
  name = local.ecr_repository_name
}
