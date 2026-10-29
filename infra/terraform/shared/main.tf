locals {
  project_name        = "propositio"
  service_name        = "propositio-site"
  aws_region          = var.aws_region != null ? var.aws_region : "ap-northeast-1"
  route53_zone_name   = "propositio.com"
  mail_from_subdomain = var.mail_from_subdomain != null ? var.mail_from_subdomain : "mail"
}

data "aws_route53_zone" "service" {
  name         = local.route53_zone_name
  private_zone = false
}

module "contact_mail" {
  source = "./service/mail"

  service_name        = local.service_name
  aws_region          = local.aws_region
  hosted_zone_id      = data.aws_route53_zone.service.zone_id
  domain_name         = local.route53_zone_name
  mail_from_subdomain = local.mail_from_subdomain
  dmarc_record        = var.dmarc_record
  alarm_email         = var.alarm_email
  tags = {
    Project   = local.service_name
    ManagedBy = "terraform"
    Stack     = "shared"
  }
}
