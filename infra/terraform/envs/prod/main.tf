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
    key = "envs/prod/terraform.tfstate"
  }
}

locals {
  environment = "prod"
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

# prod：タスクは2AZに分散して常時2つ以上。DBは削除保護と7日分のバックアップを持つ
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
  web_domain  = var.domain_name
  api_domain  = "api.${var.domain_name}"
  vpc_cidr    = "10.20.0.0/16"

  api_image_tag           = var.api_image_tag
  api_min_count           = 2
  api_max_count           = 4
  alb_deletion_protection = true

  db_backup_retention_days = 7
  db_deletion_protection   = true
  # 停止が許されなくなったら true にする（費用は約2倍）
  db_multi_az = false

  microcms_service_domain = var.microcms_service_domain
  mail_from               = "noreply@${var.domain_name}"
  contact_notify_to       = var.contact_notify_to

  log_retention_days = 90
  alarm_email        = var.alarm_email

  github_repository = var.github_repository
  # prodはstgで検証済みのイメージを昇格させるだけなので、pushは許可しない
  allow_image_push = false
}
