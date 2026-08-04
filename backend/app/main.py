from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import task

settings = get_settings()

app = FastAPI(title="Propositio Base API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task.router)


@app.get("/health")
def health() -> dict[str, str]:
    """
    死活監視用のヘルスチェックエンドポイント。

    Params:
        -

    Returns:
        - dict[str, str]: ステータス文字列を含む辞書
    """
    return {"status": "ok"}
