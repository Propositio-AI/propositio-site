import base64
from email.message import EmailMessage
from email.utils import formataddr
from functools import lru_cache
import json
import logging
from typing import Protocol

from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

from app.core.config import get_settings
from app.schemas.mail import MailMessage

logger = logging.getLogger(__name__)

GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send"
GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
MAIL_FROM_NAME = "Propositio AI"


class MailRepository(Protocol):
    """
    メール送信の外部連携を抽象化するインターフェース。

    Params:
        -

    Returns:
        -
    """

    def send(self, message: MailMessage) -> None:
        """
        メールを1通送信する。

        Params:
            - message (MailMessage): 送信するメール

        Returns:
            -
        """
        ...


class ConsoleMailRepository:
    """
    メールを実際には送信せず、ログに出力するだけの開発用実装。

    Params:
        -

    Returns:
        -
    """

    def send(self, message: MailMessage) -> None:
        """
        メールの内容をログに出力する。

        Params:
            - message (MailMessage): 送信するメール

        Returns:
            -
        """
        logger.info(
            "[mail:console] to=%s reply_to=%s subject=%s\n%s",
            message.to,
            message.reply_to,
            message.subject,
            message.body,
        )


class GmailMailRepository:
    """
    Google WorkspaceのGmail APIでメールを送信する実装。
    ドメイン全体の委任を設定したサービスアカウントが、送信元ユーザーとして送信する。

    Params:
        - sender (str): 送信元のWorkspaceユーザーのメールアドレス
        - service_account_info (dict): サービスアカウント鍵（JSONをパースしたもの）

    Returns:
        -
    """

    def __init__(self, sender: str, service_account_info: dict) -> None:
        """
        サービスアカウントの認証情報から、Gmail API用の認証済みセッションを組み立てる。

        Params:
            - sender (str): 送信元のWorkspaceユーザーのメールアドレス
            - service_account_info (dict): サービスアカウント鍵（JSONをパースしたもの）

        Returns:
            -
        """
        self.sender = sender
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info, scopes=[GMAIL_SEND_SCOPE], subject=sender
        )
        self.session = AuthorizedSession(credentials)

    def send(self, message: MailMessage) -> None:
        """
        メールをMIME形式に組み立て、Gmail APIで送信する。

        Params:
            - message (MailMessage): 送信するメール

        Returns:
            -

        Raises:
            - requests.HTTPError: Gmail APIがエラーを返した場合
        """
        mime = EmailMessage()
        mime["From"] = formataddr((MAIL_FROM_NAME, self.sender))
        mime["To"] = message.to
        mime["Subject"] = message.subject
        if message.reply_to:
            mime["Reply-To"] = message.reply_to
        mime.set_content(message.body)

        raw = base64.urlsafe_b64encode(mime.as_bytes()).decode("ascii")
        response = self.session.post(GMAIL_SEND_URL, json={"raw": raw}, timeout=15)
        response.raise_for_status()


@lru_cache
def get_mail_repository() -> MailRepository:
    """
    設定（MAIL_BACKEND）に応じたメール送信の実装を返す。
    認証済みセッション（アクセストークン）を使い回すため、インスタンスはキャッシュする。

    Params:
        -

    Returns:
        - MailRepository: メール送信の実装
    """
    settings = get_settings()
    if settings.mail_backend == "gmail":
        return GmailMailRepository(
            sender=settings.gmail_sender,
            service_account_info=json.loads(settings.gmail_service_account_json),
        )
    return ConsoleMailRepository()
