# アーキテクチャ

## 全体構成

pnpm workspace（TypeScript）+ uv（Python）のモノレポ。Web（React + Vite）・モバイル（Expo）・バックエンド（FastAPI + PostgreSQL）と、AWS基盤のTerraformを1つのリポジトリで管理する。

Web / モバイルとバックエンドの間は、バックエンドが公開するOpenAPIスキーマから自動生成された共通APIクライアント（`@repo/api-client`）経由でのみ通信する。

```
              openapi.json（生成物）
services/backend ──────────────▶ packages/api-client（orval生成 + custom-fetch）
   FastAPI                              │
   └─ PostgreSQL                        ├──▶ apps/web     （React + Vite）
                                        └──▶ apps/mobile  （Expo / React Native）

infra/terraform ──▶ 実AWS（Cognito / S3 / DynamoDB）
               └──▶ Floci（infra/floci。ローカルのAWS互換エミュレータ）
```

```
propositio-base/
├── package.json / pnpm-workspace.yaml   # pnpm workspace（apps/* と packages/*）
├── pnpm-lock.yaml
├── eslint.config.js                      # TS全体で共有するESLint設定
├── .prettierrc.json / .prettierignore    # TS全体で共有するPrettier設定
├── tsconfig.base.json                    # TS共通のcompilerOptions
├── docker-compose.yml                    # 通常開発: db / backend / web
├── .env.example                          # POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
├── Makefile                              # よく使うコマンド（make help）
├── .github/workflows/ci.yml              # CI
├── apps/
│   ├── web/                              # React (Vite)
│   └── mobile/                           # Expo (React Native)
├── packages/
│   └── api-client/                       # Web / モバイル共通のAPIクライアント
├── services/
│   └── backend/                          # FastAPI
├── infra/
│   ├── terraform/                        # AWS基盤（実AWS / Floci共通）
│   └── floci/                            # Floci（AWS互換エミュレータ）のDocker Compose
└── docs/
```

### 2つの開発環境

| 開発環境 | 定義 | 内容 |
| --- | --- | --- |
| 通常開発 | `docker-compose.yml` | PostgreSQL / FastAPI / WebをDockerで起動し、モバイルはホストでExpoを起動する |
| AWS互換開発 | `infra/floci/docker-compose.yml` + `infra/terraform/` | FlociにTerraformを適用し、AWS基盤をローカルで再現する |

2つはComposeプロジェクト・ネットワーク・ボリュームを共有しない。通常開発のbackendはPostgreSQLだけを使い、AWS（Floci）には接続しない。

## バックエンド構成（`services/backend/`）

```
services/backend/
├── app/
│   ├── core/            # 設定（config.py）とDBセッション（database.py）
│   ├── models/           # SQLAlchemyモデル（テーブル定義）
│   ├── schemas/           # Pydantic BaseModel（APIのリクエスト/レスポンス型）
│   ├── repositories/       # DBアクセスのみを行う層
│   ├── services/            # 業務ロジック層
│   ├── routers/              # FastAPIエンドポイント（DIでserviceを呼ぶだけ）
│   ├── seed/                  # 初期データの定義・投入スクリプト
│   ├── export_openapi.py       # OpenAPIスキーマをJSONに書き出すスクリプト
│   └── main.py                  # FastAPIアプリのエントリーポイント（/health）
├── alembic/                       # マイグレーション
├── tests/                          # pytest
└── pyproject.toml / uv.lock
```

### router / service / repository の3層分離

| 層 | 責務 | やってはいけないこと |
| --- | --- | --- |
| **router** | リクエスト/レスポンスの型付け、HTTPステータスの制御 | 業務ロジックやDBクエリを直接書く |
| **service** | 業務ロジック（複数repositoryの組み合わせ、バリデーションなど） | SQLAlchemyのクエリを直接書く |
| **repository** | DBアクセス（CRUD）のみ | 業務ロジックを持つ |

依存の向き: `router → service → repository`。逆方向の依存は作らない。

型定義はすべて`schemas/`のPydantic `BaseModel`で行い、SQLAlchemyモデル（`models/`）をAPIレスポンスとして直接返さない。

新しいエンティティを追加する際は、`model → schema → repository → service → router` の各ファイルを`app/`配下の対応ディレクトリに追加する（詳細は[development.md](./development.md)を参照）。

## APIクライアント（`packages/api-client/`）

```
packages/api-client/
├── src/
│   ├── index.ts           # エントリポイント（configureApiClient / 生成物を再export）
│   ├── custom-fetch.ts     # orvalが呼び出す共通fetchラッパー（ベースURLの解決とレスポンス整形）
│   └── generated/           # orvalの生成コード（gitignore対象、手で編集しない）
└── orval.config.ts           # 入力: リポジトリルートの openapi.json
```

- パッケージ名は`@repo/api-client`。ビルドせず、TypeScriptソース（`src/index.ts`）をそのままWeb（Vite）/ モバイル（Metro）から読み込む。
- 生成されるのはfetchクライアント関数とTanStack Query Hooks（`useXxx`）、およびリクエスト/レスポンスの型。
- 接続先URLは環境ごとに異なるため、各アプリのエントリポイントで`configureApiClient({ baseUrl })`を呼んで注入する（Web: `VITE_API_BASE_URL`、モバイル: `EXPO_PUBLIC_API_BASE_URL`）。
- `react` / `@tanstack/react-query`はpeerDependencies。アプリと同じインスタンスを使うよう、Webは`vite.config.ts`の`resolve.dedupe`、モバイルは`metro.config.js` / `jest.config.js`で解決先をアプリ側に固定している。

## Web構成（`apps/web/`）

```
apps/web/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/uiのコンポーネント
│   │   └── xxx/                 # 機能ごとの「UI」コンポーネント
│   ├── hooks/                      # 機能ごとの「Hooks」（API呼び出し・状態管理）
│   ├── pages/                        # hooksとUIを組み合わせるだけの層
│   ├── App.tsx                          # react-router-domのRoutes定義（ページ⇔パスの対応表）
│   ├── main.tsx                          # エントリポイント（configureApiClient / QueryClient / BrowserRouter）
│   └── lib/utils.ts                    # 汎用ユーティリティ（cnなど）
├── vite.config.ts
└── vitest.config.ts
```

## モバイル構成（`apps/mobile/`）

```
apps/mobile/
├── src/
│   ├── app/                       # Expo Routerのルート（= pages層。1ファイル = 1画面）
│   │   ├── _layout.tsx            # ルートレイアウト（configureApiClient / QueryClient / Stack）
│   │   └── index.tsx              # トップ画面（/）
│   ├── components/xxx/            # 機能ごとの「UI」コンポーネント（React Nativeのネイティブコンポーネント）
│   └── hooks/                     # 機能ごとの「Hooks」（API呼び出し・状態管理）
├── app.json                       # Expoの設定（アプリ名・scheme・React Compiler等）
├── metro.config.js                # workspaceパッケージとReact等のシングルトン解決
└── jest.config.js                 # jest-expo
```

- 画面はReact Nativeのネイティブコンポーネントで実装する。WebView（`react-native-webview` / `@expo/dom-webview`）やExpo DOMコンポーネント（`'use dom'`）でWeb版を埋め込むことはESLintで禁止している。
- `ios/` / `android/`はPrebuildで生成されるもの（gitignore対象）。

## フロントエンドのレイヤー（Web / モバイル共通）

### UIとHooksの完全分離

| 層 | 責務 | やってはいけないこと |
| --- | --- | --- |
| **UI（`components/`）** | propsを受け取って描画するだけ | API呼び出し・状態管理を持つ |
| **Hooks（`hooks/`）** | API呼び出し（`@repo/api-client`の生成Hooksのラップ）、状態管理、キャッシュ無効化 | JSXを返す・UIの見た目を知る |
| **pages（Web: `pages/` / モバイル: `app/`）** | Hooksを呼び出し、結果をUIコンポーネントにpropsとして渡すだけ | ロジックを直接書く |

新機能を追加する際は `hooks/useXxx.ts`（API呼び出し・状態管理） → `components/xxx/*`（状態を持たないUI） → ページ（Web: `pages/XxxPage.tsx` / モバイル: `app/xxx.tsx`）の3点セットで作る。

### ルーティング

Web（react-router-dom）: `main.tsx`で`<BrowserRouter>`が全体をラップし、`App.tsx`が唯一のルート定義場所になる。`pages/`配下の各コンポーネントは1つのURLパスに対応する。

```typescript
// App.tsx: ルーティングの唯一の定義場所
<Routes>
    <Route path="/" element={<WelcomePage />} />
    {/* 新しい画面を追加する場合はここにRouteを1行足す */}
</Routes>
```

- 新しい画面を追加する場合は、`pages/`に新しいページコンポーネントを作り、`App.tsx`にルートを1行追加する。
- 詳細ページ等でURLパラメータが必要な場合は`useParams`、ページ遷移は`useNavigate`、リンクは`<Link>`を使う。
- ルート定義を`pages/`以外（`components/`等）に持ち込まない。

モバイル（Expo Router）: ファイルベースのルーティング。`src/app/xxx.tsx`を追加すると`/xxx`の画面になる。画面のタイトル等は`src/app/_layout.tsx`の`<Stack.Screen>`で設定し、URLパラメータは`useLocalSearchParams`、遷移は`router.push` / `<Link>`（`expo-router`）を使う。

### APIアクセスのルール

Web / モバイルはバックエンドAPIを**直接fetchしない**。必ず`@repo/api-client`の生成関数・TanStack Query Hooksを経由する。生成の仕方は [development.md](./development.md#api自動生成openapi--orval) を参照。

## インフラ構成（`infra/`）

```
infra/
├── terraform/
│   ├── versions.tf       # Terraform / providerのバージョン、backend（local。pathはinit時に指定）
│   ├── providers.tf      # aws_endpoint_urlがあればFlociへ、nullなら実AWSへ
│   ├── variables.tf      # project_name / environment / aws_region / aws_endpoint_url など
│   ├── locals.tf         # 命名（project_name-environment）・共通タグ・random suffix
│   ├── auth.tf           # Cognito User Pool + web / mobileのpublic client
│   ├── storage.tf        # 非公開S3バケット + DynamoDBテーブル
│   ├── outputs.tf
│   ├── .terraform.lock.hcl
│   └── envs/
│       ├── floci.tfvars          # Floci用（秘密値なし、コミット対象）
│       └── aws.tfvars.example    # 実AWS用のひな形
└── floci/
    └── docker-compose.yml        # Floci（:4566）
```

同じTerraformコードを実AWSとFlociの両方に適用する。Floci向けの差分はproviderのエンドポイント上書きと`local.is_floci`による最小限の切り替えに閉じ込める。詳細は [infrastructure.md](./infrastructure.md) を参照。

## 技術スタック一覧

| 領域 | 技術 |
| --- | --- |
| Web | React 19 + TypeScript, Vite, React Compiler |
| Webルーティング | react-router-dom |
| Webスタイリング | TailwindCSS v4 + shadcn/ui |
| モバイル | Expo SDK 57 + React Native 0.86, Expo Router, React Compiler |
| API通信 | orval（OpenAPIから自動生成） + TanStack Query（`@repo/api-client`） |
| TS Lint/Format | ESLint（flat config） + Prettier + eslint-plugin-import-x + eslint-plugin-react-hooks |
| TSテスト | Vitest + React Testing Library（web / api-client）、Jest（jest-expo） + React Native Testing Library（mobile） |
| バックエンド | FastAPI, Python 3.12 |
| DBアクセス | SQLAlchemy 2.0（Mapped宣言スタイル） |
| マイグレーション | Alembic |
| バックエンドLint/Format | ruff |
| バックエンドテスト | pytest |
| DB | PostgreSQL 16 |
| インフラ | Terraform（hashicorp/aws 6.x） / Cognito・S3・DynamoDB |
| ローカルAWS | Floci 2.1.0 |
| CI | GitHub Actions |
| パッケージ管理 | pnpm workspace（TS） / uv（Python） |
