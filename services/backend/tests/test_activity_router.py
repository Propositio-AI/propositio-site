from collections.abc import Generator
from datetime import UTC, datetime

from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.routers.activity import get_activity_service
from app.schemas.activity import (
    ActivityDetail,
    ActivityListResponse,
    ActivitySummary,
    CategoryResponse,
)
from app.services.activity_service import ActivityNotFoundError

SAMPLE_SUMMARY = ActivitySummary(
    id="sample-01",
    title="Karynosを始めました",
    description="プロジェクトを始めた理由と、これから取り組むことについて。",
    category=CategoryResponse(id="news", name="お知らせ"),
    thumbnail=None,
    published_at=datetime(2026, 6, 1, 9, tzinfo=UTC),
)


class FakeActivityService:
    """
    microCMSへ接続せずルーターを検証するためのスタブサービス。

    Params:
        -

    Returns:
        -
    """

    def list_activities(
        self, limit: int, offset: int, category_id: str | None = None
    ) -> ActivityListResponse:
        """
        固定の記事一覧を返す。

        Params:
            - limit (int): 取得件数
            - offset (int): 取得開始位置
            - category_id (str | None): カテゴリID

        Returns:
            - ActivityListResponse: 固定の記事一覧
        """
        return ActivityListResponse(contents=[SAMPLE_SUMMARY], total_count=1)

    def get_activity(self, content_id: str) -> ActivityDetail:
        """
        固定の記事1件、または存在しない場合は例外を返す。

        Params:
            - content_id (str): コンテンツID

        Returns:
            - ActivityDetail: 固定の記事詳細

        Raises:
            - ActivityNotFoundError: content_idが"missing"の場合
        """
        if content_id == "missing":
            raise ActivityNotFoundError("Activity missing not found")
        return ActivityDetail(
            **SAMPLE_SUMMARY.model_dump(), content="<p>本文</p>", newer=None, older=None
        )

    def list_categories(self) -> list[CategoryResponse]:
        """
        固定のカテゴリ一覧を返す。

        Params:
            -

        Returns:
            - list[CategoryResponse]: 固定のカテゴリ一覧
        """
        return [CategoryResponse(id="news", name="お知らせ")]


@pytest.fixture
def activity_client() -> Generator[TestClient, None, None]:
    """
    ActivityServiceをスタブに差し替えたテストクライアント。

    Params:
        -

    Returns:
        - Generator[TestClient, None, None]: テスト用HTTPクライアント
    """
    app.dependency_overrides[get_activity_service] = FakeActivityService
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def test_list_activities_returns_contents(activity_client: TestClient) -> None:
    """
    一覧APIは記事とtotal_countを返す。

    Params:
        - activity_client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    response = activity_client.get("/activities", params={"category": "news"})

    assert response.status_code == 200
    body = response.json()
    assert body["total_count"] == 1
    assert body["contents"][0]["category"]["name"] == "お知らせ"


def test_list_activities_rejects_unsafe_category(activity_client: TestClient) -> None:
    """
    filtersクエリに混入しうる文字を含むカテゴリIDは422を返す。

    Params:
        - activity_client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    response = activity_client.get("/activities", params={"category": "news[or]x"})

    assert response.status_code == 422


def test_get_activity_returns_404_when_missing(activity_client: TestClient) -> None:
    """
    存在しない記事は404を返す。

    Params:
        - activity_client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    assert activity_client.get("/activities/missing").status_code == 404
    assert activity_client.get("/activities/sample-01").status_code == 200


def test_list_categories(activity_client: TestClient) -> None:
    """
    カテゴリ一覧APIはカテゴリの配列を返す。

    Params:
        - activity_client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    response = activity_client.get("/categories")

    assert response.json() == [{"id": "news", "name": "お知らせ"}]
