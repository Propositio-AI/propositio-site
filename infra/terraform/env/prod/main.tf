locals {
  environment            = "prod"
  project_name           = "propositio"
  service_name           = "propositio-site"
  resource_prefix        = "propositio-site"
  aws_region             = "ap-northeast-1"
  infrastructure_profile = "cost-optimized"
  route53_zone_name      = "propositio.com"
  web_domain_name        = "propositio.com"
  web_alias_domains      = ["www.propositio.com"]
  api_domain_name        = "api.propositio.com"
  name                   = "${local.resource_prefix}-${local.environment}"
  noindex                = var.noindex != null ? var.noindex : false
  web_origins = concat(
    ["https://${local.web_domain_name}"],
    [for domain in local.web_alias_domains : "https://${domain}"],
  )
  common_tags = merge(var.extra_tags, {
    Project     = local.service_name
    Environment = local.environment
    ManagedBy   = "terraform"
  })
  web_csp = join("; ", [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://images.microcms-assets.io",
    "connect-src 'self' https://${local.api_domain_name}",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ])
}

data "aws_caller_identity" "current" {}

data "aws_route53_zone" "service" {
  name         = local.route53_zone_name
  private_zone = false
}

data "terraform_remote_state" "service_shared" {
  backend = "s3"
  config = {
    bucket       = "${local.project_name}-terraform-state-${data.aws_caller_identity.current.account_id}"
    key          = "services/${local.service_name}/shared/terraform.tfstate"
    region       = local.aws_region
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
  profile                 = local.infrastructure_profile
  hosted_zone_id          = data.aws_route53_zone.service.zone_id
  domain_name             = local.web_domain_name
  alias_domains           = local.web_alias_domains
  force_destroy           = var.destroy_mode
  versioning_enabled      = local.environment == "prod"
  content_security_policy = local.web_csp
  noindex                 = local.noindex
  tags                    = local.common_tags
}

# 活動記録の読み取りとお問い合わせだけを提供する、site固有の低コストAPI。
# 汎用static-site構成に含めず、この環境rootのservice配下で責任を持つ。
module "site_api" {
  source = "./service/site-api"

  name_prefix             = local.name
  parameter_prefix        = "/${local.project_name}/${local.environment}/${local.resource_prefix}/app"
  aws_region              = local.aws_region
  hosted_zone_id          = data.aws_route53_zone.service.zone_id
  api_domain_name         = local.api_domain_name
  web_origins             = local.web_origins
  microcms_service_domain = var.microcms_service_domain
  mail_from               = "noreply@${local.route53_zone_name}"
  contact_notify_to       = var.contact_notify_to
  ses_identity            = data.terraform_remote_state.service_shared.outputs.ses_identity
  ses_configuration_set   = data.terraform_remote_state.service_shared.outputs.ses_configuration_set
  alarm_email             = var.alarm_email
  log_retention_days      = 90
  handler_source_file     = "${path.root}/../../../../services/site-api/handler.py"
  tags                    = local.common_tags
}

check "domains_belong_to_hosted_zone" {
  assert {
    condition = alltrue([
      for domain in concat([local.web_domain_name, local.api_domain_name], local.web_alias_domains) :
      domain == local.route53_zone_name || endswith(domain, ".${local.route53_zone_name}")
    ])
    error_message = "Web/APIドメインはroute53_zone_name配下にしてください。"
  }
}
