data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "function" {
  name               = "${var.name_prefix}-site-api"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "logs" {
  role       = aws_iam_role.function.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "function" {
  statement {
    actions = ["ssm:GetParameter"]
    resources = [
      aws_ssm_parameter.microcms_api_key.arn,
      aws_ssm_parameter.turnstile_secret_key.arn,
    ]
  }
  statement {
    actions   = ["kms:Decrypt"]
    resources = [aws_kms_key.parameters.arn]
  }
  statement {
    actions   = ["dynamodb:PutItem", "dynamodb:Query"]
    resources = [aws_dynamodb_table.contacts.arn, "${aws_dynamodb_table.contacts.arn}/index/*"]
  }
  statement {
    actions = ["ses:SendEmail"]
    resources = [
      "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identity/${var.ses_identity}",
      "arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:configuration-set/${var.ses_configuration_set}",
    ]
    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"
      values   = [var.mail_from]
    }
  }
}

resource "aws_iam_role_policy" "function" {
  name   = "site-api"
  role   = aws_iam_role.function.id
  policy = data.aws_iam_policy_document.function.json
}
