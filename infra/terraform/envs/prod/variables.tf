# アカウント・ドメイン固有の値（terraform.tfvars で渡す）。環境ごとのサイズ等は main.tf に書く。

variable "aws_region" {
  description = "AWSリージョン。"
  type        = string
  default     = null
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

variable "destroy_mode" {
  description = "安全なdestroy planで削除保護とS3保持を解除する内部フラグ。通常はfalse。"
  type        = bool
  default     = false
}
