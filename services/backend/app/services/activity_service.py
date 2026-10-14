from typing import Any

import nh3

from app.repositories.activity_repository import ActivityRepository
from app.schemas.activity import (
    ActivityDetail,
    ActivityListResponse,
    ActivityNeighbor,
    ActivitySummary,
    CategoryResponse,
    ThumbnailResponse,
)


class ActivityNotFoundError(Exception):
    """
    指定した活動記録が存在しない場合に送出される例外。

    Params:
        -

    Returns:
        -
    """


def _to_summary(raw: dict[str, Any]) -> ActivitySummary:
    """
    microCMSの生データを活動記録の要約の型へ変換する。

    Params:
        - raw (dict[str, Any]): microCMSから取得した1件分の生データ

    Returns:
        - ActivitySummary: 変換後の要約
    """
    category = raw.get("category")
    thumbnail = raw.get("thumbnail")
    return ActivitySummary(
        id=raw["id"],
        title=raw.get("title", ""),
        description=raw.get("description") or "",
        category=CategoryResponse(id=category["id"], name=category.get("name", ""))
        if category
        else None,
        thumbnail=ThumbnailResponse(**thumbnail) if thumbnail and thumbnail.get("url") else None,
        published_at=raw["publishedAt"],
    )


class ActivityService:
    """
    活動記録の取得に関する業務ロジックを担うサービス層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self) -> None:
        """
        ActivityRepositoryを組み立ててサービスを初期化する。

        Params:
            -

        Returns:
            -
        """
        self.repository = ActivityRepository()

    def list_activities(
        self, limit: int, offset: int, category_id: str | None = None
    ) -> ActivityListResponse:
        """
        活動記録の一覧を公開日時の新しい順で取得する。カテゴリを指定した場合はそのカテゴリのみに絞る。

        Params:
            - limit (int): 取得件数
            - offset (int): 取得開始位置
            - category_id (str | None): 絞り込むカテゴリのID。Noneの場合は全件

        Returns:
            - ActivityListResponse: 活動記録一覧と総件数
        """
        filters = f"category[equals]{category_id}" if category_id else None
        raw = self.repository.list_activities(limit, offset, filters=filters)
        contents = [_to_summary(item) for item in raw["contents"]]
        return ActivityListResponse(contents=contents, total_count=raw["totalCount"])

    def get_activity(self, content_id: str) -> ActivityDetail:
        """
        IDを指定して活動記録を1件取得する。本文はサニタイズし、前後（新しい・古い）の記事も合わせて返す。

        Params:
            - content_id (str): microCMS上のコンテンツID

        Returns:
            - ActivityDetail: 該当記事

        Raises:
            - ActivityNotFoundError: 記事が存在しない場合
        """
        raw = self.repository.get_activity_by_id(content_id)
        if raw is None:
            raise ActivityNotFoundError(f"Activity {content_id} not found")

        published_at = raw["publishedAt"]
        return ActivityDetail(
            **_to_summary(raw).model_dump(),
            content=nh3.clean(raw.get("content") or ""),
            newer=self._find_neighbor(f"publishedAt[greater_than]{published_at}", "publishedAt"),
            older=self._find_neighbor(f"publishedAt[less_than]{published_at}", "-publishedAt"),
        )

    def list_categories(self) -> list[CategoryResponse]:
        """
        カテゴリの一覧を取得する。

        Params:
            -

        Returns:
            - list[CategoryResponse]: カテゴリ一覧（microCMSの管理画面の並び順）
        """
        raw = self.repository.list_categories()
        return [
            CategoryResponse(id=item["id"], name=item.get("name", "")) for item in raw["contents"]
        ]

    def _find_neighbor(self, filters: str, orders: str) -> ActivityNeighbor | None:
        """
        条件に一致する記事のうち、並び順で先頭の1件を前後リンク用に取得する。

        Params:
            - filters (str): microCMSのfiltersクエリ
            - orders (str): microCMSのordersクエリ

        Returns:
            - ActivityNeighbor | None: 該当記事。存在しない場合はNone
        """
        raw = self.repository.list_activities(1, filters=filters, orders=orders, fields="id,title")
        if not raw["contents"]:
            return None
        item = raw["contents"][0]
        return ActivityNeighbor(id=item["id"], title=item.get("title", ""))
