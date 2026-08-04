# 開発の進め方

前提として、リポジトリの構成・設計方針は [architecture.md](./architecture.md)、起動方法は [getting-started.md](./getting-started.md) を参照。

## 新しいエンティティを追加する

`Task`エンティティ（backend/frontend双方）が、以下すべての手順を実装したサンプルなので、そのままコピーして作るのが早い。

### バックエンド

1. `app/models/xxx.py` — SQLAlchemyモデル（テーブル定義）を追加し、`app/models/__init__.py` にimportを追記する
2. `app/schemas/xxx.py` — リクエスト/レスポンス用のPydantic `BaseModel` を追加する
3. `app/repositories/xxx_repository.py` — DBアクセスのみを行うクラスを追加する
4. `app/services/xxx_service.py` — 業務ロジックを追加する（repositoryを利用する）
5. `app/routers/xxx.py` — エンドポイントを追加し、`app/main.py` で `app.include_router(...)` する
6. マイグレーションを作成する（下記「マイグレーション」参照）
7. 必要なら初期データを追加する（下記「初期データ（シード）」参照）

### フロントエンド

バックエンドのエンドポイントを追加・変更したら、まずAPIクライアントを再生成する（下記「API自動生成」参照）。そのうえで:

1. `src/hooks/useXxx.ts` — 生成されたTanStack Query Hooksをラップし、一覧の再検証などのロジックを書く
2. `src/components/xxx/` — propsを受け取って描画するだけのUIコンポーネントを追加する
3. `src/pages/XxxPage.tsx` — Hooksの結果をUIコンポーネントに渡すだけのpageを追加する

## API自動生成（OpenAPI → orval）

フロントエンドはバックエンドAPIを直接fetchせず、必ずorvalが生成したコードを経由する。バックエンドのrouter/schemasを変更したら、以下の2ステップを再実行する。

```bash
# 1. バックエンドのOpenAPIスキーマをJSONに書き出す
cd backend
uv run python -m app.export_openapi
# → リポジトリルートに openapi.json が生成される（gitignore対象、都度再生成する）

# 2. フロントエンドでAPIクライアント/Hooksを生成する
cd frontend
pnpm generate:api
# → src/api/generated/ にfetchクライアント + TanStack Query Hooksが生成される（gitignore対象）
```

`src/api/custom-fetch.ts` 以外の `src/api/` 配下は自動生成物なので手で編集しない。Docker上で作業している場合は `docker compose exec backend ...` / `docker compose exec frontend ...` で同じコマンドを実行できる。

## マイグレーション（Alembic）

```bash
cd backend
uv run alembic revision --autogenerate -m "変更内容の説明"
uv run alembic upgrade head
```

- `app/models/` にモデルを追加したときは、`app/models/__init__.py` に忘れずimportを追記する（`alembic/env.py` がここ経由でモデルを認識するため）
- backendコンテナは起動時に自動で `alembic upgrade head` を実行する（`docker-compose.yml` の `command` を参照）ので、`docker compose up` するだけで最新化される
- Docker上で作成する場合は `docker compose exec backend uv run alembic revision --autogenerate -m "..."`

## 初期データ（シード）

`app/seed/data.py` に `{エンティティ名}_SEED_DATA` という定数を追加し、`app/seed/seed.py` の `run_seed()` から呼び出す `seed_xxx(db)` 関数を追加する。

投入コマンド:

```bash
docker compose exec backend uv run python -m app.seed.seed
```

すでにテーブルにデータがある場合はスキップされる（`Task`の実装を参照）。

## テスト

```bash
# backend（pytest）
cd backend && uv run pytest
# or: docker compose exec backend uv run pytest

# frontend（Vitest + React Testing Library）
cd frontend && pnpm test
# or: docker compose exec frontend pnpm test
```

- backend: `repository` → SQLite（インメモリ）、`service`/`router` → `TestClient` を使った統合テストの例がある（`backend/tests/`）
- frontend: Hooksのテスト（生成されたAPI Hooksをモック）とコンポーネントのテスト例がある（各ファイルに隣接する `*.test.tsx`）

## Lint / Format

```bash
# frontend
cd frontend
pnpm lint          # ESLint
pnpm format        # Prettier --write
pnpm format:check  # 差分があればCIで落とす用

# backend
cd backend
uv run ruff check .
uv run ruff format .
```

- フロントエンド: インデントは4スペース固定（Prettier `tabWidth: 4`）。importの順序は `eslint-plugin-import-x` の `import-x/order` ルールで強制される（builtin → external → internal(`@/*`) → parent/sibling → type の順、グループ間は空行必須、グループ内はアルファベット順）。
- バックエンド: ruffがLint/Formatを兼ねる。インデント4スペース、import順序はisort相当のルールで強制される。

## コメント・docstringの書き方

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
| `backend/.env` | `DATABASE_URL` | backendが接続するDB（docker-compose経由の場合は自動で上書きされる） |
| `backend/.env` | `CORS_ORIGINS` | 許可するフロントエンドのオリジン（カンマ区切りで複数指定可） |
| `frontend/.env` | `VITE_API_BASE_URL` | フロントエンドから見たバックエンドAPIのURL |

各`.env`は`.env.example`をコピーして作成し、gitにはコミットしない。
