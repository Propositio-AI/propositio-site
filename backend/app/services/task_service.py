import uuid

from sqlalchemy.orm import Session

from app.models.task import Task
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskNotFoundError(Exception):
    """
    指定したタスクが存在しない場合に送出される例外。

    Params:
        -

    Returns:
        -
    """


class TaskService:
    """
    タスクに関する業務ロジックを担うサービス層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self, db: Session) -> None:
        """
        DBセッションからリポジトリを組み立ててサービスを初期化する。

        Params:
            - db (Session): SQLAlchemyセッション

        Returns:
            -
        """
        self.repository = TaskRepository(db)

    def list_tasks(self) -> list[Task]:
        """
        タスク一覧を取得する。

        Params:
            -

        Returns:
            - list[Task]: タスク一覧
        """
        return self.repository.list_all()

    def get_task(self, task_id: uuid.UUID) -> Task:
        """
        IDを指定してタスクを1件取得する。

        Params:
            - task_id (uuid.UUID): 取得対象のタスクID

        Returns:
            - Task: 該当タスク

        Raises:
            - TaskNotFoundError: タスクが存在しない場合
        """
        task = self.repository.get_by_id(task_id)
        if task is None:
            raise TaskNotFoundError(f"Task {task_id} not found")
        return task

    def create_task(self, payload: TaskCreate) -> Task:
        """
        新規タスクを作成する。

        Params:
            - payload (TaskCreate): 作成するタスクの内容

        Returns:
            - Task: 作成されたタスク
        """
        task = Task(title=payload.title, description=payload.description)
        return self.repository.create(task)

    def update_task(self, task_id: uuid.UUID, payload: TaskUpdate) -> Task:
        """
        既存タスクを部分更新する。

        Params:
            - task_id (uuid.UUID): 更新対象のタスクID
            - payload (TaskUpdate): 更新内容（未指定項目は変更しない）

        Returns:
            - Task: 更新後のタスク

        Raises:
            - TaskNotFoundError: タスクが存在しない場合
        """
        task = self.get_task(task_id)
        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(task, field, value)
        return self.repository.update(task)

    def delete_task(self, task_id: uuid.UUID) -> None:
        """
        タスクを削除する。

        Params:
            - task_id (uuid.UUID): 削除対象のタスクID

        Returns:
            -

        Raises:
            - TaskNotFoundError: タスクが存在しない場合
        """
        task = self.get_task(task_id)
        self.repository.delete(task)
