from collections.abc import Generator

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

TEST_DATABASE_URL = "sqlite+pysqlite:///:memory:"


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """
    テスト用のインメモリDBセッションを生成するフィクスチャ。

    Params:
        -

    Returns:
        - Generator[Session, None, None]: テスト用SQLAlchemyセッション
    """
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """
    db_sessionをDIで差し替えたFastAPI用テストクライアントを生成するフィクスチャ。

    Params:
        - db_session (Session): テスト用SQLAlchemyセッション

    Returns:
        - Generator[TestClient, None, None]: テスト用HTTPクライアント
    """

    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
