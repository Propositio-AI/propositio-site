# ---------------------------------------------------------------------------
# DBパスワード：apply中だけ生成し（ephemeral）、RDSとSecrets Managerへwrite-only属性で渡す。
# パスワードはTerraformのstateにもplanにも残らない。入れ替えるときは db_password_version を上げる。
# ---------------------------------------------------------------------------
ephemeral "random_password" "db" {
  length = 32
  # RDSが許可しない文字（/ @ " 空白）を含めない
  override_special = "!#%^*()-_=+[]{}"
}

resource "aws_secretsmanager_secret" "db" {
  name                    = "${local.name_prefix}/db"
  description             = "RDS master credentials (${local.name_prefix})"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string_wo = jsonencode({
    username = local.db_username
    password = ephemeral.random_password.db.result
  })
  secret_string_wo_version = var.db_password_version
}

# ---------------------------------------------------------------------------
# アプリの秘密値（microCMSのAPIキー・Turnstileのシークレット）。
# 値はTerraformで管理せず、適用後にAWS CLI / コンソールで設定する（docs/infrastructure.md 参照）。
# ---------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "app" {
  name                    = "${local.name_prefix}/app"
  description             = "Application secrets for the API (${local.name_prefix})"
  recovery_window_in_days = 7
}

resource "aws_secretsmanager_secret_version" "app_placeholder" {
  secret_id = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({
    MICROCMS_API_KEY = "CHANGE_ME"
    # "disabled" のままならTurnstileの検証を行わない
    TURNSTILE_SECRET_KEY = "disabled"
  })

  # 運用者が設定した実際の値をTerraformで上書きしない
  lifecycle {
    ignore_changes = [secret_string]
  }
}
