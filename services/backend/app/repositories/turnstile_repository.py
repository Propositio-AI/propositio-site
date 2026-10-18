import httpx

from app.core.config import get_settings

TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


class TurnstileRepository:
    """
    Cloudflare Turnstileのトークン検証APIへのアクセスのみを担うリポジトリ層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self) -> None:
        """
        設定からシークレットキーを読み込んでリポジトリを初期化する。

        Params:
            -

        Returns:
            -
        """
        self.secret_key = get_settings().turnstile_secret_key

    @property
    def enabled(self) -> bool:
        """
        シークレットキーが設定され、検証が有効かどうか。
        本番のSecrets Managerの初期値 "disabled" は未設定として扱う。

        Params:
            -

        Returns:
            - bool: 検証が有効ならTrue
        """
        return self.secret_key not in ("", "disabled")

    def verify(self, token: str, remote_ip: str | None) -> bool:
        """
        Turnstileのトークンを検証する。

        Params:
            - token (str): フロントエンドのウィジェットが発行したトークン
            - remote_ip (str | None): 送信者のIPアドレス

        Returns:
            - bool: トークンが有効ならTrue

        Raises:
            - httpx.HTTPError: 検証APIへの通信に失敗した場合
        """
        data = {"secret": self.secret_key, "response": token}
        if remote_ip:
            data["remoteip"] = remote_ip
        response = httpx.post(TURNSTILE_VERIFY_URL, data=data, timeout=10.0)
        response.raise_for_status()
        return bool(response.json().get("success"))
