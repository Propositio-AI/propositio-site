from datetime import datetime
import uuid

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    """
    タスク作成リクエストの型定義。

    Params:
        -

    Returns:
        -
    """

    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)


class TaskUpdate(BaseModel):
    """
    タスク更新リクエストの型定義。

    Params:
        -

    Returns:
        -
    """

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    is_done: bool | None = Field(default=None)


class TaskResponse(BaseModel):
    """
    タスク1件を表すレスポンスの型定義。

    Params:
        -

    Returns:
        -
    """

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str | None
    is_done: bool
    created_at: datetime
    updated_at: datetime
