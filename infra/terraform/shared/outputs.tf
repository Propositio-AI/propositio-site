output "ses_identity" {
  description = "SESで認証した送信ドメイン"
  value       = module.contact_mail.ses_identity
}

output "ses_configuration_set" {
  description = "お問い合わせLambdaが使うSES設定セット名"
  value       = module.contact_mail.ses_configuration_set
}

output "hosted_zone_id" {
  description = "propositio.comのRoute53ホストゾーンID"
  value       = local.platform.route53_zone_id
}
