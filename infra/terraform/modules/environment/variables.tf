# ---- 共通 ----
variable "project_name" {
  description = "リソース名の接頭辞に使うプロジェクト名。shared と揃える（ECR・SES設定セットの名前に使う）。"
  type        = string
}

variable "environment" {
  description = "環境名（stg / prod）。"
  type        = string

  validation {
    condition     = contains(["stg", "prod"], var.environment)
    error_message = "environment は stg または prod を指定してください。"
  }
}

variable "aws_region" {
  description = "AWSリージョン。"
  type        = string
}

# ---- ドメイン ----
variable "domain_name" {
  description = "Route53のホストゾーン名（例: example.com）。"
  type        = string
}

variable "web_domain" {
  description = "Webサイトのドメイン（例: example.com / stg.example.com）。"
  type        = string
}

variable "api_domain" {
  description = "APIのドメイン（例: api.example.com / api.stg.example.com）。"
  type        = string
}

# ---- ネットワーク ----
variable "vpc_cidr" {
  description = "VPCのCIDR。環境ごとに重ならない範囲にする。"
  type        = string
}

variable "availability_zones" {
  description = "使うアベイラビリティゾーン（2つ）。"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]

  validation {
    condition     = length(var.availability_zones) == 2
    error_message = "availability_zones は2つ指定してください。"
  }
}

# ---- API（ECS） ----
variable "api_image_tag" {
  description = "初回作成時のAPIイメージのタグ（コミットSHA）。以降のイメージ更新はGitHub Actionsのデプロイが行う。"
  type        = string
}

variable "api_cpu" {
  description = "APIタスクのCPUユニット（256 = 0.25vCPU）。"
  type        = number
  default     = 256
}

variable "api_memory" {
  description = "APIタスクのメモリ（MiB）。"
  type        = number
  default     = 512
}

variable "api_min_count" {
  description = "APIタスクの最小数（オートスケーリングの下限）。"
  type        = number
}

variable "api_max_count" {
  description = "APIタスクの最大数（オートスケーリングの上限）。"
  type        = number
}

variable "enable_execute_command" {
  description = "ECS Exec（稼働中のコンテナに入って調査する機能）を有効にするか。"
  type        = bool
  default     = true
}

variable "alb_deletion_protection" {
  description = "ALBの削除保護。"
  type        = bool
}

# ---- DB（RDS PostgreSQL） ----
variable "db_instance_class" {
  description = "RDSのインスタンスクラス。"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "RDSの初期ストレージ（GiB）。"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDSストレージの自動拡張の上限（GiB）。"
  type        = number
  default     = 100
}

variable "db_multi_az" {
  description = "RDSをマルチAZにするか（障害時の自動フェイルオーバー。費用は約2倍）。"
  type        = bool
  default     = false
}

variable "db_backup_retention_days" {
  description = "自動バックアップの保持日数。"
  type        = number
}

variable "db_deletion_protection" {
  description = "RDSの削除保護。trueの場合は削除時に最終スナップショットも取る。"
  type        = bool
}

variable "db_password_version" {
  description = "DBパスワードの版。値を上げてapplyするとパスワードを再生成して入れ替える（stateには残らない）。"
  type        = number
  default     = 1
}

# ---- アプリの設定 ----
variable "microcms_service_domain" {
  description = "microCMSのサービスドメイン（https://<これ>.microcms.io）。APIキーはSecrets Managerに別途設定する。"
  type        = string
}

variable "mail_from" {
  description = "お問い合わせメールの送信元（SESで認証したドメインのアドレス。例: noreply@example.com）。"
  type        = string
}

variable "contact_notify_to" {
  description = "お問い合わせの通知先（運営のGoogle Workspaceアドレス）。自動返信のReply-Toにも使う。"
  type        = string
}

# ---- 運用 ----
variable "log_retention_days" {
  description = "CloudWatch Logsの保持日数。"
  type        = number
}

variable "noindex" {
  description = "検索エンジンにインデックスさせない（X-Robots-Tag: noindex を付ける）。stg用。"
  type        = bool
  default     = false
}

variable "alarm_email" {
  description = "アラームの通知先メールアドレス。nullなら通知先を作らない。"
  type        = string
  default     = null
  nullable    = true
}

variable "github_repository" {
  description = "デプロイを許可するGitHubリポジトリ（owner/name）。"
  type        = string
}

variable "allow_image_push" {
  description = "デプロイロールにECRへのpushを許可するか。prodはstgでビルドしたイメージを昇格させるだけなのでfalseにする。"
  type        = bool
}
