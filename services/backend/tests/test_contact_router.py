from collections.abc import Generator

from fastapi.testclient import TestClient
import pytest
from sqlalchemy.orm import Session

from app.main import app
from app.routers.contact import get_contact_service
from app.services.contact_service import ContactService
from tests.fakes import FakeMailRepository, FakeTurnstileRepository

VALID_PAYLOAD = {
    "inquiry_type": "participation",
    "name": "山田 花子",
    "name_kana": "ヤマダ ハナコ",
    "organization": "○○大学",
    "email": "hanako@example.com",
    "message": "検証に参加してみたいです。",
    "agreed_to_privacy": True,
}


@pytest.fixture
def contact_client(client: TestClient, db_session: Session) -> Generator[TestClient, None, None]:
    """
    外部連携（メール・Turnstile）をテスト用実装に差し替えたテストクライアント。

    Params:
        - client (TestClient): DBを差し替え済みのテストクライアント
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        - Generator[TestClient, None, None]: テスト用HTTPクライアント
    """
    app.dependency_overrides[get_contact_service] = lambda: ContactService(
        db_session,
        mail_repository=FakeMailRepository(),
        turnstile_repository=FakeTurnstileRepository(),
    )
    yield client


def test_submit_contact_returns_created(contact_client: TestClient) -> None:
    """
    正しい内容を送信すると201と受付内容が返る。

    Params:
        - contact_client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    response = contact_client.post("/contacts", json=VALID_PAYLOAD)

    assert response.status_code == 201
    body = response.json()
    assert body["inquiry_type"] == "participation"
    assert body["name_kana"] == "ヤマダ ハナコ"
    assert body["status"] == "new"


@pytest.mark.parametrize(
    "override",
    [
        {"email": "not-an-email"},
        {"name_kana": "やまだ はなこ"},
        {"name": "改行\nを含む名前"},
        {"message": ""},
        {"message": "あ" * 2001},
        {"inquiry_type": "unknown"},
        {"agreed_to_privacy": False},
    ],
)
def test_submit_contact_rejects_invalid_payload(
    contact_client: TestClient, override: dict[str, object]
) -> None:
    """
    不正な入力（メール形式・カナ・改行・文字数・種別・未同意）は422を返す。

    Params:
        - contact_client (TestClient): テスト用HTTPクライアント
        - override (dict[str, object]): 正しい入力に上書きする不正な値

    Returns:
        -
    """
    response = contact_client.post("/contacts", json={**VALID_PAYLOAD, **override})

    assert response.status_code == 422


def test_contacts_are_not_listable(contact_client: TestClient) -> None:
    """
    受け付けたお問い合わせ（個人情報）を一覧取得する公開APIは存在しない。

    Params:
        - contact_client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    response = contact_client.get("/contacts")

    assert response.status_code == 405
