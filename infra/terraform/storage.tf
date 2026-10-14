# アプリのファイル保存用の非公開S3バケット（バージョニング・暗号化・パブリックアクセス全面ブロック）
resource "aws_s3_bucket" "app" {
  bucket        = "${local.name_prefix}-app-${random_id.suffix.hex}"
  force_destroy = var.s3_force_destroy
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ACLを無効化し、オブジェクトの所有者を常にバケット所有者にする
resource "aws_s3_bucket_ownership_controls" "app" {
  bucket = aws_s3_bucket.app.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app" {
  bucket = aws_s3_bucket.app.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# アプリ用のDynamoDBテーブル（pk / sk の汎用キーを持つシングルテーブル設計の土台）
resource "aws_dynamodb_table" "app" {
  name                        = "${local.name_prefix}-app"
  billing_mode                = "PAY_PER_REQUEST"
  hash_key                    = "pk"
  range_key                   = "sk"
  deletion_protection_enabled = !local.is_floci && var.dynamodb_deletion_protection

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  # AWSマネージドキー（aws/dynamodb）で保存時暗号化する
  server_side_encryption {
    enabled = true
  }

  point_in_time_recovery {
    enabled = var.dynamodb_point_in_time_recovery
  }
}
