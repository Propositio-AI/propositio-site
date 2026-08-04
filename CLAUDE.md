# propositio-base

全プロジェクトのベースとなるリポジトリ。React (Vite) + FastAPI + PostgreSQLを、それぞれ独立したDockerコンテナで起動する。

人間向けの使用方法・開発ガイドは [`docs/`](./docs) にまとまっている（[getting-started.md](./docs/getting-started.md)、[architecture.md](./docs/architecture.md)、[development.md](./docs/development.md)）。このファイルはAIエージェント向けの規約サマリ。

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| フロントエンド | React 19 + TypeScript, Vite, React Compiler |
| API通信 | orval（OpenAPIから自動生成） + TanStack Query |
| スタイリング | TailwindCSS v4 + shadcn/ui |
| フロントLint/Format | ESLint（flat config） + Prettier + eslint-plugin-import-x |
| フロントテスト | Vitest + React Testing Library |
| バックエンド | FastAPI, Python 3.12 |
| DBアクセス | SQLAlchemy 2.0（Mapped宣言スタイル） |
| マイグレーション | Alembic |
| バックエンドLint/Format | ruff |
| バックエンドテスト | pytest |
| DB | PostgreSQL 16 |
| パッケージ管理 | pnpm（フロント） / uv（バックエンド） |

## ディレクトリ構成

```
propositio-base/
├── docker-compose.yml
├── .env.example              # POSTGRES_USER / PASSWORD / DB
├── backend/
│   ├── app/
│   │   ├── core/              # config, database（DBセッション・Base）
│   │   ├── models/            # SQLAlchemyモデル（テーブル定義）
│   │   ├── schemas/           # Pydantic BaseModel（リクエスト/レスポンス型）
│   │   ├── repositories/      # DBアクセスのみ
│   │   ├── services/          # 業務ロジック
│   │   ├── routers/           # FastAPIエンドポイント（DIでserviceを呼ぶだけ）
│   │   ├── seed/               # 初期データ定義・投入スクリプト
│   │   └── main.py
│   ├── alembic/                # マイグレーション
│   ├── tests/                  # pytest
│   └── .env.example             # DATABASE_URL / CORS_ORIGINS
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── custom-fetch.ts   # orvalが呼ぶ共通fetchラッパー（手書きはここだけ）
    │   │   └── generated/         # orval生成コード（gitignore対象・手で編集しない）
    │   ├── components/
    │   │   ├── ui/                 # shadcn/uiコンポーネント
    │   │   └── task/                # 機能ごとの「UI」コンポーネント（状態を持たない）
    │   ├── hooks/                    # 機能ごとの「Hooks」（API呼び出し・状態管理）
    │   └── pages/                     # hooksとUIを組み合わせるだけの層
    └── .env.example                    # VITE_API_BASE_URL
```

## アーキテクチャ原則

### バックエンド：router / service / repository の3層分離

- **router**: リクエスト/レスポンスの型付けとHTTPの関心事のみ。DIで受け取った`service`を呼ぶだけで、業務ロジックやDBアクセスを直接書かない。
- **service**: 業務ロジックのみ。`repository`を組み合わせて処理を行う。DBアクセスの詳細（SQLAlchemyのクエリなど）を知らない。
- **repository**: DBアクセスのみ。業務ロジックを持たない。
- 型定義はすべて`schemas/`のPydantic `BaseModel`で行う。SQLAlchemyモデル（`models/`）を直接APIレスポンスに使わない。
- 新しいエンティティを追加する場合は、`app/models/task.py` 一式（model → schema → repository → service → router）を雛形としてコピーする。

### フロントエンド：UIとHooksの完全分離

- **UI（`components/`）**: propsを受け取って描画するだけ。API呼び出しや状態管理を持たない。`onXxx`コールバックをpropsで受け取り、呼び出し元に処理を委譲する。
- **Hooks（`hooks/`）**: API呼び出し（orval生成hooksのラップ）・状態管理・キャッシュ無効化などのロジックを担う。UIコンポーネントに依存しない。
- **pages（`pages/`）**: Hooksを呼び出し、その結果をUIコンポーネントにpropsとして渡すだけの composition 層。ロジックを書かない。
- 新機能を追加する場合は `hooks/useXxx.ts` + `components/xxx/` + `pages/XxxPage.tsx` の3点セットで実装する（`Task`機能を参照）。

## API連携（OpenAPI自動生成）

フロントエンドはバックエンドのAPIを**直接fetchしない**。必ずorvalが生成した関数・Hooksを経由する。

1. バックエンドのOpenAPIスキーマを書き出す:
   ```
   cd backend && uv run python -m app.export_openapi
   ```
   → リポジトリルートに `openapi.json` が生成される（gitignore対象、都度再生成する）。

2. フロントエンドでAPIクライアントを生成する:
   ```
   cd frontend && pnpm generate:api
   ```
   → `src/api/generated/` にfetchクライアント + TanStack Query Hooksが生成される（gitignore対象）。

3. バックエンドのエンドポイント（router/schemas）を変更したら、上記2ステップを再実行する。

`src/api/custom-fetch.ts` 以外の `src/api/` 配下のファイルは自動生成物なので手で編集しない。

## コメント規約

### TypeScript

クラスと関数には必ず以下の形式でコメントを付ける。

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

クラスと関数には必ず以下の形式でdocstringを付ける。

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

## フォーマッター・Lintルール

- フロントエンド: インデント4スペース固定（Prettier `tabWidth: 4`）。import順序は `eslint-plugin-import-x` の `import-x/order` で強制（builtin → external → internal(`@/*`) → parent/sibling → type、グループ間は空行必須、グループ内はアルファベット順）。
- バックエンド: ruffでLint/Format。インデント4スペース、import順序はisort相当のルールで強制。

コマンド:
```
# frontend
pnpm lint         # ESLint
pnpm format       # Prettier --write
pnpm format:check

# backend
uv run ruff check .
uv run ruff format .
```

## セットアップ・起動方法

```
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

- backend起動時に `alembic upgrade head` が自動実行される（`docker-compose.yml`のcommand参照）。
- 初期データの投入は自動実行されない。手動で以下を実行する:
  ```
  docker compose exec backend uv run python -m app.seed.seed
  ```

アクセス先:
- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000 （Swagger UI: http://localhost:8000/docs）
- PostgreSQL: localhost:5432

## 新しいエンティティ追加の初期データ

`app/seed/data.py` に `{エンティティ名}_SEED_DATA` 定数を追加し、`app/seed/seed.py` の `run_seed()` から呼び出す関数を追加する。

## マイグレーション

```
cd backend
uv run alembic revision --autogenerate -m "説明"
uv run alembic upgrade head
```

`app/models/` にモデルを追加したら、`alembic/env.py` で読み込まれるように `app/models/__init__.py` に追記する。

## テスト

```
# backend
cd backend && uv run pytest

# frontend
cd frontend && pnpm test
```

## 不明点があれば

このリポジトリの構成・規約について不明な点や、要件と実装が食い違う可能性がある場合は、推測で進めずに必ず確認すること。
