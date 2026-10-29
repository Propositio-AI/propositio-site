locals {
  defaults = jsondecode(file("${path.root}/../../../config/defaults.json"))
  platform = data.terraform_remote_state.platform.outputs.service_platform_config[local.defaults.TF_PLATFORM_SERVICE_NAME]
  name     = "${local.platform.resource_prefix}-${var.environment}"
  noindex  = var.noindex != null ? var.noindex : var.environment == "stg"
  web_origins = concat(
    ["https://${local.platform.domains[var.environment].web}"],
    [for domain in local.platform.domains[var.environment].web_aliases : "https://${domain}"],
  )
  common_tags = merge(var.extra_tags, {
    Project     = local.defaults.TF_PLATFORM_SERVICE_NAME
    Environment = var.environment
    ManagedBy   = "terraform"
  })
  web_csp = join("; ", [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://images.microcms-assets.io",
    "connect-src 'self' https://${local.platform.domains[var.environment].api}",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ])
}

data "aws_caller_identity" "current" {}

data "terraform_remote_state" "platform" {
  backend = "s3"
  config = {
    bucket       = "${local.defaults.TF_PLATFORM_PROJECT_NAME}-terraform-state-${data.aws_caller_identity.current.account_id}"
    key          = "shared/terraform.tfstate"
    region       = local.defaults.AWS_REGION
    use_lockfile = true
  }
}

data "terraform_remote_state" "service_shared" {
  backend = "s3"
  config = {
    bucket       = "${local.defaults.TF_PLATFORM_PROJECT_NAME}-terraform-state-${data.aws_caller_identity.current.account_id}"
    key          = "services/${local.defaults.TF_PLATFORM_SERVICE_NAME}/shared/terraform.tfstate"
    region       = local.defaults.AWS_REGION
    use_lockfile = true
  }
}

module "site" {
  source = "git::https://github.com/Propositio-AI/propositio-infra.git//infra/terraform/service-types/static-site?ref=v1.2.0"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  name_prefix             = local.name
  profile                 = local.platform.infrastructure_profile
  hosted_zone_id          = local.platform.route53_zone_id
  domain_name             = local.platform.domains[var.environment].web
  alias_domains           = tolist(local.platform.domains[var.environment].web_aliases)
  force_destroy           = var.destroy_mode
  versioning_enabled      = var.environment == "prod"
  content_security_policy = local.web_csp
  noindex                 = local.noindex
  tags                    = local.common_tags
}

# 活動記録の読み取りとお問い合わせだけを提供する、site固有の低コストAPI。
# 汎用static-site構成に含めず、このリポジトリのservices配下で責任を持つ。
module "site_api" {
  source = "../services/site-api"

  name_prefix             = local.name
  parameter_prefix        = "/${local.defaults.TF_PLATFORM_PROJECT_NAME}/${var.environment}/${local.platform.resource_prefix}/app"
  aws_region              = local.defaults.AWS_REGION
  hosted_zone_id          = local.platform.route53_zone_id
  api_domain_name         = local.platform.domains[var.environment].api
  web_origins             = local.web_origins
  microcms_service_domain = var.microcms_service_domain
  mail_from               = "noreply@${local.platform.route53_zone_name}"
  contact_notify_to       = var.contact_notify_to
  ses_identity            = data.terraform_remote_state.service_shared.outputs.ses_identity
  ses_configuration_set   = data.terraform_remote_state.service_shared.outputs.ses_configuration_set
  alarm_email             = var.alarm_email
  log_retention_days      = var.environment == "prod" ? 90 : 30
  tags                    = local.common_tags
}

check "registered_service_type_matches_root" {
  assert {
    condition     = local.platform.infrastructure_type == "static-site"
    error_message = "propositio-infra registration must use the static-site service type."
  }
}

check "authentication_is_disabled" {
  assert {
    condition     = local.platform.authentication == null
    error_message = "propositio-site does not use Cognito; disable authentication in propositio-infra."
  }
}
