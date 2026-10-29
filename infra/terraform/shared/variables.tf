variable "aws_region" {
  type     = string
  default  = null
  nullable = true
}

variable "mail_from_subdomain" {
  type     = string
  default  = null
  nullable = true
}

variable "dmarc_record" {
  description = "既存DMARCをこのstateで管理するときだけ値を設定する。"
  type        = string
  default     = null
  nullable    = true
}

variable "alarm_email" {
  description = "SES reputation alarmの通知先。nullなら通知を作らない。"
  type        = string
  default     = null
  nullable    = true
}
