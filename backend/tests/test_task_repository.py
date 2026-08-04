from sqlalchemy.orm import Session

from app.models.task import Task
from app.repositories.task_repository import TaskRepository


def test_create_and_get_by_id(db_session: Session) -> None:
    """作成したタスクをIDで取得できることを確認する。"""
    repo = TaskRepository(db_session)
    created = repo.create(Task(title="牛乳を買う"))

    found = repo.get_by_id(created.id)

    assert found is not None
    assert found.title == "牛乳を買う"
    assert found.is_done is False


def test_list_all_orders_by_created_at(db_session: Session) -> None:
    """一覧取得が作成順に並んで返ることを確認する。"""
    repo = TaskRepository(db_session)
    repo.create(Task(title="1件目"))
    repo.create(Task(title="2件目"))

    tasks = repo.list_all()

    assert [t.title for t in tasks] == ["1件目", "2件目"]


def test_delete_removes_task(db_session: Session) -> None:
    """削除後は一覧に含まれなくなることを確認する。"""
    repo = TaskRepository(db_session)
    task = repo.create(Task(title="削除対象"))

    repo.delete(task)

    assert repo.get_by_id(task.id) is None
