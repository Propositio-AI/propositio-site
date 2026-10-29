# 開発の進め方

前提として、リポジトリの構成・設計方針は [architecture.md](./architecture.md)、起動方法は [getting-started.md](./getting-started.md)、AWS基盤は [infrastructure.md](./infrastructure.md) を参照。

TypeScriptのコマンド（`pnpm ...`）は特記がない限りリポジトリルートで実行する。

## 新しいエンティティを追加する

新しいエンティティは以下の手順で追加する。

### バックエンド（`services/backend`）

1. `app/models/xxx.py` — SQLAlchemyモデル（テーブル定義）を追加し、`app/models/__init__.py` にimportを追記する
2. `app/schemas/xxx.py` — リクエスト/レスポンス用のPydantic `BaseModel` を追加する
3. `app/repositories/xxx_repository.py` — DBアクセスのみを行うクラスを追加する
4. `app/services/xxx_service.py` — 業務ロジックを追加する（repositoryを利用する）
5. `app/routers/xxx.py` — エンドポイントを追加し、`app/main.py` で `app.include_router(...)` する
6. マイグレーションを作成する（下記「マイグレーション」参照）
7. 必要なら初期データを追加する（下記「初期データ（シード）」参照）

### Web / モバイル

バックエンドのエンドポイントを追加・変更したら、まずAPIクライアントを再生成する（下記「API自動生成」参照）。そのうえで各アプリに次の3点セットを追加する。

| | Web（`apps/web/src`） | モバイル（`apps/mobile/src`） |
| --- | --- | --- |
| Hooks | `hooks/useXxx.ts` | `hooks/useXxx.ts` |
| UI | `components/xxx/`（shadcn/ui + TailwindCSS） | `components/xxx/`（React Nativeのネイティブコンポーネント + `StyleSheet`） |
| ページ | `pages/XxxPage.tsx` + `App.tsx`に`<Route>`を1行追加 | `app/xxx.tsx`（ファイルを置くとルートになる。タイトル等は`app/_layout.tsx`） |

1. Hooks — `@repo/api-client`の生成TanStack Query Hooksをラップし、一覧の再検証などのロジックを書く
2. UI — propsを受け取って描画するだけのコンポーネントを追加する
3. ページ — Hooksの結果をUIコンポーネントに渡すだけにする

モバイルでWebViewやExpo DOMコンポーネント（`'use dom'`）を使ってWeb版を埋め込むことは禁止（ESLintでエラーになる）。

## API自動生成（OpenAPI → orval）

Web / モバイルはバックエンドAPIを直接fetchせず、必ず`@repo/api-client`（`packages/api-client`）の生成コードを経由する。バックエンドのrouter/schemasを変更したら、以下の2ステップを再実行する。

```bash
# 1. バックエンドのOpenAPIスキーマをJSONに書き出す
(cd services/backend && uv run python -m app.export_openapi)
# → リポジトリルートに openapi.json が生成される（gitignore対象、都度再生成する）

# 2. APIクライアント/Hooksを生成する
pnpm generate:api
# → packages/api-client/src/generated/ にfetchクライアント + TanStack Query Hooksが生成される（gitignore対象）
```

Docker上のbackend / webで行う場合は `make generate-api`（= `docker compose exec -T backend uv run python -m app.export_openapi - > openapi.json` と `docker compose exec web pnpm --workspace-root generate:api`）。

- `packages/api-client/src/custom-fetch.ts` と `src/index.ts` 以外（`src/generated/`）は自動生成物なので手で編集しない。
- 生成物はgitに含まれない。クローン直後やブランチ切り替え後に型エラーになる場合は、まず再生成する。
- APIのベースURLは`configureApiClient({ baseUrl })`で注入する（Web: `apps/web/src/main.tsx`、モバイル: `apps/mobile/src/app/_layout.tsx`）。

## マイグレーション（Alembic）

```bash
cd services/backend
uv run alembic revision --autogenerate -m "変更内容の説明"
uv run alembic upgrade head
```

- `app/models/` にモデルを追加したときは、`app/models/__init__.py` に忘れずimportを追記する（`alembic/env.py` がここ経由でモデルを認識するため）
- backendコンテナは起動時に自動で `alembic upgrade head` を実行する（`docker-compose.yml` の `command` を参照）ので、`docker compose up` するだけで最新化される
- Docker上で作成する場合は `docker compose exec backend uv run alembic revision --autogenerate -m "..."`（`make makemigration MESSAGE="..."`）

## 初期データ（シード）

`app/seed/data.py` に `{エンティティ名}_SEED_DATA` という定数を追加し、`app/seed/seed.py` の `run_seed()` から呼び出す `seed_xxx(db)` 関数を追加する。

投入コマンド:

```bash
docker compose exec backend uv run python -m app.seed.seed
```

すでにテーブルにデータがある場合はスキップするようにする（`seed_xxx`関数内で判定する）。

## テスト

```bash
# backend（pytest）
cd services/backend && uv run pytest
# or: docker compose exec backend uv run pytest（make test-backend）

# web / api-client（Vitest）・mobile（Jest）をまとめて
pnpm test

# 個別に
pnpm --filter web test                # Vitest + React Testing Library（make test-web はDocker上で実行）
pnpm --filter @repo/api-client test   # Vitest（make test-api-client）
pnpm --filter mobile test             # Jest（jest-expo） + React Native Testing Library（make test-mobile）
```

- backend: `TestClient` を使ったAPIテストの例がある（`services/backend/tests/`）。DBはSQLite（インメモリ）に差し替える`db_session`フィクスチャを`conftest.py`に用意している
- api-client: `custom-fetch.ts`のテスト（`fetch`をモック）がある
- mobile: Hooksのテスト（`@repo/api-client`の生成Hooksを`jest.mock`）とUIコンポーネントのテストの例がある（各ファイルに隣接する `*.test.ts(x)`）
- web: ページのテストの例がある（`apps/web/src/pages/*.test.tsx`）

## Lint / 型チェック / Format

```bash
# TypeScript（web / mobile / api-client。ルートの設定を全パッケージで共有）
pnpm lint          # ESLint
pnpm typecheck     # 全パッケージの型チェック（tsc）
pnpm format        # Prettier --write
pnpm format:check  # 差分があればCIで落とす用

# backend
cd services/backend
uv run ruff check .
uv run ruff format .

# Terraform
make infra-fmt       # terraform fmt -recursive
make infra-validate  # fmt -check + init -backend=false + validate
```

- TypeScript: インデントは4スペース固定（Prettier `tabWidth: 4`）。importの順序は `eslint-plugin-import-x` の `import-x/order` ルールで強制される（builtin → external → internal(`@/*`) → parent/sibling → type の順、グループ間は空行必須、グループ内はアルファベット順）。React Hooks / React Compilerのルールは `eslint-plugin-react-hooks` の recommended で検査する。
- shadcn/uiが生成する`apps/web/src/components/ui/`は、variants（cva）を同じファイルからexportする規約のため`react-refresh/only-export-components`の対象外にしている。
- バックエンド: ruffがLint/Formatを兼ねる。インデント4スペース、import順序はisort相当のルールで強制される。
- Terraform: `terraform fmt`で整形する（Prettierの対象外）。

## ビルド

```bash
pnpm build   # web: tsc -b && vite build / mobile: expo export（iOS・Android） をまとめて実行
```

## CI（GitHub Actions）

`.github/workflows/ci.yml` が main へのpushとpull requestで実行される。

| ジョブ | 内容 |
| --- | --- |
| JS | Node.js 22 + pnpm（`packageManager`）+ uv をセットアップ → `uv run python -m app.export_openapi` → `pnpm install --frozen-lockfile` → `pnpm generate:api` → `pnpm lint` / `pnpm format:check` / `pnpm typecheck` / `pnpm test` / `pnpm build` |
| Backend | `uv sync --locked` → `uv run ruff check .` / `uv run ruff format --check .` / `uv run pytest` |
| Docker Compose | `make setup` → `docker compose config` |
| Terraform | `config/defaults.json`のinfra version整合 → `make infra-validate`（shared / env/prodのfmt・validate） |

CIとは別に、`.github/workflows/deploy.yml` がAWS本番へのデプロイを行う（mainでCI成功後、`prod` Environmentの承認を経て配信）。詳細は[infrastructure.md](./infrastructure.md#デプロイとフック)を参照。

CIで落ちないよう、コミット前に上記と同じコマンドをローカルで実行する。

## コメント・docstringの書き方

コメントの適用範囲・書式の詳細は [`CLAUDE.md`](../CLAUDE.md) の「コメント規約」を参照。すべての関数・クラス・Reactコンポーネント・カスタムフック（JSの設定ファイル内の関数を含む）に付ける。

### TypeScript

```typescript
/**

{関数の機能}

@param
@return

**/
```

例:

```typescript
/**

Tailwindのクラス名を条件付きで結合し、重複を解決する。

@param inputs 結合したいクラス名（文字列・条件式・配列など）
@return マージ済みのクラス名文字列

**/
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
```

### Python

```python
def something():
    """
    {関数の機能}

    Params:
        - {引数名} ({型}): {説明}

    Returns:
        - {型}: {説明}
    """
```

引数・戻り値が無い場合も `Params:` / `Returns:` セクション自体は残し、`-` のみを書く。

## 環境変数

| ファイル | 変数 | 説明 |
| --- | --- | --- |
| `.env` | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | PostgreSQLの初期化に使う |
| `services/backend/.env` | `DATABASE_URL` | backendが接続するDB（docker compose経由の場合は自動で上書きされる） |
| `services/backend/.env` | `CORS_ORIGINS` | 許可するWebのオリジン（カンマ区切りで複数指定可） |
| `apps/web/.env` | `VITE_API_BASE_URL` | WebからみたバックエンドAPIのURL |
| `apps/mobile/.env` | `EXPO_PUBLIC_API_BASE_URL` | モバイルからみたバックエンドAPIのURL（iOSシミュレータ: `http://localhost:8000`、Androidエミュレータ: `http://10.0.2.2:8000`、実機: LAN内IP） |
| `services/backend/.env` | `MICROCMS_*`, `MAIL_*`, `CONTACT_NOTIFY_TO`, `TURNSTILE_SECRET_KEY` など | ローカルFastAPI用。本番はLambda環境変数とSSM Parameter Storeを使用 |

各`.env`は`.env.example`をコピーして作成し、gitにはコミットしない。`EXPO_PUBLIC_`で始まる変数はアプリのバンドルに埋め込まれるため、秘密値を入れない。

既定値の正本は`config/defaults.json`です。`make config-show`で一覧、`make config-value KEY=<KEY>`で個別の値を確認できます。Makefile変数は`make <target> VAR=...`で一時的に上書きできます。

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `TF_VERSION` | `config/defaults.json`の`TERRAFORM_VERSION` | ホストにterraformが無い場合に使う`hashicorp/terraform`イメージのタグ |
| `MESSAGE` | （空） | `makemigration` のマイグレーション名 |
