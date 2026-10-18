variable "project_name" {
  description = "リソース名の接頭辞に使うプロジェクト名（小文字英数字とハイフン）。envs/* と揃える。"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,22}[a-z0-9]$", var.project_name))
    error_message = "project_name は小文字英字で始まる3〜24文字の小文字英数字・ハイフンで指定してください。"
  }
}

variable "aws_region" {
  description = "AWSリージョン。"
  type        = string
  default     = "ap-northeast-1"
}

variable "domain_name" {
  description = "Route53のホストゾーン名（例: example.com）。SESの送信ドメインにもなる。ホストゾーンは事前に作成しておく。"
  type        = string
}

variable "mail_from_subdomain" {
  description = "SESのカスタムMAIL FROMに使うサブドメイン。SPFをこのサブドメインに閉じ込め、既存（Google Workspace）のSPFに触れない。"
  type        = string
  default     = "mail"
}

variable "dmarc_record" {
  description = "_dmarc に作るTXTレコードの値（例: \"v=DMARC1; p=none; rua=mailto:dmarc@example.com\"）。既にDMARCを設定済みならnullのままにする。"
  type        = string
  default     = null
  nullable    = true
}

variable "create_github_oidc_provider" {
  description = "GitHub ActionsのOIDCプロバイダーを作るか。同じAWSアカウントに既にある場合はfalseにする。"
  type        = bool
  default     = true
}

variable "alarm_email" {
  description = "SESの評判（バウンス率・苦情率）アラームの通知先。nullなら通知先を作らない。"
  type        = string
  default     = null
  nullable    = true
}
