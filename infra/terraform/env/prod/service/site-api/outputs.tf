output "api_url" { value = "https://${var.api_domain_name}" }
output "parameter_prefix" { value = local.parameter_prefix }
output "contacts_table_name" { value = aws_dynamodb_table.contacts.name }
