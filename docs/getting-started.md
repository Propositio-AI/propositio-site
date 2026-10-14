# はじめに（セットアップ・起動方法）

このリポジトリの開発環境は、目的の異なる2つに分かれている。互いに独立しているので、必要な方だけ起動すればよい。

| 開発環境 | 起動するもの | 定義ファイル | 用途 |
| --- | --- | --- | --- |
| **通常開発** | PostgreSQL / FastAPI / Web（+ ホスト上のExpo） | `docker-compose.yml` | アプリの日常的な開発 |
| **AWS互換開発** | Floci（AWS互換エミュレータ） + Terraform | `infra/floci/docker-compose.yml` / `infra/terraform/` | Cognito / S3 / DynamoDBなどAWS基盤の確認 |

## 必要なもの

- Docker / Docker Compose（通常開発のdb / backend / web、Floci、Terraform（ホストに無い場合）はDocker上で動く）
- Node.js 22.18以上 + pnpm 12（`corepack enable`で`package.json`の`packageManager`に従ったpnpmが使える） — モバイル開発・Lint・型チェック・テストをホストで実行するため
- Python 3.12 + uv — backendのコマンドをホストで直接実行する場合のみ
- `make`（任意。あるとコマンドが短縮できる）
- モバイルを動かす場合: iOSシミュレータ（Xcode）/ Androidエミュレータ（Android Studio）/ 実機のExpo Goのいずれか
- Terraformをホストに入れる場合は1.10以上（無ければMakefileが`hashicorp/terraform`のDockerイメージを使う）

## Makefileを使う場合（最短ルート）

```bash
make up            # .envを作成し、db / backend / web をビルドして起動する
make seed          # 初期データを投入する（初回のみ）
make generate-api  # OpenAPIからAPIクライアント（packages/api-client/src/generated）を生成する
make install       # ホストにpnpm workspaceの依存をインストールする
make dev-mobile    # モバイル（Expo）の開発サーバーをホスト上で起動する
```

`packages/api-client/src/generated/`はgitignore対象のため、クローン直後は`make generate-api`を実行するまでWeb / モバイルがAPIクライアントを読み込めない。利用可能なコマンド一覧は `make help` で確認できる。以降は`make`を使わない場合の詳細な手順。

## 通常開発

### 1. 環境変数ファイルを用意する

各`.env.example`をコピーして`.env`を作成する（`.env`はgitignore対象。`make setup`でも作成できる）。

```bash
cp .env.example .env
cp services/backend/.env.example services/backend/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

| ファイル | 変数 | 用途 |
| --- | --- | --- |
| `.env` | `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | PostgreSQLコンテナの初期化（backendの`DATABASE_URL`もここから組み立てられる） |
| `services/backend/.env` | `DATABASE_URL` | backendが接続するDB（docker compose経由では`docker-compose.yml`の値で上書きされる） |
| `services/backend/.env` | `CORS_ORIGINS` | 許可するWebのオリジン（カンマ区切りで複数指定可） |
| `apps/web/.env` | `VITE_API_BASE_URL` | WebブラウザからみたバックエンドAPIのURL |
| `apps/mobile/.env` | `EXPO_PUBLIC_API_BASE_URL` | モバイルアプリからみたバックエンドAPIのURL（下記参照） |

`EXPO_PUBLIC_API_BASE_URL`は実行環境によって変える。

| 実行環境 | 値 |
| --- | --- |
| iOSシミュレータ | `http://localhost:8000` |
| Androidエミュレータ | `http://10.0.2.2:8000` |
| 実機（Expo Go） | `http://<開発マシンのLAN内IPアドレス>:8000` |

### 2. 起動する

```bash
docker compose up --build
```

これで以下が自動的に行われる。

- PostgreSQLコンテナが起動し、ヘルスチェックが通るまでbackendは待機する
- backendコンテナ起動時に `alembic upgrade head` が自動実行され、テーブルが作成される
- backend（`services/backend`）とweb（リポジトリ全体）はbind mountしているため、ホストでファイルを編集すると即座にホットリロードされる

### 3. APIクライアントを生成する

```bash
docker compose exec -T backend uv run python -m app.export_openapi - > openapi.json
docker compose exec web pnpm --workspace-root generate:api
```

ホストにuv / pnpmがある場合は次でもよい。

```bash
(cd services/backend && uv run python -m app.export_openapi)
pnpm install
pnpm generate:api
```

### 4. モバイルを起動する（任意）

モバイル（`apps/mobile`）はシミュレータ/実機と接続するため、Dockerではなくホスト上で起動する。

```bash
pnpm install
pnpm dev:mobile   # = pnpm --filter mobile start（expo start）
```

表示されるメニューから`i`（iOSシミュレータ）/`a`（Androidエミュレータ）を押すか、実機のExpo GoでQRコードを読み取る。

### 5. アクセス先

| サービス | URL |
| --- | --- |
| Web | http://localhost:5173 |
| バックエンドAPI | http://localhost:8000 |
| APIドキュメント（Swagger UI） | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| モバイル | `pnpm dev:mobile`の出力に従う（Metro: 8081） |

### 6. 初期データ（シード）を投入する

初期データの投入は自動実行されない。起動後に一度だけ手動で実行する。

```bash
docker compose exec backend uv run python -m app.seed.seed
```

すでにデータが存在する場合は何もせずスキップされるため、何度実行しても安全。

### 7. 止める・片付ける

```bash
docker compose down       # コンテナを停止（DBデータは保持される）
docker compose down -v    # DBデータも含めて完全に削除する場合
```

## AWS互換開発（Floci + Terraform）

`infra/terraform`のAWS基盤（Cognito / S3 / DynamoDB）を、ローカルのFloci上に作って確認する。通常開発のコンテナ（db / backend / web）は起動していなくてよく、backendもFlociには接続しない（アプリからAWSを使う実装を追加するときの土台）。

```bash
make floci-up        # Flociを起動し、ヘルスチェックが通るまで待つ
make floci-health    # = curl http://localhost:4566/_localstack/health
make plan-floci      # 差分を確認する
make apply-floci     # 適用する（確認プロンプトを省く場合: make apply-floci ARGS=-auto-approve）
make infra-output    # User Pool ID・Client ID・バケット名・テーブル名を表示する
make destroy-floci   # 作成したリソースを削除する
make floci-down      # Flociを停止する（データはボリュームに保持。完全に消すなら make floci-down-v）
```

詳細（変数・Floci固有の差分・実AWSへの適用手順）は [infrastructure.md](./infrastructure.md) を参照。

## よくある操作

| やりたいこと | コマンド | Makefile |
| --- | --- | --- |
| ログを見る | `docker compose logs -f` | `make logs` |
| 再ビルドして起動 | `docker compose up --build` | `make up` |
| 停止 | `docker compose down` | `make down` |
| マイグレーション適用 | `docker compose exec backend uv run alembic upgrade head` | `make migrate` |
| シード投入 | `docker compose exec backend uv run python -m app.seed.seed` | `make seed` |
| APIクライアント再生成 | 上記「3. APIクライアントを生成する」 | `make generate-api` |
| backendテスト | `docker compose exec backend uv run pytest` | `make test-backend` |
| webテスト | `docker compose exec web pnpm test` | `make test-web` |
| api-client / mobileテスト | `pnpm --filter @repo/api-client test` / `pnpm --filter mobile test` | `make test-api-client` / `make test-mobile` |
| 全テスト | 上記すべて | `make test` |
| backend Lint | `docker compose exec backend uv run ruff check .` | `make lint-backend` |
| TS Lint / 型チェック | `pnpm lint` / `pnpm typecheck` | `make lint-js` / `make typecheck` |
| backendコンテナに入る | `docker compose exec backend bash` | `make shell-backend` |
| webコンテナに入る | `docker compose exec web sh` | `make shell-web` |
| psqlで接続 | `docker compose exec db psql -U app -d app` | `make shell-db` |
| Flociのログ | `docker compose -p <プロジェクト名>-floci -f infra/floci/docker-compose.yml logs -f` | `make floci-logs` |

さらに詳しい開発の進め方（新機能の追加手順、API自動生成、マイグレーション、テストなど）は [development.md](./development.md) を参照。
リポジトリの構成・設計方針は [architecture.md](./architecture.md) を参照。
