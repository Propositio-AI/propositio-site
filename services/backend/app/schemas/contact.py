from datetime import datetime
from typing import Literal
import uuid

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.contact import ContactStatus, InquiryType

# 改行を含まない1行の文字列（メールの件名・ヘッダーに使うため改行を許可しない）
SINGLE_LINE_PATTERN = r"^[^\r\n]+$"
# 全角カタカナ・長音・空白のみ
KATAKANA_PATTERN = r"^[ァ-ヶー\s　]+$"


class ContactCreate(BaseModel):
    """
    お問い合わせ送信リクエストの型定義。

    Params:
        -

    Returns:
        -
    """

    inquiry_type: InquiryType
    name: str = Field(min_length=1, max_length=100, pattern=SINGLE_LINE_PATTERN)
    name_kana: str = Field(min_length=1, max_length=100, pattern=KATAKANA_PATTERN)
    organization: str | None = Field(default=None, max_length=200, pattern=SINGLE_LINE_PATTERN)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)
    # プライバシーポリシーへの同意。trueのみ受け付ける
    agreed_to_privacy: Literal[True]
    # Cloudflare Turnstileのトークン（バックエンドで検証が有効な場合のみ必須）
    turnstile_token: str | None = Field(default=None, max_length=2048)


class ContactResponse(BaseModel):
    """
    受け付けたお問い合わせを表すレスポンスの型定義。

    Params:
        -

    Returns:
        -
    """

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    name_kana: str
    email: EmailStr
    organization: str | None
    inquiry_type: InquiryType
    message: str
    status: ContactStatus
    created_at: datetime
