# propositio-site AWS構成・構築・デプロイ

propositio-siteは`propositio-infra`に登録された`static-site`を利用し、サイト固有機能だけをこのリポジトリに追加します。ECS・RDS・ALB・ECR・Cognitoは使いません。

## 全体構成

```mermaid
flowchart LR
  U[利用者のブラウザ]
  MC[microCMS]
  INFO[info@propositio.com]

  subgraph DNS[Amazon Route 53 / propositio.com]
    WEB_DNS[stg.propositio.com]
    API_DNS[api.stg.propositio.com]
    MAIL_DNS[DKIM・MAIL FROM records]
  end

  subgraph WEB[Web配信]
    ACM[Amazon Certificate Manager<br/>TLS certificate]
    CF[Amazon CloudFront<br/>TLS・CSP・SPA rewrite]
    OAC[Origin Access Control]
    S3[(Private Amazon S3<br/>React/Vite build)]
  end

  subgraph API[Site API / ap-northeast-1]
    APIGW[Amazon API Gateway<br/>HTTP API・CORS・throttle]
    L[AWS Lambda<br/>Python 3.13 arm64]
    DDB[(Amazon DynamoDB<br/>お問い合わせ)]
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

  subgraph DELIVERY[Webデプロイ]
    GH[GitHub Actions]
    OIDC[GitHub OIDC]
    ROLE[stg deploy IAM Role]
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

AWS公式アイコンを画像ファイルとしてリポジトリへ複製しません。READMEで壊れやすい外部画像URLや、ライセンス確認の難しいアイコンを埋め込まず、GitHubでそのまま保守できるMermaidとサービス正式名称を使います。AWS公式の詳細図が必要な資料だけ、AWS Architecture Iconsの最新版をダウンロードして別の作図データとして管理します。

### 通信経路

| URL・経路 | AWSサービス | 用途 |
| --- | --- | --- |
| `https://stg.propositio.com` | Route 53 → CloudFront → private S3 | React/Viteの静的サイト |
| `https://api.stg.propositio.com/activities` | Route 53 → API Gateway → Lambda → microCMS | 活動記録の取得 |
| `https://api.stg.propositio.com/contacts` | Route 53 → API Gateway → Lambda → DynamoDB/SES | 問い合わせ受付、通知、自動返信 |
| `/propositio/stg/propositio-site/app/*` | SSM Parameter Store + KMS | microCMS API key、Turnstile secret |

### Terraform stateの境界

```text
services/propositio-site/shared/terraform.tfstate
  └─ SES identity、DKIM・MAIL FROM、Configuration Set、共有メール監視

services/propositio-site/stg/terraform.tfstate
  └─ S3、CloudFront、Web/API DNS・ACM、API Gateway、Lambda、DynamoDB、SSM/KMS、環境監視
```

このサイトは`static-site`構成です。VPC、ECS、RDS、Cognitoは使用しません。Web用S3は公開せず、CloudFront Origin Access Control経由だけで読み取れます。GitHubのdeploy RoleはWeb配信だけに使用し、Terraformの変更権限とは分離しています。

## どこで何を管理するか

| 対象 | 正本 | 内容 |
| --- | --- | --- |
| 共通module | `propositio-infra/infra/terraform/modules` | S3、CloudFront、Route53等の単一部品 |
| 標準構成 | `propositio-infra/infra/terraform/service-types/static-site` | static-site部品の組合せ |
| deploy Role登録 | `propositio-infra/config/defaults.json` | GitHub repository、resource prefix、deploy権限 |
| サービス構成 | `infra/terraform/env/<env>/main.tf` | type、profile、Hosted Zone、Web/API/aliasドメイン |
| 共通state・OIDC・Role | `propositio-infra/infra/terraform/shared` | 全サービス共通の接続基盤 |
| site共有 | `infra/terraform/shared` | SES identity、DKIM、MAIL FROM、reputation alarm |
| stg/prod | `infra/terraform/env/<env>` | static-siteの呼出し、API Gateway/Lambda/DynamoDB/SSM |
| site固有module | `infra/terraform/env/<env>/service/site-api` | API Gateway、Lambda、DynamoDB、SSMをリソース別ファイルで管理 |
| 共有メールmodule | `infra/terraform/shared/service/mail` | SES、DNS、SNS、CloudWatchをリソース別ファイルで管理 |
| 環境固有非秘密値 | `infra/terraform/env/<env>/terraform.tfvars` | microCMS service domain、通知先等（Git管理外） |
| 秘密値 | SSM `/propositio/<env>/propositio-site/app/*` | microCMS API key、Turnstile secret |
| Terraform state | S3 `propositio-terraform-state-539247480876` | `services/propositio-site/{shared,stg,prod}/terraform.tfstate` |
| Web配信 | `.github/workflows/deploy.yml` | build、S3 sync、CloudFront invalidation |

`config/defaults.json`の`TF_INFRA_MODULE_VERSION`が利用するinfra tagの正本です。`make sync-infra-version`でmodule sourceへ反映し、`make check-infra-version`で不一致を検出します。

## 環境差

| | stg | prod |
| --- | --- | --- |
| Web | `stg.propositio.com`、noindex | `propositio.com`、`www.propositio.com` |
| API | `api.stg.propositio.com` | `api.propositio.com` |
| S3 versioning | 無効 | 有効 |
| Lambda log | 30日 | 90日 |
| Webデプロイ | mainのCI成功後に自動 | 手動＋GitHub Environment承認 |

API Gateway、Lambda、DynamoDB on-demandはリクエストがない時間の常時稼働費を持ちません。CloudFront/S3/SESも使用量ベースです。

## 初回構築

### 0. 前提

- `propositio-infra v1.2.0`以降が公開されている。
- infra shared stateに`propositio-site = static-site`が登録されている。
- `propositio-infra`が管理するstate bucket、GitHub OIDC provider、環境別deploy Role、Route53 hosted zoneが存在する。
- AWSへ`make aws-login`でログイン済み。
- Docker版Terraformを使う場合は、同じ親フォルダに`propositio-infra`をcheckoutしている（`../propositio-infra`）。ホスト版Terraformを使う場合はGitHub認証済みであればよい。
- GitHub ActionsのTerraform CI用にrepository secret `INFRA_REPOSITORY_TOKEN`がある。privateな`propositio-infra`をreadできるfine-grained tokenを使う。

新しい開発者がAWSアカウント、Identity Center、state bucket、OIDC providerを作り直す必要はありません。通常必要なのは既存AWS profileでのログインと、このrepositoryの環境ファイル作成だけです。

### 1. ローカル設定

```bash
cp infra/terraform/shared/terraform.tfvars.example infra/terraform/shared/terraform.tfvars
cp infra/terraform/env/stg/terraform.tfvars.example infra/terraform/env/stg/terraform.tfvars
cp infra/terraform/env/prod/terraform.tfvars.example infra/terraform/env/prod/terraform.tfvars
```

各環境の`terraform.tfvars`に次を設定します。

```hcl
microcms_service_domain = "microCMSのservice domain"
contact_notify_to       = "info@propositio.com"
# alarm_email           = "通知を受けるアドレス"
```

これらの`terraform.tfvars`はGit管理外です。API keyやpasswordは書きません。S3 backend設定はMakefileがAWSアカウントIDと共通命名規則から自動生成します。

### 2. SES共有リソース

```bash
make shared-plan-aws
terraform -chdir=infra/terraform/shared show shared.tfplan
make shared-apply-aws
```

ここではSES identity、DKIM、`mail.propositio.com`のMAIL FROMとSPFを作ります。既存のメール受信用MXは変更しないため、`info@propositio.com`での受信・返信はそのままです。SESがsandboxの場合は東京リージョンでproduction accessを申請します。

### 3. stgインフラ

```bash
make plan-aws ENV=stg
terraform -chdir=infra/terraform/env/stg show stg.tfplan
make apply-aws ENV=stg
make output-aws ENV=stg
```

planでは必ずadd/change/destroyの件数と、置換対象、DNS名を確認します。`apply-aws`は保存済みplanだけを適用するため、plan後にコードを変更した場合は作り直します。

### 4. SSM秘密値

apply直後は安全なplaceholderです。AWS ConsoleのSystems Manager → Parameter Storeから、出力されたprefix配下を更新します。

| parameter | 値 |
| --- | --- |
| `/propositio/stg/propositio-site/app/microcms-api-key` | microCMS API key |
| `/propositio/stg/propositio-site/app/turnstile-secret-key` | Turnstile secret。未使用なら`disabled` |

値はSecureStringで、環境専用KMS keyにより暗号化されます。Lambdaは実行時に取得するため、値の更新後に再デプロイは不要です（warm instanceは短時間cacheする場合があります）。prodも`stg`を`prod`へ読み替えます。

### 5. GitHub Environment

Settings → Environmentsに`stg`と`prod`を作り、prodにはRequired reviewersを設定します。

各環境に次のVariablesを登録します。

- `AWS_DEPLOY_ROLE_ARN`: `propositio-infra`の`github_deploy_role_arn.<env>`
- `AWS_REGION`
- `WEB_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `VITE_API_BASE_URL`
- `WEB_URL`
- `VITE_TURNSTILE_SITE_KEY`（使う場合）

後半5項目は`make output-aws ENV=<env>`の`github_environment_variables`が正本です。

## デプロイとフック

| 操作 | 結果 |
| --- | --- |
| PR / main push | CIでlint、typecheck、test、build、Terraform validate |
| main pushのCI成功 | `workflow_run`がstg Deployを開始 |
| Actions → Deploy → Run workflow → prod | prod Environment承認後に配信 |
| Terraformコード変更 | pushだけではAWS変更なし。手元でplan/apply |

DeployはWebをbuildし、hash付きassetsを長期cacheでS3へ同期し、`index.html`をno-cacheで配置し、CloudFrontの`/`と`/index.html`をinvalidateします。API LambdaはTerraform applyで更新されます。

### ロールバック

ActionsのDeployを手動実行し、`ref`へ戻したいcommit SHAを指定します。S3 versioningを有効にしたprodではオブジェクト履歴も残りますが、通常は再build・再配信を正規手順とします。APIのロールバックは対象commitへ戻して新しいTerraform planを作り、内容を確認してapplyします。

## 日常運用

```bash
make infra-fmt
make infra-validate
make plan-aws ENV=stg
make apply-aws ENV=stg
```

- Lambda log: `/aws/lambda/propositio-site-<env>-site-api`
- お問い合わせ保存先: DynamoDB `propositio-site-<env>-contacts`
- メール: SES configuration set `propositio-site`
- Lambda error: `alarm_email`を指定した場合にSNS通知
- SES bounce/complaint: sharedのCloudWatch alarm

お問い合わせ本文とメールアドレスはDynamoDBに保存されます。公開APIに一覧・取得routeはありません。必要になったら保持期限、削除手続き、管理者向け閲覧方法を明示してから機能追加します。

## 削除

削除はstate backupと明示的な確認文字列を要求します。

```bash
make destroy-plan-aws ENV=stg CONFIRM=propositio-site-stg
terraform -chdir=infra/terraform/env/stg show destroy-stg.tfplan
make destroy-apply-aws ENV=stg CONFIRM=propositio-site-stg
```

prod、shared、共通Route53 hosted zone、共通OIDC/Roleは別責務です。特にshared SESを削除するとstg/prod両方の送信へ影響するため、環境削除と同時に削除しません。
