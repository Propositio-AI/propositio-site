# stg固有サービス

`propositio-infra` の `static-site` に含まれないstg固有機能を、機能単位のTerraform moduleとして管理します。

- `site-api/`: 活動記録取得とお問い合わせを担う公開API

各module内は `api-gateway.tf`、`lambda.tf`、`dynamodb.tf`、`ssm.tf` のようにAWSリソース種別ごとに分割します。
