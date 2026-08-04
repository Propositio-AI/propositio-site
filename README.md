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

## 使用方法（サンプルのTodoアプリ）

このリポジトリには、DB連携・ルーティングを含む一気通貫のTodoアプリがサンプル実装として入っている（バックエンドの`Task`エンティティ、フロントエンドの`/`・`/todos/:id`ルート）。起動後、http://localhost:5173 にアクセスすると以下の操作ができる。

| 画面 | パス | できること |
| --- | --- | --- |
| 一覧ページ | `/` | 入力欄からTodoを新規追加、チェックボックスで完了/未完了を切り替え、削除ボタンで削除、タイトルクリックで詳細ページへ遷移 |
| 詳細ページ | `/todos/:id` | タイトル・説明を編集して保存、完了/未完了の切り替え、削除（削除後は一覧に戻る）、一覧ページへのリンク |

データはPostgreSQLに永続化され、フロントエンドはTanStack Query（orval生成Hooks経由）でバックエンドAPIと同期する。バックエンドAPIを直接叩く場合は以下のエンドポイントが使える（詳細はSwagger UI: http://localhost:8000/docs を参照）。

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/tasks` | Todo一覧を取得 |
| POST | `/tasks` | Todoを新規作成（`title`必須、`description`任意） |
| GET | `/tasks/{id}` | Todoを1件取得 |
| PATCH | `/tasks/{id}` | Todoを部分更新（`title` / `description` / `is_done`） |
| DELETE | `/tasks/{id}` | Todoを削除 |

このTodoアプリ自体が「新しいエンティティ・画面を追加する際のお手本」になっている。実装の詳細・拡張方法は [docs/architecture.md](./docs/architecture.md)、[docs/development.md](./docs/development.md) を参照。

## ドキュメント

詳しい使用方法は [`docs/`](./docs) を参照。

- [docs/getting-started.md](./docs/getting-started.md) — セットアップ・起動・環境変数の詳細
- [docs/architecture.md](./docs/architecture.md) — ディレクトリ構成・レイヤー分離の設計方針
- [docs/development.md](./docs/development.md) — 新機能の追加手順、API自動生成、マイグレーション、テスト、Lint/Format、コメント規約

AIエージェント向けの規約は [`CLAUDE.md`](./CLAUDE.md) を参照。
