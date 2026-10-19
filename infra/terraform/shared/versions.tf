terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # bucket / region は terraform init -backend-config=../backend.hcl で渡す
  backend "s3" {
    key = "services/propositio-site/shared/terraform.tfstate"
  }
}

provider "aws" {
  region = local.aws_region

  default_tags {
    tags = {
      Project   = local.defaults.TF_PLATFORM_SERVICE_NAME
      ManagedBy = "terraform"
      Stack     = "shared"
    }
  }
}
