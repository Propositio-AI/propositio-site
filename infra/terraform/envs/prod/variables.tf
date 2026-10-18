# アカウント・ドメイン固有の値（terraform.tfvars で渡す）。環境ごとのサイズ等は main.tf に書く。

variable "project_name" {
  description = "shared と同じプロジェクト名。"
  type        = string
}

variable "aws_region" {
  description = "AWSリージョン。"
  type        = string
  default     = "ap-northeast-1"
}

variable "domain_name" {
  description = "Route53のホストゾーン名（例: example.com）。"
  type        = string
}

variable "github_repository" {
  description = "デプロイを許可するGitHubリポジトリ（owner/name）。"
  type        = string
}

variable "api_image_tag" {
  description = "初回作成時のAPIイメージのタグ（ECRにpush済みのコミットSHA）。"
  type        = string
}

variable "microcms_service_domain" {
  description = "microCMSのサービスドメイン。"
  type        = string
}

variable "alarm_email" {
  description = "アラームの通知先。nullなら通知しない。"
  type        = string
  default     = null
  nullable    = true
}
