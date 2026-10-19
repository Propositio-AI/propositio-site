terraform {
  required_version = ">= 1.11.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

locals {
  defaults   = jsondecode(file("${path.root}/../../../config/defaults.json"))
  aws_region = local.defaults.AWS_REGION
}

provider "aws" {
  region = local.aws_region
}

data "aws_caller_identity" "current" {}

# stateバケットはpropositio-infraが所有する。このrootは作成処理ではなく、
# 共通基盤が利用可能かを確認してbackend.hclへ設定する値を表示するだけである。
data "aws_s3_bucket" "platform_state" {
  bucket = "${local.defaults.TF_PLATFORM_PROJECT_NAME}-terraform-state-${data.aws_caller_identity.current.account_id}"
}

output "state_bucket" {
  description = "propositio-infraが管理する共通Terraform stateバケット"
  value       = data.aws_s3_bucket.platform_state.id
}
