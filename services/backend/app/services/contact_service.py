from datetime import UTC, datetime, timedelta
import logging

import httpx
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.contact import Contact, InquiryType
from app.repositories.contact_repository import ContactRepository
from app.repositories.mail_repository import MailRepository, get_mail_repository
from app.repositories.turnstile_repository import TurnstileRepository
from app.schemas.contact import ContactCreate
from app.schemas.mail import MailMessage

logger = logging.getLogger(__name__)

# 同一メールアドレスから短時間に受け付ける上限件数と、その集計期間
SUBMISSION_LIMIT = 5
SUBMISSION_WINDOW = timedelta(hours=1)

# お問い合わせ種別の表示名（フォームの選択肢・メール本文と一致させる）
INQUIRY_TYPE_LABELS: dict[InquiryType, str] = {
    InquiryType.PARTNERSHIP: "連携・協力のご相談",
    InquiryType.PARTICIPATION: "検証への参加",
    InquiryType.MEDIA: "取材",
    InquiryType.OTHER: "その他",
}


class ContactRateLimitError(Exception):
    """
    同一メールアドレスからの送信が短時間に集中した場合に送出される例外。

    Params:
        -

    Returns:
        -
    """


class ContactVerificationError(Exception):
    """
    ボット対策（Turnstile）の検証に失敗した場合に送出される例外。

    Params:
        -

    Returns:
        -
    """


class ContactService:
    """
    お問い合わせに関する業務ロジックを担うサービス層。
    受付内容をDBに保存し、運営への通知メールと送信者への自動返信メールを送る。

    Params:
        -

    Returns:
        -
    """

    def __init__(
        self,
        db: Session,
        mail_repository: MailRepository | None = None,
        turnstile_repository: TurnstileRepository | None = None,
    ) -> None:
        """
        DBセッションと外部連携のリポジトリを組み立ててサービスを初期化する。

        Params:
            - db (Session): SQLAlchemyセッション
            - mail_repository (MailRepository | None): メール送信の実装。Noneなら設定から選ぶ
            - turnstile_repository (TurnstileRepository | None): Turnstile検証。Noneなら既定の実装

        Returns:
            -
        """
        self.repository = ContactRepository(db)
        self.mail_repository = mail_repository or get_mail_repository()
        self.turnstile_repository = turnstile_repository or TurnstileRepository()

    def submit_contact(self, payload: ContactCreate, remote_ip: str | None = None) -> Contact:
        """
        お問い合わせを受け付けて保存し、通知メール・自動返信メールを送る。
        ボット判定に失敗した送信や、同一メールアドレスからの短時間の連続送信は受け付けない。
        メール送信に失敗しても受付内容はDBに残るため、エラーはログに記録して受付自体は成功とする。

        Params:
            - payload (ContactCreate): 受け付けるお問い合わせの内容
            - remote_ip (str | None): 送信者のIPアドレス（Turnstileの検証に使う）

        Returns:
            - Contact: 保存されたお問い合わせ

        Raises:
            - ContactVerificationError: Turnstileの検証が有効で、トークンが無い・無効な場合
            - ContactRateLimitError: 集計期間内の送信件数が上限を超えている場合
        """
        self._verify_human(payload.turnstile_token, remote_ip)

        since = datetime.now(UTC) - SUBMISSION_WINDOW
        recent_count = self.repository.count_by_email_since(payload.email, since)
        if recent_count >= SUBMISSION_LIMIT:
            raise ContactRateLimitError(
                "短時間に多くのお問い合わせが送信されています。しばらく時間をおいてお試しください。"
            )

        contact = Contact(
            inquiry_type=payload.inquiry_type,
            name=payload.name.strip(),
            name_kana=payload.name_kana.strip(),
            organization=(payload.organization or "").strip() or None,
            email=payload.email,
            message=payload.message.strip(),
        )
        saved = self.repository.create(contact)
        self._send_mails(saved)
        return saved

    def _verify_human(self, token: str | None, remote_ip: str | None) -> None:
        """
        Turnstileの検証が有効な場合、トークンを検証する。通信エラー時も受け付けない（fail closed）。

        Params:
            - token (str | None): Turnstileのトークン
            - remote_ip (str | None): 送信者のIPアドレス

        Returns:
            -

        Raises:
            - ContactVerificationError: トークンが無い・無効、または検証できなかった場合
        """
        if not self.turnstile_repository.enabled:
            return
        message = "送信元の確認に失敗しました。ページを再読み込みしてお試しください。"
        if not token:
            raise ContactVerificationError(message)
        try:
            ok = self.turnstile_repository.verify(token, remote_ip)
        except httpx.HTTPError as exc:
            raise ContactVerificationError(message) from exc
        if not ok:
            raise ContactVerificationError(message)

    def _send_mails(self, contact: Contact) -> None:
        """
        運営への通知メールと、送信者への自動返信メールを送る。失敗はログに記録するだけで送出しない。

        Params:
            - contact (Contact): 保存済みのお問い合わせ

        Returns:
            -
        """
        settings = get_settings()
        notify_to = settings.contact_notify_to
        # 自動返信に送信者が返信したときは、運営の受信箱へ届くようにする
        mails = [build_auto_reply_mail(contact, settings.mail_reply_to or notify_to or None)]
        if notify_to:
            mails.insert(0, build_notify_mail(contact, notify_to))
        for mail in mails:
            try:
                self.mail_repository.send(mail)
            except Exception:
                logger.exception("Failed to send contact mail (contact_id=%s)", contact.id)


def build_notify_mail(contact: Contact, notify_to: str) -> MailMessage:
    """
    運営宛ての通知メールを組み立てる。Reply-Toを送信者にし、そのまま返信できるようにする。

    Params:
        - contact (Contact): 保存済みのお問い合わせ
        - notify_to (str): 通知先のメールアドレス

    Returns:
        - MailMessage: 通知メール
    """
    label = INQUIRY_TYPE_LABELS[contact.inquiry_type]
    body = "\n".join(
        [
            "Webサイトのお問い合わせフォームから送信がありました。",
            "このメールに返信すると、送信者へ直接返信できます。",
            "",
            f"お問い合わせ種別: {label}",
            f"お名前: {contact.name}（{contact.name_kana}）",
            f"所属: {contact.organization or '—'}",
            f"メールアドレス: {contact.email}",
            "",
            "お問い合わせ内容:",
            contact.message,
            "",
            "----",
            f"受付ID: {contact.id}",
        ]
    )
    return MailMessage(
        to=notify_to,
        subject=f"【お問い合わせ】{label} - {contact.name} 様",
        body=body,
        reply_to=contact.email,
    )


def build_auto_reply_mail(contact: Contact, reply_to: str | None = None) -> MailMessage:
    """
    送信者宛ての自動返信メールを組み立てる。
    第三者のアドレスへの迷惑メール送信に悪用されないよう、お問い合わせ本文は含めない。

    Params:
        - contact (Contact): 保存済みのお問い合わせ
        - reply_to (str | None): 送信者が返信したときの宛先（運営のアドレス）。Noneなら指定しない

    Returns:
        - MailMessage: 自動返信メール
    """
    body = "\n".join(
        [
            f"{contact.name} 様",
            "",
            "Propositio AI へのお問い合わせありがとうございます。",
            f"「{INQUIRY_TYPE_LABELS[contact.inquiry_type]}」について、お問い合わせを受け付けました。",
            "内容を確認のうえ、担当者よりご連絡いたします。",
            "",
            "※このメールは自動返信です。ご返信いただいた内容は担当者に届きます。",
            "※お心当たりのない場合は、お手数ですが本メールを破棄してください。",
            "",
            "----",
            "Propositio AI / Karynos",
        ]
    )
    return MailMessage(
        to=contact.email,
        subject="【Propositio AI】お問い合わせを受け付けました",
        body=body,
        reply_to=reply_to,
    )
