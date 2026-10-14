from pydantic import BaseModel


class HealthResponse(BaseModel):
    """
    ヘルスチェックエンドポイントのレスポンス型。

    Params:
        - status (str): 稼働状態を表す文字列（正常時は"ok"）

    Returns:
        -
    """

    status: str
