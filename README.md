# Propositio Site

Propositio の公式サイトです。Next.js(App Router) + TypeScript + Supabase + microCMS で構築しています。

- 本番URL: https://propositio.com
- ローカルURL: http://localhost:3000

## 主な機能

- トップページ・About ページ・Products(Karynos)ページ・参加募集ページ・お問い合わせページ・メンバーページ
- microCMS と連携したブログ一覧表示
- Supabase 連携による応募/お問い合わせデータ保存
- お問い合わせ・参加応募受付時の Slack 通知、および AWS SES による自動返信メール送信
- 管理画面での応募・お問い合わせステータス管理
- NextAuth(Credentials) を使った管理者ログイン

## 技術スタック

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- microCMS
- NextAuth.js v5(beta)
- shadcn/ui
- AWS SES / react-email(自動返信メール送信)

## セットアップ

1. 依存関係をインストール

```bash
npm install
```

2. 環境変数ファイルを作成

プロジェクトルートに .env.local を作成し、以下を設定してください。

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# microCMS
NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN=
NEXT_PUBLIC_MICROCMS_API_KEY=

# 管理者ログイン
AUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Slack通知
SLACK_WEBHOOK_URL=

# AWS SES(自動返信メール送信)
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

3. 開発サーバーを起動

```bash
npm run dev
```

4. ブラウザで確認

http://localhost:3000 にアクセスしてください。

## npm scripts

- npm run dev: 開発サーバー起動
- npm run build: 本番ビルド
- npm run start: 本番モード起動
- npm run lint: ESLint 実行

## 管理画面

- URL: /admin/login
- ログインは .env.local の ADMIN_EMAIL / ADMIN_PASSWORD で認証されます

ログイン後、以下の管理ページにアクセスできます。

- /admin/contact
- /admin/join
- /admin/blog

## Supabase テーブル要件

このプロジェクトでは、以下のテーブルを利用します。

1. blogs
2. contact_inquiries
3. join_applications

### 推奨カラム

- blogs
	- id
	- title
	- description
	- thumbnail_url
	- instagram_url
	- published_at
	- tags
- contact_inquiries
	- id
	- email
	- title
	- content
	- created_at
	- status
- join_applications
	- id
	- name
	- email
	- school_info
	- position
	- motivation
	- created_at
	- status

## ディレクトリ概要

- app/: ページと Server Action
- components/: UI コンポーネント群
- data/: JSON データ
- lib/: 共通ロジック・型定義
- public/: 静的アセット

## 補足

- パスエイリアスは @/* を利用しています
- 管理認証には NextAuth Credentials Provider を使用しています
