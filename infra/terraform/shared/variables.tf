variable "aws_region" {
  description = "AWSリージョン。"
  type        = string
  default     = null
}

variable "mail_from_subdomain" {
  description = "SESのカスタムMAIL FROMに使うサブドメイン。SPFをこのサブドメインに閉じ込め、既存のメール受信用SPFに触れない。"
  type        = string
  default     = null
}

variable "dmarc_record" {
  description = "_dmarc に作るTXTレコードの値（例: \"v=DMARC1; p=none; rua=mailto:dmarc@example.com\"）。既にDMARCを設定済みならnullのままにする。"
  type        = string
  default     = null
  nullable    = true
}

variable "alarm_email" {
  description = "SESの評判（バウンス率・苦情率）アラームの通知先。nullなら通知先を作らない。"
  type        = string
  default     = null
  nullable    = true
}

locals {
  defaults            = jsondecode(file("${path.root}/../../../config/defaults.json"))
  aws_region          = var.aws_region != null ? var.aws_region : local.defaults.AWS_REGION
  mail_from_subdomain = var.mail_from_subdomain != null ? var.mail_from_subdomain : local.defaults.TF_MAIL_FROM_SUBDOMAIN
  platform            = data.terraform_remote_state.platform.outputs.service_platform_config[local.defaults.TF_PLATFORM_SERVICE_NAME]
}
