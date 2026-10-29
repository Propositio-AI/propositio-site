# propositio-site

Propositio AI / Karynos の公式サイトです。Webは React + Vite、ローカルAPIは FastAPI で開発し、AWSでは固定費を抑えるため **static-site** として配信します。

## 本番構成

| 役割 | AWSサービス | 管理場所 |
| --- | --- | --- |
| Web配信 | S3 + CloudFront + ACM | `propositio-infra`の`static-site`を`infra/terraform/env/<env>`から利用 |
| DNS | Route53 | Hosted Zone・ドメイン名は`env/<env>/main.tf`、レコード作成はinfraのservice typeとsite固有module |
| 活動記録API | API Gateway + Lambda → microCMS | `infra/terraform/env/<env>/service/site-api` |
| お問い合わせ | API Gateway + Lambda + DynamoDB + SES | `infra/terraform/env/<env>/service/site-api` |
| 秘密値 | SSM Parameter Store + KMS | propositio-site固有、環境別 |
| CI/CD | GitHub Actions + AWS OIDC | Roleは`propositio-infra`、配信は`.github/workflows/deploy.yml` |

ECS・RDS・ALB・ECR・Cognitoは使用しません。共通基盤とsiteの責務、初回構築、GitHub設定は[インフラ運用マニュアル](./docs/infrastructure.md)にまとめています。

## リポジトリ構成

| パス | 内容 |
| --- | --- |
| `apps/web` | 公開Web（React 19 + TypeScript + Vite） |
| `services/backend` | ローカル開発・API契約の正本（FastAPI） |
| `packages/api-client` | OpenAPIから生成するWeb共通APIクライアント |
| `infra/terraform/env/<env>` | stg/prodの静的サイトとsite固有APIを組み立てるroot |
| `infra/terraform/shared` | stg/prod共通のSESドメイン認証 |
| `infra/terraform/env/<env>/service` | propositio-siteだけが使うTerraform module |
| `config/defaults.json` | ローカルツール、AWS CLI、Terraform、共通module versionの既定値 |
| `infra/terraform/env/<env>/main.tf` | サービス名、profile、Hosted Zone、Web/APIドメインの正本 |

## ローカル開発

前提は Docker / Docker Compose、Node.js 22.18以上、pnpm 12、`make`です。

```bash
make up            # PostgreSQL / FastAPI / Webを起動
make seed          # 初回データ
make install       # pnpm依存関係
make generate-api  # OpenAPIからAPI clientを生成
```

- Web: <http://localhost:5173>
- API / Swagger: <http://localhost:8000> / <http://localhost:8000/docs>

ローカルではFastAPIで実装と契約を検証します。AWSでは同じ公開契約（`activities`、`categories`、`contacts`）を小さなLambdaが実装します。

## AWSへの反映

```bash
make aws-login
make shared-plan-aws
make shared-apply-aws
make plan-aws ENV=stg
make apply-aws ENV=stg
```

`main`のCI成功がstg配信のフックです。prodはActionsの`Deploy`を手動実行し、GitHub Environmentの承認後に配信します。インフラ変更はpushだけでは適用されず、保存したTerraform planを人が確認してapplyします。

## ドキュメント

- [AWS構成・構築・デプロイ](./docs/infrastructure.md)
- [ローカルセットアップ](./docs/getting-started.md)
- [アプリ設計](./docs/architecture.md)
- [開発手順](./docs/development.md)
- [microCMS・お問い合わせ・Turnstile](./docs/karynos-site.md)

コマンド一覧は`make help`で確認できます。
