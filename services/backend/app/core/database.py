from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """
    全SQLAlchemyモデルの基底クラス。

    Params:
        -

    Returns:
        -
    """


def get_db() -> Generator[Session, None, None]:
    """
    リクエストスコープのDBセッションを提供するDI用ジェネレータ。

    Params:
        -

    Returns:
        - Generator[Session, None, None]: SQLAlchemyセッション
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
