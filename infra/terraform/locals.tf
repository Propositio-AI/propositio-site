locals {
  # aws_endpoint_url が指定されていればFloci（AWS互換エミュレータ）へ向ける
  is_floci    = var.aws_endpoint_url != null
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = merge(
    var.extra_tags,
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
  )

  # Cognitoのpublic client（client secretなし）を作るアプリの一覧
  cognito_public_clients = toset(["web", "mobile"])
  cognito_oauth_enabled  = length(var.cognito_callback_urls) > 0
}

# グローバルに一意である必要があるリソース名（S3バケット）の衝突を避けるための接尾辞
resource "random_id" "suffix" {
  byte_length = 4
}
