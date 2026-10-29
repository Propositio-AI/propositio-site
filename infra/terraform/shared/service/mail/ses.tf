resource "aws_sesv2_configuration_set" "this" {
  configuration_set_name = var.service_name
  tags                   = var.tags

  reputation_options { reputation_metrics_enabled = true }
  suppression_options { suppressed_reasons = ["BOUNCE", "COMPLAINT"] }
  sending_options { sending_enabled = true }
}

resource "aws_sesv2_email_identity" "this" {
  email_identity         = var.domain_name
  configuration_set_name = aws_sesv2_configuration_set.this.configuration_set_name
  tags                   = var.tags

  dkim_signing_attributes { next_signing_key_length = "RSA_2048_BIT" }
}
