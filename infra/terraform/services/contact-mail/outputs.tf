output "ses_identity" { value = aws_sesv2_email_identity.this.email_identity }
output "ses_configuration_set" { value = aws_sesv2_configuration_set.this.configuration_set_name }
