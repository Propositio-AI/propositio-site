from datetime import datetime
import enum
import uuid

from sqlalchemy import DateTime, Enum, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class InquiryType(enum.StrEnum):
    """
    お問い合わせの種別。

    Params:
        -

    Returns:
        -
    """

    PARTNERSHIP = "partnership"
    PARTICIPATION = "participation"
    MEDIA = "media"
    OTHER = "other"


class ContactStatus(enum.StrEnum):
    """
    お問い合わせの対応状況。

    Params:
        -

    Returns:
        -
    """

    NEW = "new"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Contact(Base):
    """
    お問い合わせ1件を表すSQLAlchemyモデル。

    Params:
        -

    Returns:
        -
    """

    __tablename__ = "contacts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    name_kana: Mapped[str] = mapped_column(String(100), nullable=False, server_default="")
    email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    organization: Mapped[str | None] = mapped_column(String(200), nullable=True)
    inquiry_type: Mapped[InquiryType] = mapped_column(
        Enum(InquiryType, name="inquiry_type"), nullable=False
    )
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ContactStatus] = mapped_column(
        Enum(ContactStatus, name="contact_status"),
        nullable=False,
        default=ContactStatus.NEW,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
