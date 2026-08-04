.DEFAULT_GOAL := help

.PHONY: help setup up up-d down down-v build restart logs ps \
	migrate makemigration seed \
	generate-api \
	test test-backend test-frontend \
	lint lint-backend lint-frontend \
	format format-backend format-frontend \
	shell-backend shell-frontend shell-db

help: ## コマンド一覧を表示する
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

## --- セットアップ・起動 ---

setup: ## .env.exampleから各.envを作成する（既存の.envは上書きしない）
	[ -f .env ] || cp .env.example .env
	[ -f backend/.env ] || cp backend/.env.example backend/.env
	[ -f frontend/.env ] || cp frontend/.env.example frontend/.env

up: setup ## ビルドしてコンテナをフォアグラウンドで起動する
	docker compose up --build

up-d: setup ## ビルドしてコンテナをバックグラウンドで起動する
	docker compose up --build -d

down: ## コンテナを停止する（DBデータは保持される）
	docker compose down

down-v: ## コンテナを停止し、DBデータも含めて削除する
	docker compose down -v

build: ## イメージを再ビルドする
	docker compose build

restart: ## コンテナを再起動する
	docker compose restart

logs: ## 全コンテナのログを追跡表示する
	docker compose logs -f

ps: ## コンテナの状態を表示する
	docker compose ps

## --- DB（マイグレーション・シード） ---

migrate: ## マイグレーションを最新まで適用する
	docker compose exec backend uv run alembic upgrade head

makemigration: ## マイグレーションを新規作成する（例: make makemigration MESSAGE="add xxx"）
	docker compose exec backend uv run alembic revision --autogenerate -m "$(MESSAGE)"

seed: ## 初期データを投入する（既にデータがあればスキップされる）
	docker compose exec backend uv run python -m app.seed.seed

## --- API自動生成 ---

generate-api: ## OpenAPIスキーマを書き出し、フロントのAPIクライアントを再生成する
	docker compose exec backend uv run python -m app.export_openapi
	docker compose exec frontend pnpm generate:api

## --- テスト ---

test: test-backend test-frontend ## backend/frontend両方のテストを実行する

test-backend: ## backendのテスト（pytest）を実行する
	docker compose exec backend uv run pytest

test-frontend: ## frontendのテスト（Vitest）を実行する
	docker compose exec frontend pnpm test

## --- Lint / Format ---

lint: lint-backend lint-frontend ## backend/frontend両方のLintを実行する

lint-backend: ## backendのLint（ruff）を実行する
	docker compose exec backend uv run ruff check .

lint-frontend: ## frontendのLint（ESLint）を実行する
	docker compose exec frontend pnpm lint

format: format-backend format-frontend ## backend/frontend両方をフォーマットする

format-backend: ## backendをフォーマットする（ruff format）
	docker compose exec backend uv run ruff format .

format-frontend: ## frontendをフォーマットする（Prettier）
	docker compose exec frontend pnpm format

## --- コンテナに入る ---

shell-backend: ## backendコンテナ内でshellを開く
	docker compose exec backend bash

shell-frontend: ## frontendコンテナ内でshellを開く
	docker compose exec frontend sh

shell-db: ## psqlでDBに接続する
	docker compose exec db psql -U $${POSTGRES_USER:-app} -d $${POSTGRES_DB:-app}
