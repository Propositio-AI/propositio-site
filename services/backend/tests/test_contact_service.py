import pytest
from sqlalchemy.orm import Session

from app.models.contact import ContactStatus, InquiryType
from app.schemas.contact import ContactCreate
from app.services.contact_service import (
    SUBMISSION_LIMIT,
    ContactRateLimitError,
    ContactService,
    ContactVerificationError,
)
from tests.fakes import FakeMailRepository, FakeTurnstileRepository


def build_payload(email: str = "hanako@example.com", token: str | None = None) -> ContactCreate:
    """
    テスト用のお問い合わせ入力を組み立てる。

    Params:
        - email (str): 送信者のメールアドレス
        - token (str | None): Turnstileのトークン

    Returns:
        - ContactCreate: お問い合わせ入力
    """
    return ContactCreate(
        inquiry_type=InquiryType.PARTNERSHIP,
        name="  山田 花子  ",
        name_kana=" ヤマダ ハナコ ",
        organization="  ",
        email=email,
        message="  連携についてご相談させてください。  ",
        agreed_to_privacy=True,
        turnstile_token=token,
    )


def build_service(
    db_session: Session,
    mail: FakeMailRepository | None = None,
    turnstile: FakeTurnstileRepository | None = None,
) -> ContactService:
    """
    外部連携をテスト用実装に差し替えたContactServiceを組み立てる。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション
        - mail (FakeMailRepository | None): メール送信の実装
        - turnstile (FakeTurnstileRepository | None): Turnstile検証の実装

    Returns:
        - ContactService: テスト対象のサービス
    """
    return ContactService(
        db_session,
        mail_repository=mail or FakeMailRepository(),
        turnstile_repository=turnstile or FakeTurnstileRepository(),
    )


def test_submit_contact_saves_trimmed_values(db_session: Session) -> None:
    """
    お問い合わせを受け付けると、前後の空白を除いた内容が保存され、空の所属はNoneになる。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        -
    """
    contact = build_service(db_session).submit_contact(build_payload())

    assert contact.name == "山田 花子"
    assert contact.name_kana == "ヤマダ ハナコ"
    assert contact.organization is None
    assert contact.message == "連携についてご相談させてください。"
    assert contact.status == ContactStatus.NEW


def test_submit_contact_sends_notify_and_auto_reply(
    db_session: Session, monkeypatch: pytest.MonkeyPatch
) -> None:
    """
    通知先が設定されていると、運営への通知（Reply-Toは送信者）と送信者への自動返信が送られる。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション
        - monkeypatch (pytest.MonkeyPatch): 設定の差し替えに使う

    Returns:
        -
    """
    monkeypatch.setattr(
        "app.services.contact_service.get_settings",
        lambda: type("S", (), {"contact_notify_to": "info@example.com"})(),
    )
    mail = FakeMailRepository()

    build_service(db_session, mail=mail).submit_contact(build_payload())

    assert [m.to for m in mail.sent] == ["info@example.com", "hanako@example.com"]
    notify, auto_reply = mail.sent
    assert notify.reply_to == "hanako@example.com"
    assert "連携・協力のご相談" in notify.subject
    assert "連携についてご相談させてください。" in notify.body
    # 自動返信には本文を含めない（第三者宛ての迷惑メールに悪用されないため）
    assert "連携についてご相談させてください。" not in auto_reply.body


def test_submit_contact_succeeds_even_if_mail_fails(db_session: Session) -> None:
    """
    メール送信に失敗しても、お問い合わせはDBに保存され受付は成功する。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        -
    """
    service = build_service(db_session, mail=FakeMailRepository(fail=True))

    contact = service.submit_contact(build_payload())

    assert contact.id is not None


def test_submit_contact_rejects_burst_from_same_email(db_session: Session) -> None:
    """
    同一メールアドレスから上限を超えて送信された場合は受け付けない。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        -
    """
    service = build_service(db_session)
    for _ in range(SUBMISSION_LIMIT):
        service.submit_contact(build_payload())

    with pytest.raises(ContactRateLimitError):
        service.submit_contact(build_payload())


def test_submit_contact_allows_other_email_after_limit(db_session: Session) -> None:
    """
    上限に達したメールアドレスがあっても、別のアドレスからの送信は受け付ける。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        -
    """
    service = build_service(db_session)
    for _ in range(SUBMISSION_LIMIT):
        service.submit_contact(build_payload())

    contact = service.submit_contact(build_payload(email="other@example.com"))

    assert contact.email == "other@example.com"


@pytest.mark.parametrize(
    ("token", "result"),
    [(None, True), ("invalid-token", False)],
)
def test_submit_contact_rejects_failed_verification(
    db_session: Session, token: str | None, result: bool
) -> None:
    """
    Turnstileの検証が有効な場合、トークンが無い・無効な送信は受け付けない。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション
        - token (str | None): 送信するトークン
        - result (bool): 検証APIが返す結果

    Returns:
        -
    """
    service = build_service(
        db_session, turnstile=FakeTurnstileRepository(enabled=True, result=result)
    )

    with pytest.raises(ContactVerificationError):
        service.submit_contact(build_payload(token=token))


def test_submit_contact_accepts_valid_verification(db_session: Session) -> None:
    """
    Turnstileの検証が有効で、トークンが有効なら受け付ける。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        -
    """
    service = build_service(
        db_session, turnstile=FakeTurnstileRepository(enabled=True, result=True)
    )

    contact = service.submit_contact(build_payload(token="valid-token"))

    assert contact.id is not None
