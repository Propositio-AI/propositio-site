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
  backend "s3" {
    key = "envs/stg/terraform.tfstate"
  }
}

locals {
  environment = "stg"
  default_tags = {
    Project     = var.project_name
    Environment = local.environment
    ManagedBy   = "terraform"
  }
}

provider "aws" {
  region = var.aws_region
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

  project_name = var.project_name
  environment  = local.environment
  aws_region   = var.aws_region

  domain_name = var.domain_name
  web_domain  = "stg.${var.domain_name}"
  api_domain  = "api.stg.${var.domain_name}"
  vpc_cidr    = "10.10.0.0/16"

  api_image_tag           = var.api_image_tag
  api_min_count           = 1
  api_max_count           = 2
  alb_deletion_protection = false

  db_backup_retention_days = 1
  db_deletion_protection   = false

  microcms_service_domain = var.microcms_service_domain
  mail_from               = "noreply@${var.domain_name}"
  contact_notify_to       = var.contact_notify_to

  log_retention_days = 30
  noindex            = true
  alarm_email        = var.alarm_email

  github_repository = var.github_repository
  allow_image_push  = true
}
