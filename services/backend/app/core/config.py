from functools import lru_cache

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
    cors_origins: str = "http://localhost:5173"
    microcms_service_domain: str = ""
    microcms_api_key: str = ""

    # メール送信。"console"はログ出力のみ（開発用）、"gmail"はGmail APIで実際に送信する
    mail_backend: str = "console"
    # Gmail APIの送信元（Workspaceのユーザー。サービスアカウントがこのユーザーとして送信する）
    gmail_sender: str = ""
    # ドメイン全体の委任を設定したサービスアカウントの鍵（JSON文字列）
    gmail_service_account_json: str = ""
    # お問い合わせの通知先（運営のGoogle Workspaceアドレス）
    contact_notify_to: str = ""

    # Cloudflare Turnstileのシークレットキー。空の場合はボット検証を行わない
    turnstile_secret_key: str = ""

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
