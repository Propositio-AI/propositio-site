import uuid

from fastapi.testclient import TestClient


def test_create_and_list_tasks(client: TestClient) -> None:
    """POSTで作成したタスクがGET一覧に含まれることを確認する。"""
    response = client.post("/tasks", json={"title": "買い物"})
    assert response.status_code == 201
    created = response.json()
    assert created["title"] == "買い物"

    list_response = client.get("/tasks")
    assert list_response.status_code == 200
    assert any(task["id"] == created["id"] for task in list_response.json())


def test_get_task_404_when_not_found(client: TestClient) -> None:
    """存在しないタスクを取得すると404が返ることを確認する。"""
    response = client.get(f"/tasks/{uuid.uuid4()}")
    assert response.status_code == 404


def test_update_and_delete_task(client: TestClient) -> None:
    """PATCHで更新し、DELETEで削除できることを確認する。"""
    created = client.post("/tasks", json={"title": "掃除"}).json()

    patch_response = client.patch(f"/tasks/{created['id']}", json={"is_done": True})
    assert patch_response.status_code == 200
    assert patch_response.json()["is_done"] is True

    delete_response = client.delete(f"/tasks/{created['id']}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/tasks/{created['id']}")
    assert get_response.status_code == 404
