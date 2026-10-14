# aws_endpoint_url を指定するとFloci（ローカルのAWS互換エミュレータ）へ、nullなら実AWSへ向く。
# リソース定義は両者で共通にし、差分はこのproviderブロックと locals.is_floci による切り替えだけに閉じ込める。
provider "aws" {
  region = var.aws_region

  # Flociはダミーの認証情報を受け付ける。実AWSでは通常の認証チェーン（AWS_PROFILE / SSO等）を使う。
  access_key                  = local.is_floci ? "test" : null
  secret_key                  = local.is_floci ? "test" : null
  skip_credentials_validation = local.is_floci
  skip_metadata_api_check     = local.is_floci
  skip_requesting_account_id  = local.is_floci
  skip_region_validation      = local.is_floci
  s3_use_path_style           = local.is_floci

  # 利用する全サービスのエンドポイントをFlociへ向ける（1つでも漏れると実AWSへ接続しに行く）
  dynamic "endpoints" {
    for_each = local.is_floci ? [var.aws_endpoint_url] : []
    content {
      cognitoidp = endpoints.value
      dynamodb   = endpoints.value
      s3         = endpoints.value
      sts        = endpoints.value
    }
  }

  default_tags {
    tags = local.common_tags
  }
}
