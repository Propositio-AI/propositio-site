# メールアドレスでサインアップし、確認コードでメールを検証するCognito User Pool。
# MFAはTOTP（認証アプリ）を任意で有効化できる（OPTIONAL）。
resource "aws_cognito_user_pool" "main" {
  name                     = local.name_prefix
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OPTIONAL"
  deletion_protection      = !local.is_floci && var.cognito_deletion_protection ? "ACTIVE" : "INACTIVE"

  software_token_mfa_configuration {
    enabled = true
  }

  # require_symbols はCognito既定と同じtrueにする（Flociはfalseを保存せずtrueを返すため、差分も出なくなる）
  password_policy {
    minimum_length                   = 10
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 3
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # メールアドレス変更時も、新しいアドレスの確認が済むまで旧アドレスを有効なままにする
  user_attribute_update_settings {
    attributes_require_verification_before_update = ["email"]
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "確認コードのお知らせ"
    email_message        = "確認コードは {####} です。"
  }

  # 既定ではCognito標準のメール送信を使う（送信数に上限あり）。本番運用ではSESへ切り替える。
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
}

# Web（apps/web）とモバイル（apps/mobile）用のpublic client。
# ブラウザやアプリにシークレットを安全に保持できないため、client secretは発行しない。
resource "aws_cognito_user_pool_client" "public" {
  for_each = local.cognito_public_clients

  name                          = "${local.name_prefix}-${each.key}"
  user_pool_id                  = aws_cognito_user_pool.main.id
  generate_secret               = false
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true

  # パスワードを平文で送らないSRPと、リフレッシュトークンによる再発行のみ許可する
  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]

  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  # OAuth（Hosted UI / 外部IdP）はコールバックURLを渡したときだけ有効にする（Authorization Code + PKCE）
  supported_identity_providers         = ["COGNITO"]
  allowed_oauth_flows_user_pool_client = local.cognito_oauth_enabled
  allowed_oauth_flows                  = local.cognito_oauth_enabled ? ["code"] : []
  allowed_oauth_scopes                 = local.cognito_oauth_enabled ? ["openid", "email", "profile"] : []
  callback_urls                        = local.cognito_oauth_enabled ? var.cognito_callback_urls : []
  logout_urls                          = local.cognito_oauth_enabled ? var.cognito_logout_urls : []
}
