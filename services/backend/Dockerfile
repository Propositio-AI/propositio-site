# syntax=docker/dockerfile:1
# dev: docker compose での開発用（ソースをマウントしてホットリロード）
# prod: ECS（Fargate）で動かす本番用（依存は本番分のみ・非rootユーザー）

FROM python:3.12-slim AS base
COPY --from=ghcr.io/astral-sh/uv:0.5 /uv /uvx /usr/local/bin/
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

# ---- 開発用 ----
FROM base AS dev
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project
COPY . .
RUN uv sync --locked
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---- 本番用：依存のビルド ----
FROM base AS build
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project
COPY . .
RUN uv sync --locked --no-dev

# ---- 本番用：実行イメージ（uvやテストを含めない） ----
FROM python:3.12-slim AS prod
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"
RUN useradd --system --uid 10001 --no-create-home app
COPY --from=build --chown=app:app /app/.venv /app/.venv
COPY --from=build --chown=app:app /app/app /app/app
COPY --from=build --chown=app:app /app/alembic /app/alembic
COPY --from=build --chown=app:app /app/alembic.ini /app/alembic.ini
USER app
EXPOSE 8000
# ALBの背後で動くため、X-Forwarded-For / X-Forwarded-Proto を信頼して送信者のIPを取得する
# （タスクにはALBのセキュリティグループからしか到達できない）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--forwarded-allow-ips", "*"]
