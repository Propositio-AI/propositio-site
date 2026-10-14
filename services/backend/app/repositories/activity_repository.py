from typing import Any

import httpx

from app.core.config import get_settings


class ActivityRepository:
    """
    microCMSの「activities」「categories」APIへの読み取りアクセスのみを担うリポジトリ層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self) -> None:
        """
        設定からmicroCMS向けのHTTPクライアントを組み立ててリポジトリを初期化する。

        Params:
            -

        Returns:
            -
        """
        settings = get_settings()
        self.client = httpx.Client(
            base_url=f"https://{settings.microcms_service_domain}.microcms.io/api/v1",
            headers={"X-MICROCMS-API-KEY": settings.microcms_api_key},
            timeout=10.0,
        )

    def list_activities(
        self,
        limit: int,
        offset: int = 0,
        filters: str | None = None,
        orders: str = "-publishedAt",
        fields: str | None = None,
    ) -> dict[str, Any]:
        """
        活動記録の一覧をmicroCMSから取得する。

        Params:
            - limit (int): 取得件数
            - offset (int): 取得開始位置
            - filters (str | None): microCMSのfiltersクエリ
            - orders (str): microCMSのordersクエリ
            - fields (str | None): 取得するフィールド（カンマ区切り）

        Returns:
            - dict[str, Any]: microCMSのレスポンス（contents, totalCount等）
        """
        params: dict[str, str | int] = {"limit": limit, "offset": offset, "orders": orders}
        if filters:
            params["filters"] = filters
        if fields:
            params["fields"] = fields
        response = self.client.get("/activities", params=params)
        response.raise_for_status()
        return response.json()

    def get_activity_by_id(self, content_id: str) -> dict[str, Any] | None:
        """
        IDを指定して活動記録を1件取得する。

        Params:
            - content_id (str): microCMS上のコンテンツID

        Returns:
            - dict[str, Any] | None: 記事データ。存在しない場合はNone
        """
        response = self.client.get(f"/activities/{content_id}")
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.json()

    def list_categories(self) -> dict[str, Any]:
        """
        カテゴリの一覧をmicroCMSの管理画面の並び順で取得する。

        Params:
            -

        Returns:
            - dict[str, Any]: microCMSのレスポンス（contents, totalCount等）
        """
        response = self.client.get("/categories", params={"limit": 100})
        response.raise_for_status()
        return response.json()
