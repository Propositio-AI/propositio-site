terraform {
  required_version = ">= 1.11.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }

  # bucket / region は terraform init -backend-config=../../backend.hcl で渡す
  backend "s3" {}
}

locals {
  defaults    = jsondecode(file("${path.root}/../../../../config/defaults.json"))
  environment = "stg"
  aws_region  = var.aws_region != null ? var.aws_region : local.defaults.AWS_REGION
  platform    = data.terraform_remote_state.platform.outputs.service_platform_config[local.defaults.TF_PLATFORM_SERVICE_NAME]
  default_tags = {
    Project     = local.defaults.TF_PLATFORM_SERVICE_NAME
    Environment = local.environment
    ManagedBy   = "terraform"
  }
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

provider "aws" {
  region = local.aws_region
  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  default_tags {
    tags = local.default_tags
  }
}

# stg：本番と同じ構成を最小のサイズで動かす。検索エンジンには載せない
module "environment" {
  source = "../../modules/environment"
  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  project_name = local.platform.resource_prefix
  environment  = local.environment
  aws_region   = local.aws_region

  domain_name       = local.platform.route53_zone_name
  web_domain        = local.platform.domains.stg.web
  api_domain        = local.platform.domains.stg.api
  web_alias_domains = tolist(local.platform.domains.stg.web_aliases)
  vpc_cidr          = "10.10.0.0/16"

  api_image_tag           = var.api_image_tag
  api_cpu                 = local.defaults.TF_API_CPU
  api_memory              = local.defaults.TF_API_MEMORY
  api_min_count           = 1
  api_max_count           = 2
  enable_execute_command  = local.defaults.TF_ENABLE_EXECUTE_COMMAND
  alb_deletion_protection = false

  availability_zones       = tolist(local.defaults.TF_AVAILABILITY_ZONES)
  public_enabled           = local.defaults.TF_PUBLIC_ENABLED
  db_instance_class        = local.defaults.TF_DB_INSTANCE_CLASS
  db_allocated_storage     = local.defaults.TF_DB_ALLOCATED_STORAGE
  db_max_allocated_storage = local.defaults.TF_DB_MAX_ALLOCATED_STORAGE
  db_multi_az              = local.defaults.TF_DB_MULTI_AZ
  db_password_version      = local.defaults.TF_DB_PASSWORD_VERSION
  db_backup_retention_days = 1
  db_deletion_protection   = false

  microcms_service_domain = var.microcms_service_domain
  mail_from               = "noreply@${local.platform.route53_zone_name}"
  contact_notify_to       = var.contact_notify_to

  log_retention_days = 30
  noindex            = true
  alarm_email        = var.alarm_email
  s3_force_destroy   = var.destroy_mode

}
