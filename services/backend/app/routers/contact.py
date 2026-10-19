from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.contact_service import (
    ContactRateLimitError,
    ContactService,
    ContactVerificationError,
)

router = APIRouter(prefix="/contacts", tags=["contacts"])


def get_contact_service(db: Session = Depends(get_db)) -> ContactService:
    """
    リクエストスコープのDBセッションからContactServiceを組み立てるDI関数。

    Params:
        - db (Session): SQLAlchemyセッション

    Returns:
        - ContactService: お問い合わせサービスのインスタンス
    """
    return ContactService(db)


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(
    payload: ContactCreate,
    request: Request,
    service: ContactService = Depends(get_contact_service),
) -> ContactResponse:
    """
    お問い合わせを受け付けるエンドポイント。
    受付内容の一覧は公開APIでは提供しない（運営は通知メールで確認する）。

    Params:
        - payload (ContactCreate): 受け付けるお問い合わせの内容
        - request (Request): 送信者のIPアドレスの取得に使うリクエスト
        - service (ContactService): お問い合わせサービス

    Returns:
        - ContactResponse: 受け付けたお問い合わせ
    """
    remote_ip = request.client.host if request.client else None
    try:
        return service.submit_contact(payload, remote_ip)
    except ContactVerificationError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    except ContactRateLimitError as exc:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, str(exc)) from exc
