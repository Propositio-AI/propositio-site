locals {
  defaults            = jsondecode(file("${path.root}/../../../config/defaults.json"))
  aws_region          = var.aws_region != null ? var.aws_region : local.defaults.AWS_REGION
  mail_from_subdomain = var.mail_from_subdomain != null ? var.mail_from_subdomain : local.defaults.TF_MAIL_FROM_SUBDOMAIN
  platform            = data.terraform_remote_state.platform.outputs.service_platform_config[local.defaults.TF_PLATFORM_SERVICE_NAME]
}

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

module "contact_mail" {
  source = "../services/contact-mail"

  service_name        = local.platform.resource_prefix
  aws_region          = local.aws_region
  hosted_zone_id      = local.platform.route53_zone_id
  domain_name         = local.platform.route53_zone_name
  mail_from_subdomain = local.mail_from_subdomain
  dmarc_record        = var.dmarc_record
  alarm_email         = var.alarm_email
  tags = {
    Project   = local.defaults.TF_PLATFORM_SERVICE_NAME
    ManagedBy = "terraform"
    Stack     = "shared"
  }
}
