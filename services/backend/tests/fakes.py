from app.schemas.mail import MailMessage


class FakeMailRepository:
    """
    送信したメールをリストに溜めるだけのテスト用メール送信実装。

    Params:
        - fail (bool): Trueの場合、送信時に例外を送出する

    Returns:
        -
    """

    def __init__(self, fail: bool = False) -> None:
        """
        送信済みメールの記録先を初期化する。

        Params:
            - fail (bool): Trueの場合、送信時に例外を送出する

        Returns:
            -
        """
        self.sent: list[MailMessage] = []
        self.fail = fail

    def send(self, message: MailMessage) -> None:
        """
        メールを記録する。failがTrueなら例外を送出する。

        Params:
            - message (MailMessage): 送信するメール

        Returns:
            -

        Raises:
            - RuntimeError: failがTrueの場合
        """
        if self.fail:
            raise RuntimeError("mail failure")
        self.sent.append(message)


class FakeTurnstileRepository:
    """
    検証結果を固定で返すテスト用Turnstile実装。

    Params:
        - enabled (bool): 検証が有効か
        - result (bool): verifyが返す結果

    Returns:
        -
    """

    def __init__(self, enabled: bool = False, result: bool = True) -> None:
        """
        検証の有効・無効と結果を設定する。

        Params:
            - enabled (bool): 検証が有効か
            - result (bool): verifyが返す結果

        Returns:
            -
        """
        self.enabled = enabled
        self.result = result

    def verify(self, token: str, remote_ip: str | None) -> bool:
        """
        固定の検証結果を返す。

        Params:
            - token (str): Turnstileのトークン
            - remote_ip (str | None): 送信者のIPアドレス

        Returns:
            - bool: 固定の検証結果
        """
        return self.result
