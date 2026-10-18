output "ecr_repository_url" {
  description = "APIイメージのECRリポジトリURL"
  value       = aws_ecr_repository.api.repository_url
}

output "ses_identity" {
  description = "SESで認証した送信ドメイン"
  value       = aws_sesv2_email_identity.domain.email_identity
}

output "ses_configuration_set" {
  description = "SESの設定セット名（APIの SES_CONFIGURATION_SET）"
  value       = aws_sesv2_configuration_set.main.configuration_set_name
}

output "hosted_zone_id" {
  description = "Route53ホストゾーンID"
  value       = data.aws_route53_zone.main.zone_id
}
