variable "environment" {
  type = string
  validation {
    condition     = contains(["stg", "prod"], var.environment)
    error_message = "environment must be stg or prod."
  }
}

variable "microcms_service_domain" { type = string }
variable "contact_notify_to" { type = string }

variable "alarm_email" {
  type     = string
  default  = null
  nullable = true
}

variable "noindex" {
  type     = bool
  default  = null
  nullable = true
}

variable "destroy_mode" {
  description = "destroy plan専用。S3内のオブジェクトが残っていても削除できるようにする。"
  type        = bool
  default     = false
}

variable "extra_tags" {
  type    = map(string)
  default = {}
}
