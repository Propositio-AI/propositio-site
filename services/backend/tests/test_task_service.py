import uuid

import pytest
from sqlalchemy.orm import Session

from app.schemas.task import TaskCreate, TaskUpdate
from app.services.task_service import TaskNotFoundError, TaskService


def test_create_task(db_session: Session) -> None:
    """create_taskがtitleとdescriptionを保存することを確認する。"""
    service = TaskService(db_session)

    task = service.create_task(TaskCreate(title="洗濯", description="部屋干し"))

    assert task.title == "洗濯"
    assert task.description == "部屋干し"
    assert task.is_done is False


def test_get_task_raises_when_not_found(db_session: Session) -> None:
    """存在しないIDを指定するとTaskNotFoundErrorになることを確認する。"""
    service = TaskService(db_session)

    with pytest.raises(TaskNotFoundError):
        service.get_task(uuid.uuid4())


def test_update_task_partial_update(db_session: Session) -> None:
    """未指定フィールドは変更されず、指定フィールドのみ更新されることを確認する。"""
    service = TaskService(db_session)
    task = service.create_task(TaskCreate(title="元のタイトル", description="元の説明"))

    updated = service.update_task(task.id, TaskUpdate(is_done=True))

    assert updated.title == "元のタイトル"
    assert updated.description == "元の説明"
    assert updated.is_done is True


def test_delete_task_raises_when_not_found(db_session: Session) -> None:
    """存在しないタスクを削除しようとするとTaskNotFoundErrorになることを確認する。"""
    service = TaskService(db_session)

    with pytest.raises(TaskNotFoundError):
        service.delete_task(uuid.uuid4())
