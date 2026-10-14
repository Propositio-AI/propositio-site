.DEFAULT_GOAL := help

# --- AWS互換開発（Floci + Terraform）用の設定 ---
TF_DIR := infra/terraform
# ホストにterraformが無い場合に使う公式Dockerイメージのバージョン
TF_VERSION ?= 1.16.5
# FlociのComposeプロジェクト名（チェックアウトしたディレクトリ名から作り、複数プロジェクトでボリュームを共有しない）
FLOCI_PROJECT_NAME ?= $(shell basename "$(CURDIR)" | tr '[:upper:].' '[:lower:]-')-floci
FLOCI := docker compose -p $(FLOCI_PROJECT_NAME) -f infra/floci/docker-compose.yml
FLOCI_URL ?= http://localhost:4566
# terraform plan / apply / destroy に追加で渡す引数（例: make apply-floci ARGS=-auto-approve）
ARGS ?=

# ホストのterraformを優先し、無ければDockerで実行する（DockerからはホストのFlociへhost.docker.internal経由で接続する）
ifneq ($(shell command -v terraform 2>/dev/null),)
TERRAFORM := terraform -chdir=$(TF_DIR)
TF_FLOCI_ENDPOINT := $(FLOCI_URL)
else
TERRAFORM := docker run --rm -i $(shell [ -t 0 ] && echo -t) \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp -e CHECKPOINT_DISABLE=1 \
	--add-host=host.docker.internal:host-gateway \
	-v "$(CURDIR)/$(TF_DIR):/workspace" -w /workspace \
	hashicorp/terraform:$(TF_VERSION)
TF_FLOCI_ENDPOINT := $(subst localhost,host.docker.internal,$(FLOCI_URL))
endif
TF_FLOCI_VARS := -var-file=envs/floci.tfvars -var="aws_endpoint_url=$(TF_FLOCI_ENDPOINT)"

.PHONY: help setup install up up-d down down-v build restart logs ps \
	dev-mobile \
	migrate makemigration seed \
	generate-api \
	test test-backend test-web test-api-client test-mobile \
	lint lint-backend lint-js \
	typecheck \
	format format-backend format-js \
	shell-backend shell-web shell-db \
	floci-up floci-down floci-down-v floci-logs floci-health \
	infra-fmt infra-init infra-validate infra-output plan-floci apply-floci destroy-floci

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

## --- AWS互換開発（Floci + Terraform。通常開発のコンテナとは独立して動く） ---

floci-up: ## Floci（AWS互換エミュレータ, :4566）を起動し、ヘルスチェックが通るまで待つ
	$(FLOCI) up -d --wait

floci-down: ## Flociを停止する（作成したリソースはボリュームに保持される）
	$(FLOCI) down

floci-down-v: ## Flociを停止し、保持していたリソースも含めて削除する
	$(FLOCI) down -v

floci-logs: ## Flociのログを追跡表示する
	$(FLOCI) logs -f

floci-health: ## Flociのヘルスチェック（サービスごとの状態）を表示する
	curl -fsS $(FLOCI_URL)/_localstack/health
	@echo

infra-fmt: ## Terraformコードを整形する
	$(TERRAFORM) fmt -recursive

infra-init: ## Floci用stateでTerraformを初期化する（stateは infra/terraform/floci.tfstate）
	$(TERRAFORM) init -input=false -reconfigure -backend-config=path=floci.tfstate

infra-validate: ## Terraformのfmtチェックと構文検証を行う（backend・クラウド接続なし）
	$(TERRAFORM) fmt -check -recursive
	$(TERRAFORM) init -input=false -backend=false
	$(TERRAFORM) validate

infra-output: ## Terraformの出力（User Pool ID・バケット名など）を表示する
	$(TERRAFORM) output

plan-floci: floci-health infra-init ## Flociへの変更内容を確認する
	$(TERRAFORM) plan -input=false $(TF_FLOCI_VARS) $(ARGS)

apply-floci: floci-health infra-init ## Flociへ適用する（確認プロンプトを省くには ARGS=-auto-approve）
	$(TERRAFORM) apply -input=false $(TF_FLOCI_VARS) $(ARGS)

destroy-floci: floci-health infra-init ## Flociに作成したリソースを削除する
	$(TERRAFORM) destroy -input=false $(TF_FLOCI_VARS) $(ARGS)
