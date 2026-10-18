locals {
  db_name     = "app"
  db_username = "app"
}

resource "aws_db_subnet_group" "main" {
  name       = local.name_prefix
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_db_parameter_group" "main" {
  name   = "${local.name_prefix}-pg16"
  family = "postgres16"

  # TLSなしの接続を拒否する
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  # 1秒以上かかったクエリをログに出す（CloudWatch Logsへ転送される）
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }
}

resource "aws_db_instance" "main" {
  identifier     = local.name_prefix
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class

  db_name             = local.db_name
  username            = local.db_username
  password_wo         = ephemeral.random_password.db.result
  password_wo_version = var.db_password_version
  port                = 5432

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  parameter_group_name   = aws_db_parameter_group.main.name
  publicly_accessible    = false
  multi_az               = var.db_multi_az
  ca_cert_identifier     = "rds-ca-rsa2048-g1"

  # バックアップは03:00〜03:30 JST、メンテナンスは月曜04:00〜05:00 JST
  backup_retention_period    = var.db_backup_retention_days
  backup_window              = "18:00-18:30"
  maintenance_window         = "sun:19:00-sun:20:00"
  auto_minor_version_upgrade = true
  copy_tags_to_snapshot      = true

  enabled_cloudwatch_logs_exports = ["postgresql"]

  deletion_protection       = var.db_deletion_protection
  skip_final_snapshot       = !var.db_deletion_protection
  final_snapshot_identifier = "${local.name_prefix}-final"
}
