data "archive_file" "function" {
  type        = "zip"
  source_file = var.handler_source_file
  output_path = "${path.root}/${var.name_prefix}-site-api.zip"
}
