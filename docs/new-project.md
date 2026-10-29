# 新しいプロジェクトを作る（このリポジトリをベースにする）

このリポジトリ（`propositio-base`）は、新しいプロジェクトを始める際のベースとして使うことを前提にしている。ここでは、このリポジトリを別のリポジトリにコピーして新規プロジェクトを立ち上げる手順をまとめる。

## 方法1: GitHubの「テンプレートリポジトリ」機能を使う（推奨）

GitHub上で `propositio-base` が「Template repository」として設定されていれば、この方法が最も簡単。コミット履歴を持ち込まず、クリーンな状態の新規リポジトリを作れる。

1. GitHub上で `propositio-base` を開き、**Use this template → Create a new repository** を選択する
2. 新しいリポジトリ名・Owner・Public/Privateを指定して作成する
3. 作成された新しいリポジトリをローカルにclone する

```bash
git clone https://github.com/<owner>/<new-repo-name>.git
cd <new-repo-name>
```

まだ `propositio-base` がテンプレートリポジトリとして設定されていない場合は、GitHub上の `propositio-base` → **Settings → General → Template repository** のチェックボックスを有効にする（要リポジトリ管理者権限）。

## 方法2: リポジトリを手動でコピーする

GitHubのテンプレート機能を使わない場合（GitHub以外のホスティングを使う、権限がない等）は、以下の手順で手動コピーする。

```bash
# 1. propositio-baseをclone（--depth 1で履歴を持ち込まない）
git clone --depth 1 https://github.com/Propositio-AI/propositio-base.git <new-project-name>
cd <new-project-name>

# 2. propositio-baseの履歴・リモートを切り離す
rm -rf .git
git init

# 3. 新しいリモートを設定してpush
git remote add origin https://github.com/<owner>/<new-project-name>.git
git add .
git commit -m "Initial commit from propositio-base"
git push -u origin main
```

`propositio-base`の開発の変遷を新プロジェクトにも残したい場合は、`rm -rf .git && git init` を行わず `git remote set-url origin <new-repo-url>` に置き換えてもよい（この場合、`propositio-base`側の以降のコミットをpullで取り込むことも可能になる）。

## コピー後にやること

### 1. プロジェクト名・説明を書き換える

コードの動作は「propositio-base」という名前に依存していない（パッケージ名は`web` / `mobile` / `@repo/api-client` / `backend`）。ただし以下は新しいプロジェクトに合わせて書き換える。

| ファイル | 書き換える箇所 |
| --- | --- |
| `README.md` | タイトル（`# propositio-base`）と概要説明 |
| `CLAUDE.md` | 冒頭の概要説明（`# propositio-base` と最初の段落）。技術スタックやディレクトリ構成・規約部分はそのまま流用してよい |
| `package.json` | ルートの`name` |
| `apps/mobile/app.json` | `expo.name` / `expo.slug` / `expo.scheme`（アプリ名・Expoのプロジェクト識別子・ディープリンクのURLスキーム） |
| `apps/web/index.html` | `<title>` |
| `apps/web/src/pages/WelcomePage.tsx` / `apps/mobile/src/components/welcome/WelcomeView.tsx` | 表示しているプロジェクト名・説明（最初の画面を作るときに置き換える） |
| `services/backend/app/main.py` | `FastAPI(title=...)`（OpenAPIのタイトル） |
| `services/backend/pyproject.toml` | 必要であれば`name` / `description` |
| `propositio-infra/config/defaults.json` | deploy Role用のresource prefix・GitHubリポジトリ・deploy権限 |
| `infra/terraform/env/<env>/main.tf` | profile・Hosted Zone・stg/prodドメイン・認証設定 |

`docs/`配下（このファイルを除く `getting-started.md` / `architecture.md` / `development.md` / `infrastructure.md`）は、このベースリポジトリの構成・規約に関する説明であり、プロジェクト名に依存する記述はほぼ無いためそのまま使い続けてよい。プロジェクト固有のドメイン知識（機能一覧・仕様など）が増えてきたら、別ファイルとして追加していく。

### 2. 環境変数を作り直す

`.env.example`系はそのままコピーされているので、通常どおりセットアップする（[getting-started.md](./getting-started.md)参照）。

```bash
make setup
# または
cp .env.example .env
cp services/backend/.env.example services/backend/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

複数のプロジェクト（`propositio-base`から作った別プロジェクト同士、または`propositio-base`自体）を同じマシンで同時に起動する場合、`docker-compose.yml`が公開しているポート（`5173` / `8000` / `5432`）、Expo（`8081`）が競合する。同時起動しないか、新プロジェクト側でホスト側ポートを変更する。

### 3. 不要なサンプルコードを削除する

`propositio-base`には最小限のサンプル（backendの`/health`、Webの`WelcomePage`、モバイルの`useHealth` + `components/welcome/`）だけが含まれている。新規プロジェクトの最初の機能実装時に置き換える（実装方法自体は[development.md](./development.md)の「新しいエンティティを追加する」を参考にできる）。

AWS基盤（`infra/`）を使わないプロジェクトでは、`infra/`ディレクトリ、Makefileの「インフラ（Terraform）」セクション、`.github/workflows/ci.yml`の`terraform`ジョブ、`.github/workflows/deploy.yml`、`docs/infrastructure.md`を削除してよい。

### 4. 初回起動して動作確認する

```bash
make up            # または docker compose up --build
make generate-api  # APIクライアントを生成する
make seed          # 初期データが必要な場合
make install && make dev-mobile   # モバイルを確認する場合
```

[getting-started.md](./getting-started.md)の手順どおりに起動し、Web（http://localhost:5173 ）とバックエンドAPI（http://localhost:8000/docs ）、モバイル（Expo）にアクセスできることを確認する。AWS基盤を使う場合は、[infrastructure.md](./infrastructure.md)の「初回構築」に従って stg を作成する。

### 5. CIを有効にする

`.github/workflows/ci.yml`はGitHubにpushすれば自動で有効になる（main へのpushとpull request）。ブランチ保護でCIの成功を必須にしておく。

### 6. `propositio-base`側の更新を後から取り込みたい場合

方法2で`git init`し直した場合、`propositio-base`をリモートとして追加しておけば、後から更新分をマージできる。

```bash
git remote add upstream https://github.com/Propositio-AI/propositio-base.git
git fetch upstream
git merge upstream/main --allow-unrelated-histories
```

コンフリクトは主にプロジェクト名を書き換えた`README.md`・`CLAUDE.md`で発生しやすい。手動で解消する。
