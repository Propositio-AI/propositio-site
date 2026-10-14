terraform {
  required_version = ">= 1.10.0"

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

  # stateの保存先はinit時に-backend-config="path=..."で環境ごとに切り替える（Floci用と実AWS用を混ぜない）。
  # チームで実AWSを運用する場合は、S3 backendなどリモートstateへ置き換える（docs/infrastructure.md参照）。
  backend "local" {}
}
