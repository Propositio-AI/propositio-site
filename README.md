# propositio-base

全プロジェクトのベースとなるリポジトリ。React (Vite) + FastAPI + PostgreSQLを、それぞれ独立したDockerコンテナで起動する。

## 技術スタック

- フロントエンド: React 19 + TypeScript + Vite + React Compiler / TailwindCSS + shadcn/ui / TanStack Query（orvalでOpenAPIから自動生成）
- バックエンド: FastAPI + Python 3.12 / SQLAlchemy 2.0 + Alembic
- DB: PostgreSQL 16

## 起動方法

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000 （Swagger UI: http://localhost:8000/docs）

初期データを投入する場合（初回のみ）:

```bash
docker compose exec backend uv run python -m app.seed.seed
```

## ドキュメント

詳しい使用方法は [`docs/`](./docs) を参照。

- [docs/getting-started.md](./docs/getting-started.md) — セットアップ・起動・環境変数の詳細
- [docs/architecture.md](./docs/architecture.md) — ディレクトリ構成・レイヤー分離の設計方針
- [docs/development.md](./docs/development.md) — 新機能の追加手順、API自動生成、マイグレーション、テスト、Lint/Format、コメント規約

AIエージェント向けの規約は [`CLAUDE.md`](./CLAUDE.md) を参照。
