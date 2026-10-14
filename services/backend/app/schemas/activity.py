from datetime import datetime

from pydantic import BaseModel


class CategoryResponse(BaseModel):
    """
    活動記録のカテゴリ（microCMSの「categories」API）の型定義。

    Params:
        -

    Returns:
        -
    """

    id: str
    name: str


class ThumbnailResponse(BaseModel):
    """
    活動記録のサムネイル画像の型定義。

    Params:
        -

    Returns:
        -
    """

    url: str
    width: int | None = None
    height: int | None = None


class ActivitySummary(BaseModel):
    """
    活動記録の一覧に表示する要約情報の型定義。

    Params:
        -

    Returns:
        -
    """

    id: str
    title: str
    description: str
    category: CategoryResponse | None
    thumbnail: ThumbnailResponse | None
    published_at: datetime


class ActivityNeighbor(BaseModel):
    """
    記事詳細から前後の記事へリンクするための最小限の情報の型定義。

    Params:
        -

    Returns:
        -
    """

    id: str
    title: str


class ActivityDetail(ActivitySummary):
    """
    活動記録1件の詳細情報の型定義。本文（サニタイズ済みHTML）と前後の記事を含む。

    Params:
        -

    Returns:
        -
    """

    content: str
    newer: ActivityNeighbor | None
    older: ActivityNeighbor | None


class ActivityListResponse(BaseModel):
    """
    活動記録一覧のレスポンスの型定義。

    Params:
        -

    Returns:
        -
    """

    contents: list[ActivitySummary]
    total_count: int
