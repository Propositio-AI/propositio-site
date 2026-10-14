from pydantic import BaseModel, EmailStr


class MailMessage(BaseModel):
    """
    送信するメール1通の型定義（プレーンテキスト）。

    Params:
        -

    Returns:
        -
    """

    to: EmailStr
    subject: str
    body: str
    reply_to: EmailStr | None = None
