"""
初期データの定義を集約するモジュール。

新しいエンティティの初期データを追加する場合は、ここに
`{エンティティ名}_SEED_DATA` という定数を追加し、
`app/seed/seed.py` の `run_seed()` から投入する。
"""

TASK_SEED_DATA: list[dict[str, str | bool]] = [
    {
        "title": "プロジェクトのセットアップ",
        "description": "リポジトリを初期化する",
        "is_done": True,
    },
    {
        "title": "Docker環境の構築",
        "description": "frontend/backend/dbを起動できるようにする",
        "is_done": True,
    },
    {
        "title": "サンプルCRUDの実装",
        "description": "Taskエンティティで全レイヤーを実装する",
        "is_done": False,
    },
]
