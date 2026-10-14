import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import TaskNotFoundError, TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_task_service(db: Session = Depends(get_db)) -> TaskService:
    """
    リクエストスコープのDBセッションからTaskServiceを組み立てるDI関数。

    Params:
        - db (Session): SQLAlchemyセッション

    Returns:
        - TaskService: タスクサービスのインスタンス
    """
    return TaskService(db)


@router.get("", response_model=list[TaskResponse])
def list_tasks(service: TaskService = Depends(get_task_service)) -> list[TaskResponse]:
    """
    タスク一覧を取得するエンドポイント。

    Params:
        - service (TaskService): タスクサービス

    Returns:
        - list[TaskResponse]: タスク一覧
    """
    return list(service.list_tasks())


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: uuid.UUID, service: TaskService = Depends(get_task_service)) -> TaskResponse:
    """
    IDを指定してタスクを1件取得するエンドポイント。

    Params:
        - task_id (uuid.UUID): 取得対象のタスクID
        - service (TaskService): タスクサービス

    Returns:
        - TaskResponse: 該当タスク
    """
    try:
        return service.get_task(task_id)
    except TaskNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate, service: TaskService = Depends(get_task_service)
) -> TaskResponse:
    """
    タスクを新規作成するエンドポイント。

    Params:
        - payload (TaskCreate): 作成するタスクの内容
        - service (TaskService): タスクサービス

    Returns:
        - TaskResponse: 作成されたタスク
    """
    return service.create_task(payload)


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: uuid.UUID,
    payload: TaskUpdate,
    service: TaskService = Depends(get_task_service),
) -> TaskResponse:
    """
    タスクを部分更新するエンドポイント。

    Params:
        - task_id (uuid.UUID): 更新対象のタスクID
        - payload (TaskUpdate): 更新内容
        - service (TaskService): タスクサービス

    Returns:
        - TaskResponse: 更新後のタスク
    """
    try:
        return service.update_task(task_id, payload)
    except TaskNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: uuid.UUID, service: TaskService = Depends(get_task_service)) -> None:
    """
    タスクを削除するエンドポイント。

    Params:
        - task_id (uuid.UUID): 削除対象のタスクID
        - service (TaskService): タスクサービス

    Returns:
        -
    """
    try:
        service.delete_task(task_id)
    except TaskNotFoundError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
