# Floci（ローカルのAWS互換エミュレータ）へ適用するための設定。秘密値は含めない。
# 認証情報はproviders.tfでダミー値（test / test）を使う。
project_name     = "app"
environment      = "local"
aws_region       = "ap-northeast-1" # infra/floci/docker-compose.yml の FLOCI_DEFAULT_REGION と揃える
aws_endpoint_url = "http://localhost:4566"

# ローカルでは作り直しやすさを優先する（削除保護はFloci時に自動で無効化される）
s3_force_destroy                = true
dynamodb_point_in_time_recovery = false
