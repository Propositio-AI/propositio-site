.DEFAULT_GOAL := help

# --- インフラ（Terraform）用の設定 ---
TF_DIR := infra/terraform
# 検証する Terraform のルート（state を持つ単位）
TF_ROOTS := bootstrap shared envs/stg envs/prod
# ホストにterraformが無い場合に使う公式Dockerイメージのバージョン
TF_VERSION ?= 1.16.5

# ホストのterraformを優先し、無ければDockerで実行する
ifneq ($(shell command -v terraform 2>/dev/null),)
TERRAFORM := cd "$(CURDIR)/$(TF_DIR)" && terraform
else
TERRAFORM := docker run --rm -i $(shell [ -t 0 ] && echo -t) \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp -e CHECKPOINT_DISABLE=1 \
	-v "$(CURDIR)/$(TF_DIR):/workspace" -w /workspace \
	hashicorp/terraform:$(TF_VERSION)
endif

.PHONY: help setup install up up-d down down-v build restart logs ps \
	dev-mobile \
	migrate makemigration seed \
	generate-api \
	test test-backend test-web test-api-client test-mobile \
	lint lint-backend lint-js \
	typecheck \
	format format-backend format-js \
	shell-backend shell-web shell-db \
	infra-fmt infra-validate

help: ## コマンド一覧を表示する
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

## --- 通常開発（PostgreSQL + FastAPI + Web をDockerで起動） ---

setup: ## .env.exampleから各.envを作成する（既存の.envは上書きしない）
	[ -f .env ] || cp .env.example .env
	[ -f services/backend/.env ] || cp services/backend/.env.example services/backend/.env
	[ -f apps/web/.env ] || cp apps/web/.env.example apps/web/.env
	[ -f apps/mobile/.env ] || cp apps/mobile/.env.example apps/mobile/.env

install: ## ホストにpnpm workspace（web / mobile / api-client）の依存をインストールする
	pnpm install

up: setup ## ビルドしてコンテナ（db / backend / web）をフォアグラウンドで起動する
	docker compose up --build

up-d: setup ## ビルドしてコンテナ（db / backend / web）をバックグラウンドで起動する
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

dev-mobile: setup ## モバイルアプリ（Expo）の開発サーバーをホスト上で起動する（要: make install）
	pnpm dev:mobile

## --- DB（マイグレーション・シード） ---

migrate: ## マイグレーションを最新まで適用する
	docker compose exec backend uv run alembic upgrade head

makemigration: ## マイグレーションを新規作成する（例: make makemigration MESSAGE="add xxx"）
	docker compose exec backend uv run alembic revision --autogenerate -m "$(MESSAGE)"

seed: ## 初期データを投入する（既にデータがあればスキップされる）
	docker compose exec backend uv run python -m app.seed.seed

## --- API自動生成 ---

generate-api: ## OpenAPIスキーマをリポジトリルートに書き出し、packages/api-clientを再生成する
	docker compose exec -T backend uv run python -m app.export_openapi - > openapi.json
	docker compose exec web pnpm --workspace-root generate:api

## --- テスト ---

test: test-backend test-web test-api-client test-mobile ## 全パッケージのテストを実行する

test-backend: ## backendのテスト（pytest）を実行する
	docker compose exec backend uv run pytest

test-web: ## webのテスト（Vitest）を実行する
	docker compose exec web pnpm test

test-api-client: ## api-clientのテスト（Vitest）をホスト上で実行する
	pnpm --filter @repo/api-client test

test-mobile: ## mobileのテスト（Jest）をホスト上で実行する
	pnpm --filter mobile test

## --- Lint / 型チェック / Format ---

lint: lint-backend lint-js ## backend / TypeScript全体のLintを実行する

lint-backend: ## backendのLint（ruff）を実行する
	docker compose exec backend uv run ruff check .

lint-js: ## web / mobile / api-clientのLint（ESLint）をホスト上で実行する
	pnpm lint

typecheck: ## web / mobile / api-clientの型チェックをホスト上で実行する
	pnpm typecheck

format: format-backend format-js ## backend / TypeScript全体をフォーマットする

format-backend: ## backendをフォーマットする（ruff format）
	docker compose exec backend uv run ruff format .

format-js: ## web / mobile / api-clientをフォーマットする（Prettier）
	pnpm format

## --- コンテナに入る ---

shell-backend: ## backendコンテナ内でshellを開く
	docker compose exec backend bash

shell-web: ## webコンテナ内でshellを開く
	docker compose exec web sh

shell-db: ## psqlでDBに接続する
	docker compose exec db psql -U $${POSTGRES_USER:-app} -d $${POSTGRES_DB:-app}

## --- インフラ（Terraform）。実AWSへの plan / apply は誤適用を防ぐため手動で行う（docs/infrastructure.md） ---

infra-fmt: ## Terraformコードを整形する
	$(TERRAFORM) fmt -recursive

infra-validate: ## Terraformのfmtチェックと、全ルートの構文検証を行う（backend・クラウド接続なし）
	$(TERRAFORM) fmt -check -recursive
	@for root in $(TF_ROOTS); do \
		echo "==> $$root"; \
		$(TERRAFORM) -chdir=$$root init -input=false -backend=false >/dev/null && \
		$(TERRAFORM) -chdir=$$root validate || exit 1; \
	done
