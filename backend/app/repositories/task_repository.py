import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task


class TaskRepository:
    """
    tasksテーブルへの永続化アクセスのみを担うリポジトリ層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self, db: Session) -> None:
        """
        DBセッションを受け取ってリポジトリを初期化する。

        Params:
            - db (Session): SQLAlchemyセッション

        Returns:
            -
        """
        self.db = db

    def list_all(self) -> list[Task]:
        """
        全タスクを作成日時の昇順で取得する。

        Params:
            -

        Returns:
            - list[Task]: タスク一覧
        """
        stmt = select(Task).order_by(Task.created_at)
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, task_id: uuid.UUID) -> Task | None:
        """
        IDを指定してタスクを1件取得する。

        Params:
            - task_id (uuid.UUID): 取得対象のタスクID

        Returns:
            - Task | None: 該当タスク。存在しない場合はNone
        """
        return self.db.get(Task, task_id)

    def create(self, task: Task) -> Task:
        """
        タスクを新規作成する。

        Params:
            - task (Task): 保存対象のタスクエンティティ

        Returns:
            - Task: 保存後のタスクエンティティ
        """
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, task: Task) -> Task:
        """
        タスクの変更を保存する。

        Params:
            - task (Task): 更新対象のタスクエンティティ

        Returns:
            - Task: 更新後のタスクエンティティ
        """
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        """
        タスクを削除する。

        Params:
            - task (Task): 削除対象のタスクエンティティ

        Returns:
            -
        """
        self.db.delete(task)
        self.db.commit()
