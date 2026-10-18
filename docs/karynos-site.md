# Karynos サイト：外部サービスの設定

Karynos サイト（`apps/web`）が使う外部サービスの設定手順。デザインの元データは claude.ai/design の「Karynos」プロジェクト（`Karynos.dc.html` ほか）。

| 機能 | 使うもの | 設定する場所 |
| --- | --- | --- |
| 活動記録（一覧・詳細・カテゴリ） | microCMS | `services/backend/.env` |
| お問い合わせの通知・自動返信 | Amazon SES で送信し、Google Workspace（Gmail）で受信・返信 | 本番は Terraform（`infra/terraform`）、開発は `services/backend/.env` |
| フォームのボット対策（任意） | Cloudflare Turnstile | 本番は Secrets Manager と GitHub の Variables、開発は `services/backend/.env` と `apps/web/.env` |

ブラウザが microCMS や SES を直接呼ぶことはない。APIキーはすべてバックエンドに置き、Web は `@repo/api-client` 経由で `GET /activities`・`GET /categories`・`POST /contacts` だけを呼ぶ。

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
- API キーは GET 権限だけあればよい。開発では `services/backend/.env` の `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` に設定する。本番では、サービスドメインは `envs/<env>/terraform.tfvars`、API キーは Secrets Manager に設定する（[infrastructure.md](./infrastructure.md) の初回構築 手順5）。

## 2. お問い合わせメール（Amazon SES → Google Workspace）

送信は Amazon SES、受信と返信は Google Workspace の Gmail で行う。MX（受信）は Google のままで、SES は送信だけに使う。

送信されたお問い合わせは DB（`contacts` テーブル）に保存したうえで、次の2通を送る。

| メール | From | To | Reply-To |
| --- | --- | --- | --- |
| 運営への通知 | `noreply@<domain>` | `CONTACT_NOTIFY_TO`（例: `info@<domain>`） | 送信者 → Gmail で「返信」すると送信者へ直接届く |
| 送信者への自動返信 | `noreply@<domain>` | 送信者 | 運営のアドレス → 送信者が返信しても Gmail に届く |

- 自動返信には、受付の連絡だけを入れる。第三者のアドレス宛てに迷惑メールを送る踏み台にされないよう、お問い合わせ本文は含めない。
- メールの送信に失敗しても受付は成功扱いにする（内容は DB に残り、エラーはバックエンドのログに出る）。
- 開発中は `MAIL_BACKEND=console` のままにしておくと、送信せずにログへ出力するだけになる。

### 設定

SES のドメイン認証（DKIM・MAIL FROM）、送信権限、送信元・通知先の環境変数は Terraform が設定する（[infrastructure.md](./infrastructure.md)）。手動で必要なのは次の2つだけ。

1. **SES の本番利用申請**（サンドボックスの解除）。解除前は、自分のドメインのアドレス（通知）にしか送れず、自動返信が届かない。
2. **通知先アドレスの用意**：`contact_notify_to` に指定するアドレス（Google グループでも可）を Google Workspace に作る。

DNS は、既存の Google Workspace 用のレコード（MX・ルートドメインの SPF）を変更しない。SES の SPF は MAIL FROM 用のサブドメイン（`mail.<domain>`）に閉じ込め、DMARC は DKIM の署名で満たす。

## 3. Cloudflare Turnstile（任意）

Cloudflare でサイトを登録し、サイトキーとシークレットキーを発行して両方に設定する。

| | サイトキー（公開してよい） | シークレットキー |
| --- | --- | --- |
| 開発 | `apps/web/.env` の `VITE_TURNSTILE_SITE_KEY` | `services/backend/.env` の `TURNSTILE_SECRET_KEY` |
| 本番 | GitHub の Environment の Variables `VITE_TURNSTILE_SITE_KEY` | Secrets Manager `<project>-<env>/app` の `TURNSTILE_SECRET_KEY` |

- サイトキーが空ならウィジェットを表示せず、シークレットキーが空（または `disabled`）なら検証しない。
- 有効にすると、確認画面にウィジェットが表示され、トークンを取得するまで「送信する」が押せなくなる。検証APIに接続できない場合も送信は受け付けない。

既存のスパム対策として、同じメールアドレスからの送信は1時間に5件までに制限している。

## 4. お問い合わせの管理

運営は通知メール（Google Workspace の Gmail）で受け付けた内容を確認し、そのまま返信する。受付内容は DB に保存されるが、個人情報を含むため一覧を返す公開 API は用意していない（以前の `GET /contacts` は削除した）。
