variable "project_name" {
  description = "リソース名の接頭辞に使うプロジェクト名（小文字英数字とハイフン）。"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,22}[a-z0-9]$", var.project_name))
    error_message = "project_name は小文字英字で始まる3〜24文字の小文字英数字・ハイフンで指定してください。"
  }
}

variable "environment" {
  description = "環境名（例: local / dev / stg / prod）。リソース名とタグに使う。"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9]{1,9}$", var.environment))
    error_message = "environment は小文字英字で始まる2〜10文字の小文字英数字で指定してください。"
  }
}

variable "aws_region" {
  description = "AWSリージョン。Floci利用時はFLOCI_DEFAULT_REGIONと揃える。"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_endpoint_url" {
  description = "AWS互換エミュレータ（Floci）のエンドポイント。nullなら実AWSへ接続する。"
  type        = string
  default     = null
  nullable    = true

  validation {
    condition     = var.aws_endpoint_url == null || can(regex("^https?://", var.aws_endpoint_url))
    error_message = "aws_endpoint_url は null または http(s):// で始まるURLで指定してください。"
  }
}

variable "extra_tags" {
  description = "全リソースに追加で付与するタグ。"
  type        = map(string)
  default     = {}
}

variable "cognito_callback_urls" {
  description = "将来OAuth（Hosted UI / 外部IdP）を有効化する際のコールバックURL。空ならOAuthフローは無効。"
  type        = list(string)
  default     = []
}

variable "cognito_logout_urls" {
  description = "将来OAuthを有効化する際のサインアウト後のリダイレクトURL。"
  type        = list(string)
  default     = []
}

variable "cognito_deletion_protection" {
  description = "Cognito User Poolの削除保護を有効にするか。Flociでは常に無効として扱う。"
  type        = bool
  default     = true
}

variable "s3_force_destroy" {
  description = "オブジェクトが残っていてもS3バケットを削除できるようにするか（ローカル・検証環境向け）。"
  type        = bool
  default     = false
}

variable "dynamodb_point_in_time_recovery" {
  description = "DynamoDBのポイントインタイムリカバリ（PITR）を有効にするか。"
  type        = bool
  default     = true
}

variable "dynamodb_deletion_protection" {
  description = "DynamoDBテーブルの削除保護を有効にするか。Flociでは常に無効として扱う。"
  type        = bool
  default     = true
}
