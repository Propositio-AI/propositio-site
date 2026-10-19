from functools import lru_cache
from typing import Literal, Self
from urllib.parse import quote_plus

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    アプリケーション全体の環境設定を保持するクラス。

    Params:
        -

    Returns:
        -
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://app:app@db:5432/app"
    # 本番（ECS）では接続情報を個別に渡す（パスワードはSecrets Managerから注入する）。
    # DB_HOSTが設定されている場合は、これらからDATABASE_URLを組み立てる
    db_host: str = ""
    db_port: int = 5432
    db_name: str = "app"
    db_user: str = "app"
    db_password: str = ""
    cors_origins: str = "http://localhost:5173"
    microcms_service_domain: str = ""
    microcms_api_key: str = ""

    # メール送信。"console"はログ出力のみ（開発用）、"ses"はAmazon SESで実際に送信する
    mail_backend: Literal["console", "ses"] = "console"
    # 送信元アドレス（SESで認証済みのドメインのアドレス。例: noreply@example.com）
    mail_from: str = "noreply@example.com"
    mail_from_name: str = "Propositio AI"
    # 自動返信メールのReply-To（送信者が返信したときの運営宛先）
    mail_reply_to: str = ""
    # お問い合わせの通知先（運営のメールアドレス）
    contact_notify_to: str = ""
    # SESの設定セット（バウンス・苦情の抑制や送信メトリクスに使う）。空なら指定しない
    ses_configuration_set: str = ""
    aws_region: str = "ap-northeast-1"

    # Cloudflare Turnstileのシークレットキー。空の場合はボット検証を行わない
    turnstile_secret_key: str = ""

    @model_validator(mode="after")
    def build_database_url(self) -> Self:
        """
        DB_HOSTが設定されている場合、個別の接続情報からDATABASE_URLを組み立てる（TLS必須）。

        Params:
            -

        Returns:
            - Self: DATABASE_URLを確定させた設定
        """
        if self.db_host:
            self.database_url = (
                f"postgresql+psycopg://{quote_plus(self.db_user)}:{quote_plus(self.db_password)}"
                f"@{self.db_host}:{self.db_port}/{quote_plus(self.db_name)}?sslmode=require"
            )
        return self

    @property
    def cors_origins_list(self) -> list[str]:
        """
        CORS_ORIGINSをカンマ区切りで分割してリスト化する。

        Params:
            -

        Returns:
            - list[str]: オリジン文字列のリスト
        """
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """
    Settingsのシングルトンインスタンスを取得する。

    Params:
        -

    Returns:
        - Settings: キャッシュされた設定インスタンス
    """
    return Settings()
