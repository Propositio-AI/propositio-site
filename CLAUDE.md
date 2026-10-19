# propositio-base

全プロジェクトのベースとなるリポジトリ。pnpm workspace + uvのモノレポで、Web（React + Vite）・モバイル（Expo / React Native）・バックエンド（FastAPI + PostgreSQL）と、AWS基盤（Terraform。ECS / RDS / CloudFront / SES / Route53）をまとめて持つ。

人間向けの使用方法・開発ガイドは [`docs/`](./docs) にまとまっている（[getting-started.md](./docs/getting-started.md)、[architecture.md](./docs/architecture.md)、[development.md](./docs/development.md)、[infrastructure.md](./docs/infrastructure.md)、[new-project.md](./docs/new-project.md)、[karynos-site.md](./docs/karynos-site.md)）。このファイルはAIエージェント向けの規約サマリ。

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| Web（`apps/web`） | React 19 + TypeScript, Vite, React Compiler |
| Webルーティング | react-router-dom |
| Webスタイリング | TailwindCSS v4 + shadcn/ui |
| モバイル（`apps/mobile`） | Expo SDK 57 + React Native 0.86, Expo Router, React Compiler（WebView不使用のネイティブUI） |
| API通信（`packages/api-client`） | orval（OpenAPIから自動生成） + TanStack Query。Web / モバイル共通 |
| TS Lint/Format | ESLint（flat config, ルート共通） + Prettier + eslint-plugin-import-x + eslint-plugin-react-hooks |
| TSテスト | Vitest + React Testing Library（web / api-client）、Jest（jest-expo） + React Native Testing Library（mobile） |
| バックエンド（`services/backend`） | FastAPI, Python 3.12 |
| DBアクセス | SQLAlchemy 2.0（Mapped宣言スタイル） |
| マイグレーション | Alembic |
| バックエンドLint/Format | ruff |
| バックエンドテスト | pytest |
| DB | PostgreSQL 16 |
| インフラ（`infra/`） | Terraform（AWS provider） / ECS Fargate + ALB（API）・S3 + CloudFront（Web）・RDS PostgreSQL・SES・Route53 |
| デプロイ | GitHub Actions（`.github/workflows/deploy.yml`、OIDC）。mainで stg に自動、prod は手動＋承認 |
| CI | GitHub Actions（`.github/workflows/ci.yml`） |
| パッケージ管理 | pnpm workspace（TS） / uv（Python） |

## ディレクトリ構成

```
propositio-base/
├── package.json / pnpm-workspace.yaml   # pnpm workspace（apps/* と packages/*）
├── eslint.config.js / .prettierrc.json  # TS全体で共有するLint/Format設定
├── tsconfig.base.json                    # TS共通のcompilerOptions
├── docker-compose.yml                    # 通常開発: db / backend / web
├── .env.example                          # POSTGRES_USER / PASSWORD / DB
├── Makefile                              # よく使うコマンド（make help）
├── .github/workflows/ci.yml              # CI
├── apps/
│   ├── web/                              # React (Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # shadcn/uiコンポーネント
│   │   │   │   └── xxx/                  # 機能ごとの「UI」コンポーネント（状態を持たない）
│   │   │   ├── hooks/                    # 機能ごとの「Hooks」（API呼び出し・状態管理）
│   │   │   ├── pages/                    # hooksとUIを組み合わせるだけの層
│   │   │   ├── App.tsx                   # ルート定義（react-router-dom）
│   │   │   └── main.tsx                  # エントリポイント（configureApiClient / Provider）
│   │   └── .env.example                  # VITE_API_BASE_URL
│   └── mobile/                           # Expo (React Native)
│       ├── src/
│       │   ├── app/                      # Expo Routerのルート（= pages層。1ファイル = 1画面）
│       │   ├── components/xxx/           # 機能ごとの「UI」コンポーネント（状態を持たない）
│       │   └── hooks/                    # 機能ごとの「Hooks」（API呼び出し・状態管理）
│       └── .env.example                  # EXPO_PUBLIC_API_BASE_URL
├── packages/
│   └── api-client/                       # @repo/api-client（Web / モバイル共通のAPIクライアント）
│       ├── src/custom-fetch.ts           # orvalが呼ぶ共通fetchラッパー（手書きはこことindex.tsだけ）
│       ├── src/generated/                # orval生成コード（gitignore対象・手で編集しない）
│       └── orval.config.ts               # 入力はリポジトリルートのopenapi.json
├── services/
│   └── backend/                          # FastAPI
│       ├── app/
│       │   ├── core/                     # config, database（DBセッション・Base）
│       │   ├── models/                   # SQLAlchemyモデル（テーブル定義）
│       │   ├── schemas/                  # Pydantic BaseModel（リクエスト/レスポンス型）
│       │   ├── repositories/             # DBアクセスのみ
│       │   ├── services/                 # 業務ロジック
│       │   ├── routers/                  # FastAPIエンドポイント（DIでserviceを呼ぶだけ）
│       │   ├── seed/                     # 初期データ定義・投入スクリプト
│       │   ├── export_openapi.py         # OpenAPIスキーマの書き出し
│       │   └── main.py
│       ├── alembic/                      # マイグレーション
│       ├── tests/                        # pytest
│       └── .env.example                  # DATABASE_URL / CORS_ORIGINS
├── infra/terraform/                      # AWS基盤（docs/infrastructure.md）
│   ├── bootstrap/                        # stateバケット（アカウントに1回）
│   ├── shared/                           # ECR・SES・GitHub OIDC（アカウントに1つ）
│   ├── modules/environment/              # 1環境分（VPC・ALB・ECS・RDS・CloudFront・Route53・IAM）
│   └── envs/stg, envs/prod/              # 環境ごとのルート（サイズの違いだけを書く）
└── docs/
```

## 責務の分割（アーキテクチャ原則）

各層は「自分の責務」だけを持ち、他の層の責務を絶対に肩代わりしない。迷ったら「この処理はどの層の責務か」を先に決めてから書く。層をまたぐ近道（routerで直接クエリを書く、UIでAPIを呼ぶ等）は、たとえ数行で済んでも禁止。

### バックエンド：router / service / repository の3層分離

依存の方向は一方向: `router → service → repository → DB`。逆方向の依存（repositoryがserviceを呼ぶ等）や層を飛ばした依存（routerが直接repositoryやDBセッションを操作する）は禁止。

| 層 | 責務 | 持ってよいもの | 持ってはいけないもの |
| --- | --- | --- | --- |
| **router**（`routers/`） | HTTPの関心事（パス・メソッド・ステータスコード・DI）とリクエスト/レスポンスの型付け | `service`の呼び出し、例外→HTTPExceptionへの変換 | 業務ロジック（条件分岐・計算）、SQLAlchemyのクエリ、DBセッションの直接操作 |
| **service**（`services/`） | 業務ロジック（バリデーション、複数repositoryの組み合わせ、ドメイン例外の送出） | `repository`の呼び出しの組み合わせ、業務ルールの判断 | SQLAlchemyのクエリを直接書く、HTTPステータスコードやFastAPI固有の型を知る |
| **repository**（`repositories/`） | DBアクセス（CRUD）のみ | SQLAlchemyのクエリ、セッション操作 | 業務ルールの判断（「これは完了扱いか」等）、他のrepositoryを呼ぶ |

- 型定義はすべて`schemas/`のPydantic `BaseModel`で行う。SQLAlchemyモデル（`models/`）を直接APIレスポンスとして返さない（`response_model`にはschemaのみを指定する）。
- 新しいエンティティを追加する場合は、`model → schema → repository → service → router` の各ファイルを`app/`配下の対応ディレクトリに追加する（下記の実装例を参照）。

具体例（`Task`の一部を単純化したもの）:

```python
# ✅ repository: DBアクセスのみ
class TaskRepository:
    def get_by_id(self, task_id: uuid.UUID) -> Task | None:
        return self.db.get(Task, task_id)

# ✅ service: 業務ロジックのみ。repositoryを組み合わせる
class TaskService:
    def get_task(self, task_id: uuid.UUID) -> Task:
        task = self.repository.get_by_id(task_id)
        if task is None:
            raise TaskNotFoundError(f"Task {task_id} not found")
        return task

# ✅ router: HTTPの関心事のみ。serviceを呼ぶだけ
@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: uuid.UUID, service: TaskService = Depends(get_task_service)) -> TaskResponse:
    try:
        return service.get_task(task_id)
    except TaskNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
```

NGパターン（絶対に避ける）:

```python
# ❌ routerの中で直接DBクエリを書く（service層を飛ばしている）
@router.get("/{task_id}")
def get_task(task_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.get(Task, task_id)

# ❌ repositoryの中で業務ロジックを判断する
class TaskRepository:
    def get_active_task(self, task_id: uuid.UUID) -> Task | None:
        task = self.db.get(Task, task_id)
        if task and not task.is_done:  # ← これは業務ルール。service側の責務
            return task
        return None

# ❌ SQLAlchemyモデルをそのままレスポンスとして返す
@router.get("/{task_id}", response_model=Task)  # ← Taskはmodels/のORMクラス。schemasを使うべき
```

### フロントエンド（Web / モバイル共通）：UIとHooksの完全分離

`apps/web`と`apps/mobile`は同じ層構成をとる。依存の方向: `pages → hooks → @repo/api-client（orval生成）` / `pages → components（UI）`。UIコンポーネントが生成APIやTanStack Queryを直接呼ぶこと、Hooksの中でJSXを組み立てることは禁止。

| 層 | 責務 | 持ってよいもの | 持ってはいけないもの |
| --- | --- | --- | --- |
| **UI**（`components/`） | propsを受け取って描画するだけ | ローカルなUI状態（入力中のフォーム値など、API状態ではないもの） | API呼び出し、TanStack Queryの直接利用、グローバルな状態管理 |
| **Hooks**（`hooks/`） | API呼び出し（`@repo/api-client`の生成Hooksのラップ）、状態管理、キャッシュ無効化 | 生成Hooksの呼び出し、`queryClient.invalidateQueries`等 | JSXを返す、UIの見た目やCSSクラス名・スタイルを知る |
| **pages**（Web: `pages/` / モバイル: `app/`） | Hooksの結果をUIコンポーネントにpropsとして渡すだけの composition 層 | Hooksの呼び出し、イベントハンドラの組み立て（Hooksの関数を呼ぶだけの薄いラッパー） | 業務ロジック、直接のAPI呼び出し、複雑な状態管理 |

- 新機能を追加する場合は `hooks/useXxx.ts` + `components/xxx/`（状態を持たないUI） + ページ（Web: `pages/XxxPage.tsx` / モバイル: `app/xxx.tsx`）の3点セットで実装する（下記の実装例を参照）。
- UIコンポーネントは`onXxx`コールバックをpropsで受け取り、実際の処理（API呼び出しなど）は呼び出し元（Hooksを持つ層）に委譲する。
- Web: ルーティングは`react-router-dom`を使う。`main.tsx`の`<BrowserRouter>`が全体をラップし、`App.tsx`が唯一のルート定義場所（`pages/`配下の各コンポーネント = 1URLパス）になる。新しい画面を追加する場合は`pages/`にページを作り、`App.tsx`にルートを1行追加するだけにする。ルート定義を`components/`等に持ち込まない。
- モバイル: ルーティングはExpo Router（ファイルベース）。`src/app/`配下の1ファイルが1画面で、`src/app/_layout.tsx`がProviderとナビゲーションを持つ。`src/app/`には画面（pages層）以外を置かない。
- モバイルの画面はReact Nativeのネイティブコンポーネントで実装する。WebView（`react-native-webview` / `@expo/dom-webview`）やExpo DOMコンポーネント（`'use dom'`）でWeb版を埋め込むことはESLintで禁止している。
- Web版のUI（shadcn/ui・TailwindCSS）はモバイルでは使えない。Web / モバイルで共有するのは`@repo/api-client`（API型・Hooks）までで、UIはそれぞれ実装する。

具体例（`Task`機能を単純化したもの）:

```typescript
// ✅ Hooks: API呼び出しと状態管理のみ。JSXを返さない
export function useTasks() {
    const listQuery = useListTasksTasksGet();
    const updateMutation = useUpdateTaskTasksTaskIdPatch({ mutation: { onSuccess: invalidateList } });
    return {
        tasks: listQuery.data?.data ?? [],
        updateTask: (taskId: string, data: TaskUpdate) => updateMutation.mutateAsync({ taskId, data }),
    };
}

// ✅ UI: propsを受け取って描画するだけ。処理は呼び出し元に委譲
export function TaskItem({ task, onToggleDone }: TaskItemProps) {
    return <input type="checkbox" checked={task.is_done} onChange={() => onToggleDone(task)} />;
}

// ✅ pages: Hooksの結果をUIに渡すだけ
export function TasksPage() {
    const { tasks, updateTask } = useTasks();
    const handleToggleDone = (task: TaskResponse) => void updateTask(task.id, { is_done: !task.is_done });
    return <TaskList tasks={tasks} onToggleDone={handleToggleDone} />;
}
```

NGパターン（絶対に避ける）:

```typescript
// ❌ UIコンポーネントの中で直接APIを呼ぶ（Hooks層を飛ばしている）
export function TaskItem({ taskId }: { taskId: string }) {
    const { data } = useGetTaskTasksTaskIdGet(taskId); // ← hooks/を経由すべき
    return <div>{data?.data.title}</div>;
}

// ❌ Hooksの中でJSXを返す
export function useTasks() {
    const { data } = useListTasksTasksGet();
    return <ul>{data?.data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>; // ← UIはcomponents/の責務
}

// ❌ pagesの中で業務ロジックやAPI呼び出しを直接書く
export function TasksPage() {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    useEffect(() => {
        fetch("/tasks").then((res) => res.json()).then(setTasks); // ← 直接fetchせず、hooks/経由にする
    }, []);
    ...
}
```

## API連携（OpenAPI自動生成）

Web / モバイルはバックエンドのAPIを**直接fetchしない**。必ず`@repo/api-client`（`packages/api-client`）がorvalで生成した関数・Hooksを経由する。

1. バックエンドのOpenAPIスキーマを書き出す:
   ```
   cd services/backend && uv run python -m app.export_openapi
   ```
   → リポジトリルートに `openapi.json` が生成される（gitignore対象、都度再生成する）。

2. APIクライアントを生成する（リポジトリルートで実行）:
   ```
   pnpm generate:api
   ```
   → `packages/api-client/src/generated/` にfetchクライアント + TanStack Query Hooksが生成される（gitignore対象）。

3. バックエンドのエンドポイント（router/schemas）を変更したら、上記2ステップを再実行する。Docker上のbackendから行う場合は `make generate-api` で同じことができる。

- `packages/api-client/src/custom-fetch.ts` と `src/index.ts` 以外の `src/generated/` 配下は自動生成物なので手で編集しない。
- 生成物はgitに含まれないため、クローン直後・CIでは必ず1→2を実行してから型チェック・テスト・ビルドする（CIは自動で実行する）。
- 接続先のベースURLは各アプリのエントリポイント（Web: `src/main.tsx`、モバイル: `src/app/_layout.tsx`）で`configureApiClient({ baseUrl })`により注入する。環境変数はWebが`VITE_API_BASE_URL`、モバイルが`EXPO_PUBLIC_API_BASE_URL`。

## コメント規約

**適用範囲**: exportされているかどうかに関わらず、すべての関数・メソッド・クラス・Reactコンポーネント・カスタムフックに付ける。プライベートなヘルパー関数、コンポーネント内部の小さな関数であっても省略しない。`{関数の機能}`には処理のWHAT（何をするか）を日本語で簡潔に書く。既存コードに手を入れて関数のシグネチャや挙動を変えた場合は、コメントも合わせて更新する。

### TypeScript

関数・クラス・Reactコンポーネント・カスタムフックには必ず以下の形式でコメントを付ける。`/**`の直後と`@param`/`@return`の前後には指定通り空行を入れ、行頭に`*`は付けない（通常のJSDocとは異なる、このプロジェクト独自の形式）。閉じタグは`*/`ではなく`**/`。

```typescript
/**

{関数の機能}

@param
@return

**/
```

- 引数が無い場合も`@param`の行は残し、右側は空のままにする（例: `@param なし`と書いてもよい）。
- 戻り値が`void`の場合も`@return`の行は残し、`@return なし`のように書く。
- 引数が複数ある場合は`@param`を複数行に分けず、`@param name1 説明1、name2 説明2`のように1行にまとめるか、propsオブジェクトの場合は1つの`@param props`にまとめて説明する（下記例を参照）。

通常の関数の例:

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

Reactコンポーネント（UIコンポーネント）の例。`@param`にはpropsの型ではなく、各propsが何を意味するかを説明する:

```typescript
/**

タスク1件を表示する純粋なUIコンポーネント。
完了チェックボックスと削除ボタンの操作はすべて親から渡されたコールバックに委譲する。

@param props task（表示対象のタスク）、onToggleDone（完了切り替え時のコールバック）、onDelete（削除時のコールバック）
@return タスク1行分のJSX

**/
export function TaskItem({ task, onToggleDone, onDelete }: TaskItemProps) {
    // ...
}
```

カスタムフックの例。Hooksが「何を扱い、何を返すか」を書く:

```typescript
/**

タスク一覧の取得・作成・更新・削除をまとめて扱うカスタムフック。
orvalが生成したTanStack Query Hooksをラップし、更新系操作の成功時に
一覧クエリを自動的に再検証する。UIコンポーネントはこのフックのみに依存する。

@param なし
@return タスク一覧の状態と、作成・更新・削除を行う関数群

**/
export function useTasks() {
    // ...
}
```

クラス（例: エラークラス）の例:

```typescript
/**

APIリクエストが失敗した場合に送出されるエラー。

@param message エラーメッセージ
@return なし

**/
export class ApiRequestError extends Error {
    // ...
}
```

### Python

関数・メソッド・クラスには必ず以下の形式でdocstringを付ける。クラス自体にもクラスdocstringとして同じ形式を付ける（`Params:`にはコンストラクタ引数を書く）。

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

- 引数・戻り値が無い場合も `Params:` / `Returns:` セクション自体は残し、`-` のみを書く。
- `self`はParamsに書かない。
- 例外を送出しうる場合は、`Returns:`の後に`Raises:`セクションを追加し同じ形式（`- {例外クラス}: {発生条件}`）で書く。

引数・戻り値ともに無い場合の例:

```python
class TaskNotFoundError(Exception):
    """
    指定したタスクが存在しない場合に送出される例外。

    Params:
        -

    Returns:
        -
    """
```

複数の引数と戻り値がある例（repository層）:

```python
def get_by_id(self, task_id: uuid.UUID) -> Task | None:
    """
    IDを指定してタスクを1件取得する。

    Params:
        - task_id (uuid.UUID): 取得対象のタスクID

    Returns:
        - Task | None: 該当タスク。存在しない場合はNone
    """
```

例外を送出する場合の例（service層。`Raises:`を追加する）:

```python
def get_task(self, task_id: uuid.UUID) -> Task:
    """
    IDを指定してタスクを1件取得する。

    Params:
        - task_id (uuid.UUID): 取得対象のタスクID

    Returns:
        - Task: 該当タスク

    Raises:
        - TaskNotFoundError: タスクが存在しない場合
    """
```

クラスの例（コンストラクタ引数を`Params:`に書く）:

```python
class TaskService:
    """
    タスクに関する業務ロジックを担うサービス層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self, db: Session) -> None:
        """
        DBセッションからリポジトリを組み立ててサービスを初期化する。

        Params:
            - db (Session): SQLAlchemyセッション

        Returns:
            -
        """
```

## フォーマッター・Lintルール

- TypeScript（web / mobile / api-client）: インデント4スペース固定（Prettier `tabWidth: 4`）。import順序は `eslint-plugin-import-x` の `import-x/order` で強制（builtin → external → internal(`@/*`) → parent/sibling → type、グループ間は空行必須、グループ内はアルファベット順）。React Hooks / React Compilerのルールは`eslint-plugin-react-hooks`（recommended）で検査する。ESLint・Prettierの設定はリポジトリルートの1つを全パッケージで共有する。
- バックエンド: ruffでLint/Format。インデント4スペース、import順序はisort相当のルールで強制。
- Terraform: `terraform fmt`で整形する（Prettierの対象外）。

コマンド:
```
# TypeScript（リポジトリルートで実行）
pnpm lint          # ESLint
pnpm typecheck     # 全パッケージの型チェック
pnpm format        # Prettier --write
pnpm format:check

# backend
cd services/backend
uv run ruff check .
uv run ruff format .

# Terraform
make infra-fmt       # terraform fmt -recursive
make infra-validate  # fmt -check + init -backend=false + validate
```

## セットアップ・起動方法

開発環境は「通常開発」と「AWS互換開発」の2つに分かれており、互いに独立して起動する。

### 通常開発（PostgreSQL + FastAPI + Web）

```
make setup     # .env.exampleから .env / services/backend/.env / apps/web/.env / apps/mobile/.env を作成
make install   # ホストにpnpm workspaceの依存をインストール（mobile・Lint・型チェックに必要）
make up        # docker compose up --build（db / backend / web）
make dev-mobile  # Expo開発サーバーをホストで起動（シミュレータ/実機から接続するため）
```

- backend起動時に `alembic upgrade head` が自動実行される（`docker-compose.yml`のcommand参照）。
- 初期データの投入は自動実行されない。手動で以下を実行する:
  ```
  docker compose exec backend uv run python -m app.seed.seed
  ```

アクセス先:
- Web: http://localhost:5173
- バックエンドAPI: http://localhost:8000 （Swagger UI: http://localhost:8000/docs）
- PostgreSQL: localhost:5432
- モバイル: Expo開発サーバー（`make dev-mobile`の表示に従いシミュレータ/Expo Goで開く）

### 本番・ステージング（AWS）

- 構成・初回構築・運用は [docs/infrastructure.md](./docs/infrastructure.md) にまとめている。アプリのデプロイは GitHub Actions が行い、手元から行わない。
- 環境ごとの実AWS変更は`make plan-aws ENV=stg|prod`で保存planを作り、レビュー後に`make apply-aws ENV=stg|prod`で適用する。削除時は`destroy-plan-aws` / `destroy-apply-aws`が確認文字列とstateバックアップを必須にする。共通の`shared`ルートだけは初回に手動適用する。
- 環境ごとの差（タスク数・DBの保護設定など）は`envs/<env>/main.tf`のmodule引数だけに書き、リソース定義は`modules/environment`に1つだけ持つ。stg用に本番向けの定義を弱めない。
- 秘密値をtfvars・Terraformのコードに書かない。DBパスワードはephemeral + write-only属性で生成してstateに残さず、アプリの秘密値はSecrets Managerに運用者が設定する。
- 本番のAPIコンテナは`services/backend/Dockerfile`の`prod`ターゲット。DB接続情報は`DB_HOST`等の個別の環境変数で渡され、`app/core/config.py`がDATABASE_URLを組み立てる。
- DBマイグレーションはデプロイ時に旧バージョンのAPIが動いたまま先に適用される。旧コードと互換性のない変更（列の削除・名前変更）は複数回のデプロイに分ける。

## 新しいエンティティ追加の初期データ

`app/seed/data.py` に `{エンティティ名}_SEED_DATA` 定数を追加し、`app/seed/seed.py` の `run_seed()` から呼び出す関数を追加する。

## マイグレーション

```
cd services/backend
uv run alembic revision --autogenerate -m "説明"
uv run alembic upgrade head
```

`app/models/` にモデルを追加したら、`alembic/env.py` で読み込まれるように `app/models/__init__.py` に追記する。

## テスト

```
# backend
cd services/backend && uv run pytest

# web / api-client（Vitest）・mobile（Jest）をまとめて実行（リポジトリルート）
pnpm test

# 個別に実行する場合
pnpm --filter web test
pnpm --filter mobile test
pnpm --filter @repo/api-client test
```

## CI

`.github/workflows/ci.yml` が push（main）/ pull_request で以下を実行する。ローカルで同じ確認をしてからコミットする。

- JS: OpenAPI書き出し → `pnpm generate:api` → `pnpm lint` / `pnpm format:check` / `pnpm typecheck` / `pnpm test` / `pnpm build`
- backend: `uv run ruff check .` / `uv run ruff format --check .` / `uv run pytest`
- backend: 本番用イメージのビルド（`docker build --target prod`）
- compose: `docker compose config`
- Terraform: `make infra-validate`（全ルートの fmt / validate）

`.github/workflows/deploy.yml` は main で CI が成功すると stg へデプロイし、prod へは手動実行（GitHub Environment の承認）でデプロイする。

## 不明点があれば

このリポジトリの構成・規約について不明な点や、要件と実装が食い違う可能性がある場合は、推測で進めずに必ず確認すること。
