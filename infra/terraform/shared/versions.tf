terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # bucket・key・regionはMakefileが共通命名規則からinit時に渡す。
  backend "s3" {}
}

provider "aws" {
  region = local.aws_region

  default_tags {
    tags = {
      Project   = local.service_name
      ManagedBy = "terraform"
      Stack     = "shared"
    }
  }
}
