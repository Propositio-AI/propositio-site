"""
初期データ投入用のエントリーポイント。

実行方法:
    uv run python -m app.seed.seed
"""

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.task import Task
from app.seed.data import TASK_SEED_DATA


def seed_tasks(db: Session) -> None:
    """
    tasksテーブルが空の場合のみ初期データを投入する。

    Params:
        - db (Session): SQLAlchemyセッション

    Returns:
        -
    """
    if db.query(Task).first() is not None:
        print("[seed] tasks already has data, skipping")
        return

    for row in TASK_SEED_DATA:
        db.add(Task(**row))
    db.commit()
    print(f"[seed] inserted {len(TASK_SEED_DATA)} tasks")


def run_seed() -> None:
    """
    全エンティティの初期データ投入をまとめて実行する。

    新しいエンティティを追加した場合は、ここに
    `seed_xxx(db)` の呼び出しを追加する。

    Params:
        -

    Returns:
        -
    """
    db = SessionLocal()
    try:
        seed_tasks(db)
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
