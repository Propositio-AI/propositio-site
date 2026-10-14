from typing import Any

import pytest

from app.services.activity_service import ActivityNotFoundError, ActivityService

RAW_ACTIVITY = {
    "id": "sample-07",
    "title": "問いかけ手順の試作 v0.1",
    "description": "思いを一つずつ確かめるための、問いかけの順番を試作しました。",
    "category": {"id": "development", "name": "開発"},
    "thumbnail": {"url": "https://images.microcms-assets.io/x.png", "width": 1600, "height": 1000},
    "content": '<p>本文</p><script>alert(1)</script><img src="x" onerror="alert(1)">',
    "publishedAt": "2026-09-18T09:00:00.000Z",
}


class FakeActivityRepository:
    """
    microCMSへ接続せず、受け取ったクエリを記録して固定データを返すテスト用リポジトリ。

    Params:
        -

    Returns:
        -
    """

    def __init__(self) -> None:
        """
        呼び出し記録を初期化する。

        Params:
            -

        Returns:
            -
        """
        self.list_calls: list[dict[str, Any]] = []

    def list_activities(
        self,
        limit: int,
        offset: int = 0,
        filters: str | None = None,
        orders: str = "-publishedAt",
        fields: str | None = None,
    ) -> dict[str, Any]:
        """
        クエリを記録し、前後記事の検索では「新しい記事のみ存在する」状態を返す。

        Params:
            - limit (int): 取得件数
            - offset (int): 取得開始位置
            - filters (str | None): microCMSのfiltersクエリ
            - orders (str): microCMSのordersクエリ
            - fields (str | None): 取得するフィールド

        Returns:
            - dict[str, Any]: microCMS形式のレスポンス
        """
        self.list_calls.append({"limit": limit, "offset": offset, "filters": filters})
        if filters and "greater_than" in filters:
            return {"contents": [{"id": "sample-08", "title": "新しい記事"}], "totalCount": 1}
        if filters and "less_than" in filters:
            return {"contents": [], "totalCount": 0}
        return {"contents": [RAW_ACTIVITY], "totalCount": 8}

    def get_activity_by_id(self, content_id: str) -> dict[str, Any] | None:
        """
        sample-07のみ存在するものとして返す。

        Params:
            - content_id (str): コンテンツID

        Returns:
            - dict[str, Any] | None: 記事データ。存在しない場合はNone
        """
        return RAW_ACTIVITY if content_id == "sample-07" else None

    def list_categories(self) -> dict[str, Any]:
        """
        固定のカテゴリ一覧を返す。

        Params:
            -

        Returns:
            - dict[str, Any]: microCMS形式のレスポンス
        """
        return {"contents": [{"id": "research", "name": "調査"}], "totalCount": 1}


@pytest.fixture
def service() -> ActivityService:
    """
    リポジトリをテスト用実装に差し替えたActivityService。

    Params:
        -

    Returns:
        - ActivityService: テスト対象のサービス
    """
    instance = ActivityService.__new__(ActivityService)
    instance.repository = FakeActivityRepository()
    return instance


def test_list_activities_filters_by_category(service: ActivityService) -> None:
    """
    カテゴリを指定すると、microCMSのfiltersで絞り込む。

    Params:
        - service (ActivityService): テスト対象のサービス

    Returns:
        -
    """
    result = service.list_activities(6, 0, "development")

    assert result.total_count == 8
    assert result.contents[0].category is not None
    assert result.contents[0].category.name == "開発"
    assert service.repository.list_calls[0]["filters"] == "category[equals]development"


def test_get_activity_sanitizes_content_and_finds_neighbors(service: ActivityService) -> None:
    """
    記事詳細は本文のスクリプトを除去し、前後の記事（存在するもののみ）を返す。

    Params:
        - service (ActivityService): テスト対象のサービス

    Returns:
        -
    """
    detail = service.get_activity("sample-07")

    assert "<script>" not in detail.content
    assert "onerror" not in detail.content
    assert "<p>本文</p>" in detail.content
    assert detail.newer is not None
    assert detail.newer.id == "sample-08"
    assert detail.older is None


def test_get_activity_raises_when_missing(service: ActivityService) -> None:
    """
    存在しない記事を指定するとActivityNotFoundErrorを送出する。

    Params:
        - service (ActivityService): テスト対象のサービス

    Returns:
        -
    """
    with pytest.raises(ActivityNotFoundError):
        service.get_activity("missing")
