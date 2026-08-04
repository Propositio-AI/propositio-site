# propositio-base

全プロジェクトのベースとなるリポジトリ。React (Vite) + FastAPI + PostgreSQLを、それぞれ独立したDockerコンテナで起動する。

## 技術スタック

- フロントエンド: React 19 + TypeScript + Vite + React Compiler / TailwindCSS + shadcn/ui / TanStack Query（orvalでOpenAPIから自動生成）
- バックエンド: FastAPI + Python 3.12 / SQLAlchemy 2.0 + Alembic
- DB: PostgreSQL 16

## 起動方法

`make`コマンドが使える場合:

```bash
make up      # .envを作成し、ビルドしてコンテナを起動する
make seed    # 初期データを投入する（初回のみ）
```

`make`が無い場合:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
docker compose exec backend uv run python -m app.seed.seed  # 初期データ投入（初回のみ）
```

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000 （Swagger UI: http://localhost:8000/docs）

他によく使うコマンドは `make help` で一覧表示できる（テスト・Lint・マイグレーションなど）。

## ドキュメント

詳しい使用方法は [`docs/`](./docs) を参照。

- [docs/getting-started.md](./docs/getting-started.md) — セットアップ・起動・環境変数の詳細
- [docs/architecture.md](./docs/architecture.md) — ディレクトリ構成・レイヤー分離の設計方針
- [docs/development.md](./docs/development.md) — 新機能の追加手順、API自動生成、マイグレーション、テスト、Lint/Format、コメント規約

AIエージェント向けの規約は [`CLAUDE.md`](./CLAUDE.md) を参照。
