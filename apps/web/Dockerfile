# ビルドコンテキストはリポジトリルート（pnpm workspace全体の依存解決が必要なため）
FROM node:22-slim

WORKDIR /workspace

RUN corepack enable

# 依存定義だけを先にコピーし、web（とその依存のworkspaceパッケージ）の依存だけをインストールする
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/
COPY packages/api-client/package.json packages/api-client/
RUN pnpm install --frozen-lockfile --filter "web..." --filter propositio-base

COPY . .

WORKDIR /workspace/apps/web

EXPOSE 5173

CMD ["pnpm", "dev", "--host"]
