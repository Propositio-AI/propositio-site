.DEFAULT_GOAL := help

DEFAULTS_FILE := $(CURDIR)/config/defaults.json
default = $(shell "$(CURDIR)/scripts/read-default.sh" $(1) "$(DEFAULTS_FILE)")

# --- インフラ（Terraform）用の設定 ---
TF_DIR := infra/terraform
TF_PLATFORM_PROJECT_NAME ?= $(call default,TF_PLATFORM_PROJECT_NAME)
TF_PLATFORM_SERVICE_NAME ?= $(call default,TF_PLATFORM_SERVICE_NAME)
ENV ?=
# 検証する Terraform のルート（state を持つ単位）
TF_ROOTS := bootstrap shared envs/stg envs/prod
# ホストにterraformが無い場合に使う公式Dockerイメージのバージョン
TF_VERSION ?= $(call default,TERRAFORM_VERSION)
AWS_PROFILE ?= $(call default,AWS_PROFILE)
AWS_REGION ?= $(call default,AWS_REGION)
AWS_CLI_VERSION ?= $(call default,AWS_CLI_VERSION)
AWS_SSO_START_URL ?= $(call default,AWS_SSO_START_URL)
AWS_PERMISSION_SET ?= $(call default,AWS_PERMISSION_SET)

# ホストのAWS CLI v2を優先し、無ければ公式コンテナを使う。
# コンテナ利用時も ~/.aws を共有するため、SSO設定と短期セッションはホスト側にだけ保存される。
ifneq ($(shell command -v aws 2>/dev/null),)
AWS := aws
AWS_BATCH := aws
AWS_SSO_LOGIN_FLAGS :=
else
AWS := docker run --rm -i $(shell [ -t 0 ] && echo -t) -v "$(HOME)/.aws:/root/.aws" -e AWS_PROFILE=$(AWS_PROFILE) -e AWS_REGION=$(AWS_REGION) amazon/aws-cli:$(AWS_CLI_VERSION)
AWS_BATCH := docker run --rm -i -v "$(HOME)/.aws:/root/.aws" -e AWS_PROFILE=$(AWS_PROFILE) -e AWS_REGION=$(AWS_REGION) amazon/aws-cli:$(AWS_CLI_VERSION)
AWS_SSO_LOGIN_FLAGS := --use-device-code
endif

# ホストのterraformを優先し、無ければDockerで実行する
ifneq ($(shell command -v terraform 2>/dev/null),)
TERRAFORM := cd "$(CURDIR)/$(TF_DIR)" && terraform
else
TERRAFORM := docker run --rm -i $(shell [ -t 0 ] && echo -t) \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp -e CHECKPOINT_DISABLE=1 \
	-v "$(CURDIR):/repo" -w /repo/$(TF_DIR) \
	hashicorp/terraform:$(TF_VERSION)
endif

ifneq ($(shell command -v terraform 2>/dev/null),)
TERRAFORM_ENV := AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) terraform -chdir=$(TF_DIR)/envs/$(ENV)
TERRAFORM_SHARED := AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) terraform -chdir=$(TF_DIR)/shared
TERRAFORM_SHARED_BATCH := $(TERRAFORM_SHARED)
else
TERRAFORM_ENV := docker run --rm -i $(shell [ -t 0 ] && echo -t) \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp -e CHECKPOINT_DISABLE=1 \
	-e AWS_PROFILE=$(AWS_PROFILE) -e AWS_REGION=$(AWS_REGION) \
	-e TF_DATA_DIR=/repo/$(TF_DIR)/envs/$(ENV)/.terraform \
	-v "$(HOME)/.aws:/tmp/.aws:ro" -v "$(CURDIR):/repo" \
	-w /repo/$(TF_DIR)/envs/$(ENV) hashicorp/terraform:$(TF_VERSION)
TERRAFORM_SHARED := docker run --rm -i $(shell [ -t 0 ] && echo -t) \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp -e CHECKPOINT_DISABLE=1 \
	-e AWS_PROFILE=$(AWS_PROFILE) -e AWS_REGION=$(AWS_REGION) \
	-e TF_DATA_DIR=/repo/$(TF_DIR)/shared/.terraform \
	-v "$(HOME)/.aws:/tmp/.aws:ro" -v "$(CURDIR):/repo" \
	-w /repo/$(TF_DIR)/shared hashicorp/terraform:$(TF_VERSION)
TERRAFORM_SHARED_BATCH := docker run --rm -i \
	--user $(shell id -u):$(shell id -g) -e HOME=/tmp -e CHECKPOINT_DISABLE=1 \
	-e AWS_PROFILE=$(AWS_PROFILE) -e AWS_REGION=$(AWS_REGION) \
	-e TF_DATA_DIR=/repo/$(TF_DIR)/shared/.terraform \
	-v "$(HOME)/.aws:/tmp/.aws:ro" -v "$(CURDIR):/repo" \
	-w /repo/$(TF_DIR)/shared hashicorp/terraform:$(TF_VERSION)
endif

.PHONY: help config-show config-value setup install up up-d down down-v build restart logs ps \
	dev-mobile \
	migrate makemigration seed \
	generate-api \
	test test-backend test-web test-api-client test-mobile \
	lint lint-backend lint-js \
	typecheck \
	format format-backend format-js \
	shell-backend shell-web shell-db \
	aws-configure aws-login aws-whoami aws-logout aws-preflight \
	infra-fmt infra-validate check-shared-aws check-aws-env check-destroy-confirm \
	shared-init-aws shared-plan-aws shared-apply-aws shared-output-aws \
	push-api-image \
	infra-init-aws plan-aws apply-aws output-aws state-backup-aws destroy-plan-aws destroy-apply-aws

help: ## コマンド一覧を表示する
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

config-show: ## 一元管理している既定値を表示する
	@cat "$(DEFAULTS_FILE)"

config-value: ## 既定値を1件表示する（例: make config-value KEY=TERRAFORM_VERSION）
	@test -n "$(KEY)" || { echo "KEYを指定してください。" >&2; exit 1; }
	@"$(CURDIR)/scripts/read-default.sh" "$(KEY)" "$(DEFAULTS_FILE)"

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

## --- AWSログイン（IAM Identity Center） ---

aws-configure: ## 初回のみ：AWS IAM Identity Center用のpropositioプロファイルを作成する
	@mkdir -p "$(HOME)/.aws"
	@echo "SSO Start URL: $(AWS_SSO_START_URL)"
	@echo "SSO Region:    $(AWS_REGION)"
	@echo "Role:          $(AWS_PERMISSION_SET)"
	$(AWS) configure sso --profile $(AWS_PROFILE) --use-device-code

aws-login: ## AWSへログインし、接続先を表示する
	@mkdir -p "$(HOME)/.aws"
	@grep -q '^\[profile $(AWS_PROFILE)\]' "$(HOME)/.aws/config" 2>/dev/null || { echo "先に make aws-configure を実行してください。"; exit 1; }
	$(AWS) sso login --profile $(AWS_PROFILE) $(AWS_SSO_LOGIN_FLAGS)
	$(MAKE) aws-whoami

aws-whoami: ## 現在のAWSアカウント・ロール・リージョンを確認する
	@$(AWS) sts get-caller-identity --profile $(AWS_PROFILE) --output table
	@echo "Profile: $(AWS_PROFILE)"
	@echo "Region:  $(AWS_REGION)"

aws-logout: ## AWS IAM Identity Centerのキャッシュ済みセッションを削除する
	$(AWS) sso logout

aws-preflight: ## AWS接続・SES・DNSのデプロイ前チェックを行う（変更はしない）
	AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) ./scripts/check-aws-readiness.sh

## --- インフラ（Terraform）。保存planのレビューを必須にして実AWSへ適用する ---

infra-fmt: ## Terraformコードを整形する
	$(TERRAFORM) fmt -recursive

infra-validate: ## Terraformのfmtチェックと、全ルートの構文検証を行う（backend・クラウド接続なし）
	$(TERRAFORM) fmt -check -recursive
	@for root in $(TF_ROOTS); do \
		echo "==> $$root"; \
		if [ ! -d "$(TF_DIR)/$$root/.terraform/providers" ]; then \
			$(TERRAFORM) -chdir=$$root init -input=false -backend=false >/dev/null || exit 1; \
		fi; \
		$(TERRAFORM) -chdir=$$root validate || exit 1; \
	done

check-shared-aws:
	@test -f "$(TF_DIR)/backend.hcl" || { echo "$(TF_DIR)/backend.hcl がありません。backend.hcl.exampleから作成してください。" >&2; exit 2; }
	@test -f "$(TF_DIR)/shared/terraform.tfvars" || { echo "$(TF_DIR)/shared/terraform.tfvars がありません。terraform.tfvars.exampleから作成してください。" >&2; exit 2; }

shared-init-aws: check-shared-aws ## site共有リソース用S3 backendを初期化する
	$(TERRAFORM_SHARED) init -input=false -reconfigure -backend-config=../backend.hcl

shared-plan-aws: shared-init-aws ## site共有リソースの変更planを保存する
	$(TERRAFORM_SHARED) plan -input=false -out=shared.tfplan

shared-apply-aws: check-shared-aws ## 確認済みのsite共有リソースplanを適用する
	@test -f "$(TF_DIR)/shared/shared.tfplan" || { echo "先に make shared-plan-aws を実行してください。" >&2; exit 2; }
	$(TERRAFORM_SHARED) apply -input=false shared.tfplan

shared-output-aws: shared-init-aws ## site共有リソースのTerraform outputを表示する
	$(TERRAFORM_SHARED) output

push-api-image: check-shared-aws ## 現在のコミットの本番APIイメージをECRへ登録する
	@docker info >/dev/null 2>&1 || { echo "Docker Desktopを起動してください。" >&2; exit 2; }
	@set -eu; \
		repository="$$($(TERRAFORM_SHARED_BATCH) output -raw ecr_repository_url)"; \
		tag="$$(git rev-parse HEAD)"; \
		if $(AWS_BATCH) ecr describe-images --repository-name "$${repository##*/}" --image-ids "imageTag=$$tag" --profile "$(AWS_PROFILE)" --region "$(AWS_REGION)" >/dev/null 2>&1; then \
			echo "既に登録済みです: $$repository:$$tag"; \
			exit 0; \
		fi; \
		$(AWS_BATCH) ecr get-login-password --profile "$(AWS_PROFILE)" --region "$(AWS_REGION)" \
			| docker login --username AWS --password-stdin "$${repository%%/*}"; \
		docker build --platform linux/amd64 --target prod -t "$$repository:$$tag" services/backend; \
		docker push "$$repository:$$tag"; \
		echo "API_IMAGE_TAG=$$tag"; \
		echo "API_IMAGE_URI=$$repository:$$tag"

check-aws-env:
	@test "$(ENV)" = "stg" -o "$(ENV)" = "prod" || { echo "ENV=stg または ENV=prod を指定してください。" >&2; exit 2; }
	@test -f "$(TF_DIR)/envs/$(ENV)/terraform.tfvars" || { echo "$(TF_DIR)/envs/$(ENV)/terraform.tfvars がありません。exampleから作成してください。" >&2; exit 2; }

check-destroy-confirm: check-aws-env
	@test "$(CONFIRM)" = "$(TF_PLATFORM_SERVICE_NAME)-$(ENV)" || { echo "削除には CONFIRM=$(TF_PLATFORM_SERVICE_NAME)-$(ENV) を指定してください。" >&2; exit 2; }

infra-init-aws: check-aws-env ## 実AWS用S3 backendを環境別に初期化する（ENV=stg|prod）
	@set -eu; \
	account_id="$$($(AWS) sts get-caller-identity --profile $(AWS_PROFILE) --query Account --output text)"; \
	$(TERRAFORM_ENV) init -input=false -reconfigure \
		-backend-config="bucket=$(TF_PLATFORM_PROJECT_NAME)-terraform-state-$$account_id" \
		-backend-config="key=services/$(TF_PLATFORM_SERVICE_NAME)/$(ENV)/terraform.tfstate" \
		-backend-config="region=$(AWS_REGION)" \
		-backend-config="encrypt=true" \
		-backend-config="use_lockfile=true"

plan-aws: infra-init-aws ## 実AWSの変更planを保存する（ENV=stg|prod）
	$(TERRAFORM_ENV) plan -input=false -out=$(ENV).tfplan

apply-aws: check-aws-env ## 保存済みの実AWS planを適用する
	@test -f "$(TF_DIR)/envs/$(ENV)/$(ENV).tfplan" || { echo "先に make plan-aws ENV=$(ENV) を実行してください。" >&2; exit 2; }
	$(TERRAFORM_ENV) apply -input=false $(ENV).tfplan

output-aws: infra-init-aws ## 実AWSのTerraform outputを表示する
	$(TERRAFORM_ENV) output

state-backup-aws: infra-init-aws ## destroy前にremote stateをローカルへ保全する
	@set -eu; \
	backup_dir="$(TF_DIR)/backups/$(TF_PLATFORM_SERVICE_NAME)"; \
	mkdir -p "$$backup_dir"; chmod 700 "$(TF_DIR)/backups" "$$backup_dir"; \
	backup_file="$$backup_dir/$(ENV)-$$(date -u +%Y%m%dT%H%M%SZ).tfstate"; \
	umask 077; $(TERRAFORM_ENV) state pull > "$$backup_file"; \
	echo "State backup: $$backup_file"

destroy-plan-aws: check-destroy-confirm state-backup-aws ## 削除planを保存する
	$(TERRAFORM_ENV) plan -destroy -input=false -var=destroy_mode=true -out=destroy-$(ENV).tfplan

destroy-apply-aws: check-destroy-confirm ## 保存済みの削除planを適用する
	@test -f "$(TF_DIR)/envs/$(ENV)/destroy-$(ENV).tfplan" || { echo "先に make destroy-plan-aws を実行してください。" >&2; exit 2; }
	$(TERRAFORM_ENV) apply -input=false destroy-$(ENV).tfplan
