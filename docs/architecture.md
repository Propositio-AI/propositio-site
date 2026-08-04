# アーキテクチャ

## 全体構成

React (Vite) + FastAPI + PostgreSQLを、それぞれ独立したDockerコンテナで起動する構成。フロントエンドとバックエンドの間は、バックエンドが公開するOpenAPIスキーマから自動生成されたクライアントコード経由でのみ通信する。

```
propositio-base/
├── docker-compose.yml         # frontend / backend / db の3サービスを定義
├── .env.example
├── backend/                   # FastAPI
└── frontend/                  # React (Vite)
```

## バックエンド構成（`backend/`）

```
backend/
├── app/
│   ├── core/            # 設定（config.py）とDBセッション（database.py）
│   ├── models/           # SQLAlchemyモデル（テーブル定義）
│   ├── schemas/           # Pydantic BaseModel（APIのリクエスト/レスポンス型）
│   ├── repositories/       # DBアクセスのみを行う層
│   ├── services/            # 業務ロジック層
│   ├── routers/              # FastAPIエンドポイント（DIでserviceを呼ぶだけ）
│   ├── seed/                  # 初期データの定義・投入スクリプト
│   ├── export_openapi.py       # OpenAPIスキーマをJSONに書き出すスクリプト
│   └── main.py                  # FastAPIアプリのエントリーポイント
├── alembic/                       # マイグレーション
└── tests/                          # pytest
```

### router / service / repository の3層分離

| 層 | 責務 | やってはいけないこと |
| --- | --- | --- |
| **router** | リクエスト/レスポンスの型付け、HTTPステータスの制御 | 業務ロジックやDBクエリを直接書く |
| **service** | 業務ロジック（複数repositoryの組み合わせ、バリデーションなど） | SQLAlchemyのクエリを直接書く |
| **repository** | DBアクセス（CRUD）のみ | 業務ロジックを持つ |

依存の向き: `router → service → repository`。逆方向の依存は作らない。

型定義はすべて`schemas/`のPydantic `BaseModel`で行い、SQLAlchemyモデル（`models/`）をAPIレスポンスとして直接返さない。

`app/models/task.py` 〜 `app/routers/task.py` の一式が、この3層構成の実装例（サンプルCRUD）になっている。新しいエンティティを追加する際はこれをコピーして作る。

## フロントエンド構成（`frontend/`）

```
frontend/
├── src/
│   ├── api/
│   │   ├── custom-fetch.ts   # orvalが呼び出す共通fetchラッパー（唯一の手書きファイル）
│   │   └── generated/         # orvalの生成コード（gitignore対象、手で編集しない）
│   ├── components/
│   │   ├── ui/                 # shadcn/uiのコンポーネント
│   │   └── task/                 # 機能ごとの「UI」コンポーネント
│   ├── hooks/                      # 機能ごとの「Hooks」（API呼び出し・状態管理）
│   ├── pages/                        # hooksとUIを組み合わせるだけの層
│   ├── App.tsx                          # react-router-domのRoutes定義（ページ⇔パスの対応表）
│   └── lib/utils.ts                    # 汎用ユーティリティ（cnなど）
├── orval.config.ts                       # OpenAPI→コード生成の設定
└── vite.config.ts
```

### UIとHooksの完全分離

| 層 | 責務 | やってはいけないこと |
| --- | --- | --- |
| **UI（`components/`）** | propsを受け取って描画するだけ | API呼び出し・状態管理を持つ |
| **Hooks（`hooks/`）** | API呼び出し（orval生成Hooksのラップ）、状態管理、キャッシュ無効化 | JSXを返す・UIの見た目を知る |
| **pages（`pages/`）** | Hooksを呼び出し、結果をUIコンポーネントにpropsとして渡すだけ | ロジックを直接書く |

`hooks/useTasks.ts` → `components/task/*` → `pages/TasksPage.tsx` が実装例。新機能を追加する際はこの3点セットで作る。

### ルーティング（react-router-dom）

`main.tsx`で`<BrowserRouter>`が全体をラップし、`App.tsx`が唯一のルート定義場所になる。`pages/`配下の各コンポーネントは1つのURLパスに対応する「ルート単位のページ」として扱う。

```typescript
// App.tsx: ルーティングの唯一の定義場所
<Routes>
    <Route path="/" element={<TasksPage />} />
    <Route path="/todos/:id" element={<TodoDetailPage />} />
</Routes>
```

- 新しい画面を追加する場合は、`pages/`に新しいページコンポーネントを作り、`App.tsx`にルートを1行追加する。
- 詳細ページ等でURLパラメータが必要な場合は`useParams`、ページ遷移は`useNavigate`、リンクは`<Link>`を使う（`pages/TodoDetailPage.tsx`が実装例）。
- ルート定義を`pages/`以外（`components/`等）に持ち込まない。

### APIアクセスのルール

フロントエンドはバックエンドAPIを**直接fetchしない**。必ずorvalが生成した関数・TanStack Query Hooks（`src/api/generated/`）を経由する。生成の仕方は [development.md](./development.md#api自動生成openapi--orval) を参照。

## 技術スタック一覧

| 領域 | 技術 |
| --- | --- |
| フロントエンド | React 19 + TypeScript, Vite, React Compiler |
| ルーティング | react-router-dom |
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
