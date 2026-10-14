# propositio-base

全プロジェクトのベースとなるリポジトリ。pnpm workspace + uv のモノレポで、Web・モバイル・バックエンドと、AWS基盤（Terraform）をまとめて持つ。

## 構成

| パス | 内容 |
| --- | --- |
| `apps/web` | Web（React 19 + TypeScript + Vite + React Compiler / react-router-dom / TailwindCSS v4 + shadcn/ui） |
| `apps/mobile` | モバイル（Expo SDK 57 + React Native / Expo Router。WebViewを使わないネイティブUI） |
| `packages/api-client` | Web / モバイル共通のAPIクライアント（orvalでOpenAPIから自動生成 + TanStack Query） |
| `services/backend` | バックエンド（FastAPI + Python 3.12 / SQLAlchemy 2.0 + Alembic / PostgreSQL 16） |
| `infra/terraform` | AWS基盤（Cognito / S3 / DynamoDB）。実AWSとFlociで同じコードを使う |
| `infra/floci` | ローカルでAWSを再現するFloci（AWS互換エミュレータ）のDocker Compose |

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

### AWS互換開発（Floci + Terraform）

```bash
make floci-up      # Floci（http://localhost:4566）を起動する
make plan-floci    # infra/terraform をFlociに対してplanする
make apply-floci   # Flociへapplyする（Cognito / S3 / DynamoDB）
make infra-output  # 作成したUser Pool ID・バケット名などを表示する
make destroy-floci # Flociから削除する
make floci-down    # Flociを停止する
```

ホストに`terraform`が無くても、Makefileが公式Dockerイメージで実行する。実AWSへの適用手順は [docs/infrastructure.md](./docs/infrastructure.md) を参照。

他のコマンド（テスト・Lint・マイグレーションなど）は `make help` で一覧表示できる。

## ドキュメント

詳しい使用方法は [`docs/`](./docs) を参照。

- [docs/getting-started.md](./docs/getting-started.md) — セットアップ・起動・環境変数の詳細
- [docs/architecture.md](./docs/architecture.md) — ディレクトリ構成・レイヤー分離の設計方針
- [docs/development.md](./docs/development.md) — 新機能の追加手順、API自動生成、マイグレーション、テスト、Lint/Format、CI、コメント規約
- [docs/infrastructure.md](./docs/infrastructure.md) — Terraform / Flociの使い方と実AWSへの適用手順
- [docs/new-project.md](./docs/new-project.md) — このリポジトリをベースに新しいプロジェクトを作る手順

AIエージェント向けの規約は [`CLAUDE.md`](./CLAUDE.md) を参照。
