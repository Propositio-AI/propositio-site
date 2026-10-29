output "web_url" { value = module.site.web_url }
output "api_url" { value = module.site_api.api_url }
output "app_parameter_prefix" { value = module.site_api.parameter_prefix }
output "contacts_table_name" { value = module.site_api.contacts_table_name }

output "github_environment_variables" {
  value = {
    AWS_REGION                 = local.aws_region
    WEB_BUCKET                 = module.site.bucket_name
    CLOUDFRONT_DISTRIBUTION_ID = module.site.cloudfront_distribution_id
    VITE_API_BASE_URL          = module.site_api.api_url
    WEB_URL                    = module.site.web_url
  }
}
