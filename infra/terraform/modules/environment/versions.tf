terraform {
  # 1.11以上: DBパスワードをstateに残さない write-only 属性（password_wo / secret_string_wo）を使うため
  required_version = ">= 1.11.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
      # CloudFront用のACM証明書は us-east-1 に作る必要がある
      configuration_aliases = [aws.us_east_1]
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }
}
