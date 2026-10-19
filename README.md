# propositio-base

全プロジェクトのベースとなるリポジトリ。pnpm workspace + uv のモノレポで、Web・モバイル・バックエンドと、AWS基盤（Terraform）をまとめて持つ。

## 構成

| パス | 内容 |
| --- | --- |
| `apps/web` | Web（React 19 + TypeScript + Vite + React Compiler / react-router-dom / TailwindCSS v4 + shadcn/ui） |
| `apps/mobile` | モバイル（Expo SDK 57 + React Native / Expo Router。WebViewを使わないネイティブUI） |
| `packages/api-client` | Web / モバイル共通のAPIクライアント（orvalでOpenAPIから自動生成 + TanStack Query） |
| `services/backend` | バックエンド（FastAPI + Python 3.12 / SQLAlchemy 2.0 + Alembic / PostgreSQL 16） |
| `infra/terraform` | AWS基盤（ECS・RDS・S3 + CloudFront・SES・Route53）。stg / prod の2環境 |
| `config/defaults.json` | AWS CLI、Terraform、サイト基盤の既定値を一元管理する正本 |

## 既定値の管理

AWSリージョン、CLI・Terraformのバージョン、ECS・RDSなどのTerraform既定値は[`config/defaults.json`](./config/defaults.json)だけで管理します。Makefile、Terraform、GitHub Actions、AWS確認スクリプトは同じファイルを参照します。

```bash
make config-show
make config-value KEY=TF_DB_INSTANCE_CLASS
```

stg/prod固有値は`infra/terraform/envs/<env>`、秘密値はSSM Parameter Storeなどへ分離し、`config/defaults.json`には保存しません。

Terraform stateバケット、GitHub ActionsのOIDC Providerとdeploy Role、共通Cognito、公開ドメイン名の登録は`propositio-infra`が所有します。このリポジリは`service_platform_config["propositio-site"]`の出力値を利用し、その名前に対するACM証明書、CloudFront/ALB、Route 53 recordを作成します。詳しい接続・既存stateの移行手順は[docs/infrastructure.md](./docs/infrastructure.md)を参照してください。

## 起動方法

開発環境は2つに分かれていて、互いに独立して起動する。

### 通常開発（PostgreSQL + FastAPI + Web）

前提: Docker / Docker Compose、Node.js 22.18以上 + pnpm 12（corepack）、`make`

```bash
make up          # .envを作成し、db / backend / web をビルドして起動する
make seed        # 初期データを投入する（初回のみ）
make install     # ホストにpnpm workspaceの依存をインストールする（mobile・Lint・型チェック用）
make generate-api  # OpenAPIからAPIクライアント（packages/api-client）を生成する
make dev-mobile  # モバイル（Expo）の開発サーバーをホスト上で起動する
```

- Web: http://localhost:5173
- バックエンドAPI: http://localhost:8000 （Swagger UI: http://localhost:8000/docs）
- PostgreSQL: localhost:5432

### 本番・ステージング（AWS）

main にマージすると GitHub Actions が stg へ自動デプロイし、prod へは承認付きの手動実行でデプロイする。インフラの構成・初回構築・運用は [docs/infrastructure.md](./docs/infrastructure.md) を参照。

```bash
make plan-aws ENV=stg   # 実AWSの差分を保存して確認
make apply-aws ENV=stg  # 確認済みの保存planだけを適用
```

ECSはパブリックサブネットでPublic IPを使い、受信をALBからだけに制限する。RDSはプライベートサブネットへ置き、NAT Gatewayを設けないことを低コスト標準とする。

他のコマンド（テスト・Lint・マイグレーションなど）は `make help` で一覧表示できる。

## ドキュメント

詳しい使用方法は [`docs/`](./docs) を参照。

- [docs/getting-started.md](./docs/getting-started.md) — セットアップ・起動・環境変数の詳細
- [docs/architecture.md](./docs/architecture.md) — ディレクトリ構成・レイヤー分離の設計方針
- [docs/development.md](./docs/development.md) — 新機能の追加手順、API自動生成、マイグレーション、テスト、Lint/Format、CI、コメント規約
- [docs/infrastructure.md](./docs/infrastructure.md) — AWSの構成（Terraform）・初回構築・デプロイ・運用
- [docs/karynos-site.md](./docs/karynos-site.md) — microCMS・SES（お問い合わせメール）・Turnstileの設定
- [docs/new-project.md](./docs/new-project.md) — このリポジトリをベースに新しいプロジェクトを作る手順

AIエージェント向けの規約は [`CLAUDE.md`](./CLAUDE.md) を参照。
