# propositio-site AWS構成・構築・デプロイ

propositio-siteは本番環境だけを運用します。`propositio-infra`の`static-site`を利用し、活動記録とお問い合わせに必要なsite固有機能だけをこのリポジトリで管理します。ECS・RDS・ALB・ECR・Cognitoは使用しません。

## 全体構成

```mermaid
flowchart LR
  U[利用者のブラウザ]
  MC[microCMS]
  INFO[info@propositio.com]

  subgraph DNS[Amazon Route 53 / propositio.com]
    WEB_DNS[propositio.com / www]
    API_DNS[api.propositio.com]
    MAIL_DNS[DKIM・MAIL FROM records]
  end

  subgraph WEB[Web配信]
    ACM[Amazon Certificate Manager]
    CF[Amazon CloudFront<br/>TLS・CSP・SPA rewrite]
    OAC[Origin Access Control]
    S3[(Private Amazon S3<br/>React/Vite build・versioning)]
  end

  subgraph API[Site API / ap-northeast-1]
    APIGW[Amazon API Gateway<br/>HTTP API・CORS・throttle]
    L[AWS Lambda<br/>Python 3.13 arm64]
    DDB[(Amazon DynamoDB<br/>お問い合わせ・PITR)]
    SSM[AWS Systems Manager<br/>SecureString]
    KMS[AWS KMS]
  end

  subgraph MAIL[メール]
    SES[Amazon SES<br/>propositio.com identity]
    CONFIG[SES Configuration Set]
  end

  subgraph MONITORING[監視]
    LOGS[Amazon CloudWatch Logs]
    ALARM[CloudWatch Alarms]
    SNS[Amazon SNS]
  end

  subgraph DELIVERY[本番Webデプロイ]
    GH[GitHub Actions]
    OIDC[GitHub OIDC]
    ROLE[prod deploy IAM Role]
  end

  subgraph PROVISIONING[インフラ管理]
    DEV[開発者]
    LOGIN[AWS login]
    TF[Terraform CLI]
    STATE[(Terraform state S3)]
  end

  U --> WEB_DNS --> CF --> OAC --> S3
  ACM --> CF
  U --> API_DNS --> APIGW --> L
  L --> MC
  L --> DDB
  L --> SSM --> KMS
  L --> SES
  CONFIG --> SES
  MAIL_DNS --> SES
  SES -->|お問い合わせ通知・返信先は送信者| INFO
  SES -->|自動返信| U
  L --> LOGS --> ALARM --> SNS --> INFO
  SES --> ALARM

  GH --> OIDC --> ROLE
  ROLE -.->|Web upload| S3
  ROLE -.->|cache invalidation| CF
  DEV --> LOGIN --> TF
  TF <--> STATE
  TF -.->|plan / apply| DNS
  TF -.->|plan / apply| WEB
  TF -.->|plan / apply| API
  TF -.->|plan / apply| MAIL
  TF -.->|plan / apply| MONITORING
```

AWS公式アイコンを画像として複製せず、GitHubで保守できるMermaidとAWSサービス正式名称を使います。対外資料で公式アイコンが必要な場合は、AWS Architecture Iconsの最新版から別の作図データを作ります。

## URLと通信経路

| URL・経路 | AWSサービス | 用途 |
| --- | --- | --- |
| `https://propositio.com` | Route 53 → CloudFront → private S3 | React/Viteの公式サイト |
| `https://www.propositio.com` | Route 53 → CloudFront → `propositio.com`へ301 | Web alias |
| `https://api.propositio.com/activities` | Route 53 → API Gateway → Lambda → microCMS | 活動記録の取得 |
| `https://api.propositio.com/contacts` | Route 53 → API Gateway → Lambda → DynamoDB/SES | 問い合わせ受付、通知、自動返信 |
| `/propositio/prod/propositio-site/app/*` | SSM Parameter Store + KMS | microCMS API key、Turnstile secret |

Web用S3は公開せず、CloudFront Origin Access Control経由だけで読み取れます。GitHubのdeploy RoleはS3同期とCloudFront invalidationだけに使い、Terraform変更権限とは分離しています。

## どこで何を管理するか

| 対象 | 正本 | 内容 |
| --- | --- | --- |
| 共通module | `propositio-infra/infra/terraform/modules` | S3、CloudFront、Route 53等の単一部品 |
| 標準構成 | `propositio-infra/infra/terraform/service-types/static-site` | static-site部品の組合せ |
| prod deploy Role | `propositio-infra/config/defaults.json` | `propositio-site`の利用環境を`prod`だけに限定 |
| サービス本番構成 | `infra/terraform/env/prod/main.tf` | profile、Hosted Zone、Web/APIドメイン |
| site固有module | `infra/terraform/env/prod/service/site-api` | API Gateway、Lambda、DynamoDB、SSM/KMS |
| 共有メールmodule | `infra/terraform/shared/service/mail` | SES、DNS、SNS、CloudWatch |
| 非秘密値 | `infra/terraform/env/prod/terraform.tfvars` | microCMS service domain、通知先等（Git管理外） |
| 秘密値 | SSM `/propositio/prod/propositio-site/app/*` | microCMS API key、Turnstile secret |
| Terraform state | S3 `propositio-terraform-state-539247480876` | `services/propositio-site/{shared,prod}/terraform.tfstate` |
| Web配信 | `.github/workflows/deploy.yml` | build、S3 sync、CloudFront invalidation |

## Terraform stateの境界

```text
services/propositio-site/shared/terraform.tfstate
  └─ SES identity、DKIM・MAIL FROM、Configuration Set、共有メール監視

services/propositio-site/prod/terraform.tfstate
  └─ S3、CloudFront、Web/API DNS・ACM、API Gateway、Lambda、DynamoDB、SSM/KMS、本番監視
```

## ローカルからのインフラ変更

AWSへログインし、保存されるplanを必ず確認してから適用します。`ENV`の既定値と許可値は`prod`だけです。

```bash
make aws-login
make aws-preflight
make plan-aws
terraform -chdir=infra/terraform/env/prod show prod.tfplan
make apply-aws
make output-aws
```

共有SESを変更する場合だけ、別stateを操作します。

```bash
make shared-plan-aws
terraform -chdir=infra/terraform/shared show shared.tfplan
make shared-apply-aws
```

### SSM秘密値

| parameter | 値 |
| --- | --- |
| `/propositio/prod/propositio-site/app/microcms-api-key` | microCMS API key |
| `/propositio/prod/propositio-site/app/turnstile-secret-key` | Turnstile secret。未設定時は`disabled` |

値はSecureStringで、本番専用KMS keyにより暗号化されます。Lambdaは実行時に取得するため、値の更新後にTerraform applyは不要です。一般公開ではTurnstileのsite keyとsecretを設定することを推奨します。

## GitHub Environment

Settings → Environmentsに`prod`だけを作り、Required reviewersを設定します。

登録するVariables:

- `AWS_DEPLOY_ROLE_ARN`: `arn:aws:iam::539247480876:role/propositio-site-prod-github-deploy`
- `AWS_REGION`
- `WEB_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `VITE_API_BASE_URL`
- `WEB_URL`
- `VITE_TURNSTILE_SITE_KEY`（Turnstile利用時）

後半5項目は`make output-aws`の`github_environment_variables`を正本とします。

## デプロイとフック

| 操作 | 結果 |
| --- | --- |
| PR / main push | CIでlint、typecheck、test、build、Terraform validate |
| main pushのCI成功 | `workflow_run`が本番Deployを開始し、`prod` Environment承認を待つ |
| Actions → Deploy → Run workflow | 指定commit SHAを`prod`へ手動配信 |
| Terraformコード変更 | pushだけではAWS変更なし。ローカルでplan確認後にapply |

DeployはWebをbuildし、hash付きassetsを長期cacheでS3へ同期し、`index.html`をno-cacheで配置してCloudFrontをinvalidateします。API LambdaはTerraform applyで更新します。

### ロールバック

ActionsのDeployを手動実行し、`ref`へ戻したいcommit SHAを指定します。本番S3はversioningを有効にしていますが、通常は過去commitを再build・再配信する手順を使います。APIは対象commitへ戻してTerraform planを確認してからapplyします。

## 日常運用

```bash
make infra-fmt
make infra-validate
make plan-aws
make apply-aws
```

- Lambda log: `/aws/lambda/propositio-site-prod-site-api`
- お問い合わせ: DynamoDB `propositio-site-prod-contacts`
- メール: SES configuration set `propositio-site`
- Lambda error: CloudWatch alarm → SNS
- SES bounce/complaint: sharedのCloudWatch alarm

お問い合わせ本文とメールアドレスはDynamoDBに保存されます。公開APIに一覧・取得routeはありません。

## 本番環境の削除

削除はstate backupと明示的な確認文字列を要求します。通常運用では実行しません。

```bash
make destroy-plan-aws CONFIRM=propositio-site-prod
terraform -chdir=infra/terraform/env/prod show destroy-prod.tfplan
make destroy-apply-aws CONFIRM=propositio-site-prod
```

shared SESを削除するとメール送信全体に影響するため、本番環境と同時には削除しません。
