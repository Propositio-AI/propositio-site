from typing import Any

from app.core.config import Settings
from app.repositories.mail_repository import SesMailRepository
from app.schemas.mail import MailMessage


class FakeSesClient:
    """
    send_emailの引数を記録するだけのテスト用SESクライアント。

    Params:
        -

    Returns:
        -
    """

    def __init__(self) -> None:
        """
        呼び出し記録を初期化する。

        Params:
            -

        Returns:
            -
        """
        self.calls: list[dict[str, Any]] = []

    def send_email(self, **kwargs: Any) -> dict[str, str]:
        """
        引数を記録し、SESと同じ形のレスポンスを返す。

        Params:
            - kwargs (Any): send_emailに渡された引数

        Returns:
            - dict[str, str]: メッセージIDを含むレスポンス
        """
        self.calls.append(kwargs)
        return {"MessageId": "fake"}


def test_ses_send_builds_utf8_message_with_reply_to_and_configuration_set() -> None:
    """
    件名・本文をUTF-8で送り、Reply-Toと設定セットを指定する。

    Params:
        -

    Returns:
        -
    """
    client = FakeSesClient()
    repository = SesMailRepository(
        sender="Propositio AI <noreply@example.com>",
        region="ap-northeast-1",
        configuration_set="karynos",
        client=client,
    )

    repository.send(
        MailMessage(to="info@example.com", subject="件名", body="本文", reply_to="a@example.com")
    )

    call = client.calls[0]
    assert call["FromEmailAddress"] == "Propositio AI <noreply@example.com>"
    assert call["Destination"] == {"ToAddresses": ["info@example.com"]}
    assert call["ReplyToAddresses"] == ["a@example.com"]
    assert call["ConfigurationSetName"] == "karynos"
    assert call["Content"]["Simple"]["Subject"] == {"Data": "件名", "Charset": "UTF-8"}


def test_ses_send_omits_optional_fields() -> None:
    """
    Reply-Toと設定セットが無い場合は、それらの引数を渡さない。

    Params:
        -

    Returns:
        -
    """
    client = FakeSesClient()
    repository = SesMailRepository(
        sender="noreply@example.com", region="ap-northeast-1", client=client
    )

    repository.send(MailMessage(to="info@example.com", subject="件名", body="本文"))

    assert "ReplyToAddresses" not in client.calls[0]
    assert "ConfigurationSetName" not in client.calls[0]


def test_settings_builds_database_url_from_parts() -> None:
    """
    DB_HOSTが設定されている場合、記号を含むパスワードをエスケープしてTLS必須のURLを組み立てる。

    Params:
        -

    Returns:
        -
    """
    settings = Settings(
        db_host="db.internal", db_user="app", db_password="p@ss/word", db_name="app"
    )

    assert settings.database_url == (
        "postgresql+psycopg://app:p%40ss%2Fword@db.internal:5432/app?sslmode=require"
    )


def test_turnstile_disabled_placeholder_is_treated_as_off(monkeypatch) -> None:
    """
    シークレットが空、または初期値 "disabled" の場合はTurnstileの検証を無効として扱う。

    Params:
        - monkeypatch (pytest.MonkeyPatch): 設定の差し替えに使う

    Returns:
        -
    """
    from app.repositories import turnstile_repository

    for secret, expected in [("", False), ("disabled", False), ("0x4AAA", True)]:
        monkeypatch.setattr(
            turnstile_repository, "get_settings", lambda s=secret: Settings(turnstile_secret_key=s)
        )
        assert turnstile_repository.TurnstileRepository().enabled is expected
