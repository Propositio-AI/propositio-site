resource "aws_kms_key" "parameters" {
  description             = "${var.name_prefix} site API parameters"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags                    = var.tags
}

resource "aws_kms_alias" "parameters" {
  name          = "alias/${var.name_prefix}-site-api"
  target_key_id = aws_kms_key.parameters.key_id
}
