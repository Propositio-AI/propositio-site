# Karynos サイト：外部サービスの設定

Karynos サイト（`apps/web`）が使う外部サービスの設定手順。デザインの元データは claude.ai/design の「Karynos」プロジェクト（`Karynos.dc.html` ほか）。

| 機能 | 使うもの | 設定する場所 |
| --- | --- | --- |
| 活動記録（一覧・詳細・カテゴリ） | microCMS | `services/backend/.env` |
| お問い合わせの通知・自動返信 | Google Workspace（Gmail API） | `services/backend/.env` |
| フォームのボット対策（任意） | Cloudflare Turnstile | `services/backend/.env` と `apps/web/.env` |

ブラウザが microCMS や Gmail を直接呼ぶことはない。APIキーはすべてバックエンドに置き、Web は `@repo/api-client` 経由で `GET /activities`・`GET /categories`・`POST /contacts` だけを呼ぶ。

## 1. microCMS

API を2つ作成する（どちらも「リスト形式」）。

### `categories`（カテゴリ）

| フィールドID | 種類 | 備考 |
| --- | --- | --- |
| `name` | テキストフィールド | 表示名（例: 調査 / 開発 / インタビュー / お知らせ） |

- コンテンツIDは英数字・`-`・`_` だけにする（例: `research`）。一覧ページの絞り込みに使うため、それ以外の文字は API で弾かれる。
- 一覧ページのタブは、管理画面の並び順どおりに表示される。

### `activities`（活動記録）

| フィールドID | 種類 | 必須 | 備考 |
| --- | --- | --- | --- |
| `title` | テキストフィールド | ○ | |
| `description` | テキストエリア | | 一覧カードと記事冒頭に表示する概要 |
| `category` | コンテンツ参照（`categories`） | | |
| `thumbnail` | 画像 | | 未設定の場合はカテゴリ名を大きく表示する |
| `content` | リッチエディタ | ○ | 本文。バックエンドでサニタイズしてから返す |

- 並び順は `publishedAt`（公開日時）の新しい順。
- コンテンツIDは英数字・`-`・`_` だけにする（記事URL `/activities/{id}` に使うため）。
- API キーは GET 権限だけあればよい。`MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` に設定する。

## 2. お問い合わせメール（Gmail API）

送信されたお問い合わせは DB（`contacts` テーブル）に保存したうえで、次の2通を送る。

- **運営への通知**: `CONTACT_NOTIFY_TO` 宛て。Reply-To が送信者になっているので、Gmail でそのまま返信できる。
- **送信者への自動返信**: 受付の連絡だけを送る。第三者のアドレス宛てに迷惑メールを送る踏み台にされないよう、お問い合わせ本文は含めない。

メールの送信に失敗しても受付は成功扱いにする（内容は DB に残り、エラーはバックエンドのログに出る）。

開発中は `MAIL_BACKEND=console` のままにしておくと、送信せずにログへ出力するだけになる。

### Google Workspace の設定（初回のみ）

1. Google Cloud でプロジェクトを作成し、**Gmail API** を有効にする。
2. **サービスアカウント**を作成し、JSON 鍵を発行する。
3. Workspace 管理コンソール →「セキュリティ」→「API の制御」→「ドメイン全体の委任」で、サービスアカウントのクライアントIDにスコープ `https://www.googleapis.com/auth/gmail.send` を許可する。
4. 送信元にする Workspace ユーザー（例: `contact@<ドメイン>`）を決める。送信専用のアカウントにしておくのがよい。
5. `services/backend/.env` を設定する。

```
MAIL_BACKEND=gmail
GMAIL_SENDER=contact@example.com
GMAIL_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' # 鍵JSONを1行にし、シングルクォートで囲む
CONTACT_NOTIFY_TO=info@example.com                          # Googleグループも指定できる
```

鍵 JSON は秘密情報なのでコミットしない。本番ではシークレットマネージャ等から環境変数として渡す。

## 3. Cloudflare Turnstile（任意）

Cloudflare でサイトを登録し、サイトキーとシークレットキーを発行して両方に設定する。

```
# apps/web/.env
VITE_TURNSTILE_SITE_KEY=...
# services/backend/.env
TURNSTILE_SECRET_KEY=...
```

- どちらも空のままなら検証は行わない（ウィジェットも表示しない）。
- 有効にすると、確認画面にウィジェットが表示され、トークンを取得するまで「送信する」が押せなくなる。検証APIに接続できない場合も送信は受け付けない。

既存のスパム対策として、同じメールアドレスからの送信は1時間に5件までに制限している。

## 4. お問い合わせの管理

運営は通知メール（Google Workspace）で受け付けた内容を確認する。受付内容は DB に保存されるが、個人情報を含むため一覧を返す公開 API は用意していない（以前の `GET /contacts` は削除した）。
