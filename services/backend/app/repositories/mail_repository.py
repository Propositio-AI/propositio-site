from email.utils import formataddr
from functools import lru_cache
import logging
from typing import Any, Protocol

import boto3

from app.core.config import get_settings
from app.schemas.mail import MailMessage

logger = logging.getLogger(__name__)


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


class SesMailRepository:
    """
    Amazon SES（v2 API）でメールを送信する実装。
    認証情報はboto3の標準の認証チェーン（ECSではタスクロール）から取得する。

    Params:
        - sender (str): 送信元（表示名付き。例: "Propositio AI <noreply@example.com>"）
        - region (str): SESのリージョン
        - configuration_set (str): SESの設定セット名。空なら指定しない
        - client (Any | None): テスト用に差し替えるSESクライアント。Noneならboto3で生成する

    Returns:
        -
    """

    def __init__(
        self,
        sender: str,
        region: str,
        configuration_set: str = "",
        client: Any | None = None,
    ) -> None:
        """
        送信元と設定セットを保持し、SESクライアントを組み立てる。

        Params:
            - sender (str): 送信元（表示名付き）
            - region (str): SESのリージョン
            - configuration_set (str): SESの設定セット名。空なら指定しない
            - client (Any | None): テスト用に差し替えるSESクライアント

        Returns:
            -
        """
        self.sender = sender
        self.configuration_set = configuration_set
        self.client = client or boto3.client("sesv2", region_name=region)

    def send(self, message: MailMessage) -> None:
        """
        プレーンテキストのメールをSESで送信する。

        Params:
            - message (MailMessage): 送信するメール

        Returns:
            -

        Raises:
            - botocore.exceptions.ClientError: SESがエラーを返した場合（未認証の宛先・送信上限など）
        """
        params: dict[str, Any] = {
            "FromEmailAddress": self.sender,
            "Destination": {"ToAddresses": [message.to]},
            "Content": {
                "Simple": {
                    "Subject": {"Data": message.subject, "Charset": "UTF-8"},
                    "Body": {"Text": {"Data": message.body, "Charset": "UTF-8"}},
                }
            },
        }
        if message.reply_to:
            params["ReplyToAddresses"] = [message.reply_to]
        if self.configuration_set:
            params["ConfigurationSetName"] = self.configuration_set
        self.client.send_email(**params)


@lru_cache
def get_mail_repository() -> MailRepository:
    """
    設定（MAIL_BACKEND）に応じたメール送信の実装を返す。クライアントを使い回すためキャッシュする。

    Params:
        -

    Returns:
        - MailRepository: メール送信の実装
    """
    settings = get_settings()
    if settings.mail_backend == "ses":
        return SesMailRepository(
            sender=formataddr((settings.mail_from_name, settings.mail_from)),
            region=settings.aws_region,
            configuration_set=settings.ses_configuration_set,
        )
    return ConsoleMailRepository()
