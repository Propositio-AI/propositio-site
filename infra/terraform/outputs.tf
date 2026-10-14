output "aws_region" {
  description = "リソースを作成したリージョン"
  value       = var.aws_region
}

output "aws_endpoint_url" {
  description = "接続先のAWS互換エンドポイント（実AWSの場合はnull）"
  value       = var.aws_endpoint_url
}

output "name_prefix" {
  description = "リソース名の接頭辞（project_name-environment）"
  value       = local.name_prefix
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.main.arn
}

output "cognito_web_client_id" {
  description = "Web（apps/web）用のpublic client ID"
  value       = aws_cognito_user_pool_client.public["web"].id
}

output "cognito_mobile_client_id" {
  description = "モバイル（apps/mobile）用のpublic client ID"
  value       = aws_cognito_user_pool_client.public["mobile"].id
}

output "s3_bucket_name" {
  description = "アプリ用S3バケット名"
  value       = aws_s3_bucket.app.id
}

output "s3_bucket_arn" {
  description = "アプリ用S3バケットARN"
  value       = aws_s3_bucket.app.arn
}

output "dynamodb_table_name" {
  description = "アプリ用DynamoDBテーブル名"
  value       = aws_dynamodb_table.app.name
}

output "dynamodb_table_arn" {
  description = "アプリ用DynamoDBテーブルARN"
  value       = aws_dynamodb_table.app.arn
}
