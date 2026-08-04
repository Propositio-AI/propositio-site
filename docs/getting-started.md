# はじめに（セットアップ・起動方法）

## 必要なもの

- Docker / Docker Compose（開発は基本的にDocker上で完結する）
- ローカルでコマンドを直接実行したい場合のみ: Node.js 22 / pnpm、Python 3.12 / uv

## 1. 環境変数ファイルを用意する

各`.env.example`をコピーして`.env`を作成する（`.env`はgitignore対象）。

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| ファイル | 主な変数 | 用途 |
| --- | --- | --- |
| `.env` | `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | PostgreSQLコンテナの初期化 |
| `backend/.env` | `DATABASE_URL` / `CORS_ORIGINS` | FastAPIの接続先DB・許可オリジン |
| `frontend/.env` | `VITE_API_BASE_URL` | フロントエンドから見たAPIのベースURL |

## 2. 起動する

```bash
docker compose up --build
```

これで以下が自動的に行われる。

- PostgreSQLコンテナが起動し、ヘルスチェックが通るまでbackendは待機する
- backendコンテナ起動時に `alembic upgrade head` が自動実行され、テーブルが作成される
- frontend/backendともにソースコードをbind mountしているため、ホストでファイルを編集すると即座にホットリロードされる

## 3. アクセス先

| サービス | URL |
| --- | --- |
| フロントエンド | http://localhost:5173 |
| バックエンドAPI | http://localhost:8000 |
| APIドキュメント（Swagger UI） | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |

## 4. 初期データ（シード）を投入する

初期データの投入は自動実行されない。起動後に一度だけ手動で実行する。

```bash
docker compose exec backend uv run python -m app.seed.seed
```

すでにデータが存在する場合は何もせずスキップされるため、何度実行しても安全。

## 5. 止める・片付ける

```bash
docker compose down       # コンテナを停止（DBデータは保持される）
docker compose down -v    # DBデータも含めて完全に削除する場合
```

## よくある操作

| やりたいこと | コマンド |
| --- | --- |
| ログを見る | `docker compose logs -f backend` / `frontend` |
| backendコンテナ内でコマンド実行 | `docker compose exec backend uv run <コマンド>` |
| frontendコンテナ内でコマンド実行 | `docker compose exec frontend pnpm <コマンド>` |
| 再ビルド | `docker compose up --build` |

さらに詳しい開発の進め方（新機能の追加手順、API自動生成、マイグレーション、テストなど）は [development.md](./development.md) を参照。
リポジトリの構成・設計方針は [architecture.md](./architecture.md) を参照。
