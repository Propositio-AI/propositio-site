variable "service_name" { type = string }
variable "aws_region" { type = string }
variable "hosted_zone_id" { type = string }
variable "domain_name" { type = string }
variable "mail_from_subdomain" { type = string }

variable "dmarc_record" {
  type     = string
  default  = null
  nullable = true
}

variable "alarm_email" {
  type     = string
  default  = null
  nullable = true
}

variable "tags" {
  type    = map(string)
  default = {}
}
