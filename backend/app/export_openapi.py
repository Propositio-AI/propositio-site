"""
FastAPIのOpenAPIスキーマを静的JSONファイルとして書き出すスクリプト。

実行方法:
    uv run python -m app.export_openapi
"""

import json
from pathlib import Path

from app.main import app

OUTPUT_PATH = Path(__file__).resolve().parents[2] / "openapi.json"


def export_openapi() -> None:
    """
    FastAPIアプリのOpenAPIスキーマをリポジトリルートのopenapi.jsonに書き出す。

    Params:
        -

    Returns:
        -
    """
    schema = app.openapi()
    OUTPUT_PATH.write_text(json.dumps(schema, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[export_openapi] wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    export_openapi()
