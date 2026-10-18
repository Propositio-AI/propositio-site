# アプリとDBの設定値は、環境ごとのSSM Parameter Storeパスへ集約する。
# DBパスワードはwrite-only属性で渡すためTerraform stateには保存されない。
resource "aws_kms_key" "parameters" {
  description             = "SSM SecureString parameters for ${local.name_prefix}"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_kms_alias" "parameters" {
  name          = "alias/${local.name_prefix}-parameters"
  target_key_id = aws_kms_key.parameters.key_id
}

ephemeral "random_password" "db" {
  length           = 32
  override_special = "!#%^*()-_=+[]{}"
}

locals {
  parameter_prefix = "/propositio/${var.environment}/karynos"
}

resource "aws_ssm_parameter" "db_host" {
  name  = "${local.parameter_prefix}/db/host"
  type  = "String"
  value = aws_db_instance.main.address
}
resource "aws_ssm_parameter" "db_port" {
  name  = "${local.parameter_prefix}/db/port"
  type  = "String"
  value = tostring(aws_db_instance.main.port)
}
resource "aws_ssm_parameter" "db_name" {
  name  = "${local.parameter_prefix}/db/name"
  type  = "String"
  value = local.db_name
}
resource "aws_ssm_parameter" "db_user" {
  name  = "${local.parameter_prefix}/db/user"
  type  = "String"
  value = local.db_username
}
resource "aws_ssm_parameter" "db_password" {
  name             = "${local.parameter_prefix}/db/password"
  type             = "SecureString"
  key_id           = aws_kms_key.parameters.arn
  value_wo         = ephemeral.random_password.db.result
  value_wo_version = var.db_password_version
}

resource "aws_ssm_parameter" "microcms_api_key" {
  name   = "${local.parameter_prefix}/app/microcms-api-key"
  type   = "SecureString"
  key_id = aws_kms_key.parameters.arn
  value  = "CHANGE_ME"
  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "turnstile_secret_key" {
  name   = "${local.parameter_prefix}/app/turnstile-secret-key"
  type   = "SecureString"
  key_id = aws_kms_key.parameters.arn
  value  = "disabled"
  lifecycle { ignore_changes = [value] }
}
