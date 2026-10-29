variable "name_prefix" { type = string }
variable "parameter_prefix" { type = string }
variable "aws_region" { type = string }
variable "hosted_zone_id" { type = string }
variable "api_domain_name" { type = string }
variable "web_origins" { type = list(string) }
variable "microcms_service_domain" { type = string }
variable "mail_from" { type = string }
variable "contact_notify_to" { type = string }
variable "ses_identity" { type = string }
variable "ses_configuration_set" { type = string }
variable "handler_source_file" { type = string }

variable "alarm_email" {
  type     = string
  default  = null
  nullable = true
}

variable "log_retention_days" {
  type    = number
  default = 30
}

variable "tags" {
  type    = map(string)
  default = {}
}
