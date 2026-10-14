from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
import httpx

from app.schemas.activity import ActivityDetail, ActivityListResponse, CategoryResponse
from app.services.activity_service import ActivityNotFoundError, ActivityService

router = APIRouter(tags=["activities"])

# microCMSのコンテンツIDとして受け付ける文字（filtersクエリやURLパスへの混入を防ぐ）
CONTENT_ID_PATTERN = r"^[A-Za-z0-9_-]+$"


def get_activity_service() -> ActivityService:
    """
    ActivityServiceを組み立てるDI関数。

    Params:
        -

    Returns:
        - ActivityService: 活動記録サービスのインスタンス
    """
    return ActivityService()


@router.get("/activities", response_model=ActivityListResponse)
def list_activities(
    limit: int = Query(default=6, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    category: str | None = Query(default=None, pattern=CONTENT_ID_PATTERN),
    service: ActivityService = Depends(get_activity_service),
) -> ActivityListResponse:
    """
    活動記録の一覧を取得するエンドポイント。

    Params:
        - limit (int): 取得件数
        - offset (int): 取得開始位置
        - category (str | None): 絞り込むカテゴリのID
        - service (ActivityService): 活動記録サービス

    Returns:
        - ActivityListResponse: 活動記録一覧
    """
    try:
        return service.list_activities(limit, offset, category)
    except httpx.HTTPError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "活動記録の取得に失敗しました。") from exc


@router.get("/activities/{content_id}", response_model=ActivityDetail)
def get_activity(
    content_id: str = Path(pattern=CONTENT_ID_PATTERN),
    service: ActivityService = Depends(get_activity_service),
) -> ActivityDetail:
    """
    IDを指定して活動記録を1件取得するエンドポイント。

    Params:
        - content_id (str): microCMS上のコンテンツID
        - service (ActivityService): 活動記録サービス

    Returns:
        - ActivityDetail: 該当記事
    """
    try:
        return service.get_activity(content_id)
    except ActivityNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "活動記録の取得に失敗しました。") from exc


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(
    service: ActivityService = Depends(get_activity_service),
) -> list[CategoryResponse]:
    """
    活動記録のカテゴリ一覧を取得するエンドポイント。

    Params:
        - service (ActivityService): 活動記録サービス

    Returns:
        - list[CategoryResponse]: カテゴリ一覧
    """
    try:
        return service.list_categories()
    except httpx.HTTPError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "カテゴリの取得に失敗しました。") from exc
