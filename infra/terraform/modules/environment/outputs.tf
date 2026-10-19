output "web_url" {
  description = "WebサイトのURL"
  value       = "https://${var.web_domain}"
}

output "api_url" {
  description = "APIのURL"
  value       = "https://${var.api_domain}"
}

output "app_parameter_prefix" {
  description = "アプリ用SSM Parameter Storeのパス接頭辞"
  value       = local.parameter_prefix
}

output "db_endpoint" {
  description = "RDSのエンドポイント（VPC内からのみ接続可能）"
  value       = aws_db_instance.main.address
}

output "github_environment_variables" {
  description = "GitHubの Environment（stg / prod）に登録する変数。デプロイワークフローが参照する。"
  value = {
    AWS_REGION                 = var.aws_region
    ECR_REPOSITORY             = data.aws_ecr_repository.api.name
    ECS_CLUSTER                = aws_ecs_cluster.main.name
    ECS_SERVICE                = aws_ecs_service.api.name
    ECS_TASK_FAMILY            = aws_ecs_task_definition.api.family
    ECS_CONTAINER_NAME         = local.api_container_name
    ECS_SUBNETS                = join(",", aws_subnet.public[*].id)
    ECS_SECURITY_GROUP         = aws_security_group.api.id
    ECS_ASSIGN_PUBLIC_IP       = "ENABLED"
    WEB_BUCKET                 = aws_s3_bucket.web.id
    CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.web.id
    VITE_API_BASE_URL          = "https://${var.api_domain}"
    WEB_URL                    = "https://${var.web_domain}"
  }
}
