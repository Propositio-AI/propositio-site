from fastapi.testclient import TestClient


def test_health_returns_ok(client: TestClient) -> None:
    """
    ヘルスチェックエンドポイントがstatus=okを返すことを検証する。

    Params:
        - client (TestClient): テスト用HTTPクライアント

    Returns:
        -
    """
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
