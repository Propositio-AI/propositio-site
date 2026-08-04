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
