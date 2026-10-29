"""Contract-focused tests for the dependency-free Lambda handler."""

from __future__ import annotations

import importlib.util
import os
import sys
import types
import unittest
from pathlib import Path
from unittest.mock import patch


class FakeTable:
    def query(self, **_kwargs):
        return {"Count": 0}

    def put_item(self, **_kwargs):
        return {}


class FakeDynamoDB:
    def Table(self, _name):
        return FakeTable()


class FakeCondition:
    def __and__(self, _other):
        return self


class FakeKey:
    def __init__(self, _name):
        pass

    def eq(self, _value):
        return FakeCondition()

    def gte(self, _value):
        return FakeCondition()


fake_boto3 = types.ModuleType("boto3")
fake_boto3.client = lambda _name: types.SimpleNamespace()
fake_boto3.resource = lambda _name: FakeDynamoDB()
fake_conditions = types.ModuleType("boto3.dynamodb.conditions")
fake_conditions.Key = FakeKey
sys.modules.setdefault("boto3", fake_boto3)
sys.modules.setdefault("boto3.dynamodb", types.ModuleType("boto3.dynamodb"))
sys.modules.setdefault("boto3.dynamodb.conditions", fake_conditions)

os.environ.setdefault("CONTACTS_TABLE", "contacts")
os.environ.setdefault("TURNSTILE_SECRET_PARAM", "/turnstile")
spec = importlib.util.spec_from_file_location(
    "site_api_handler", Path(__file__).with_name("handler.py")
)
handler = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(handler)


class HandlerTests(unittest.TestCase):
    def test_sanitizer_removes_executable_content(self):
        sanitizer = handler.SafeHtml()
        sanitizer.feed(
            '<p>本文<script>alert(1)</script><a href="javascript:alert(2)">link</a></p>'
        )
        result = "".join(sanitizer.parts)
        self.assertEqual(result, '<p>本文<a rel="noopener noreferrer">link</a></p>')

    def test_activity_list_keeps_fastapi_contract(self):
        with patch.object(
            handler,
            "microcms",
            return_value={
                "contents": [
                    {"id": "a", "title": "A", "publishedAt": "2026-01-01T00:00:00Z"}
                ],
                "totalCount": 1,
            },
        ):
            result = handler.list_activities({"limit": "10", "offset": "0"})
        self.assertEqual(result["total_count"], 1)
        self.assertEqual(result["contents"][0]["published_at"], "2026-01-01T00:00:00Z")

    def test_unknown_route_is_not_found(self):
        result = handler.lambda_handler(
            {"rawPath": "/private", "requestContext": {"http": {"method": "GET"}}}, None
        )
        self.assertEqual(result["statusCode"], 404)
        self.assertNotIn("Access-Control-Allow-Origin", result["headers"])

    def test_options_preflight_is_accepted(self):
        result = handler.lambda_handler(
            {
                "rawPath": "/activities",
                "requestContext": {"http": {"method": "OPTIONS"}},
            },
            None,
        )
        self.assertEqual(result["statusCode"], 204)
        self.assertEqual(result["body"], "")

    def test_contact_response_keeps_fastapi_contract(self):
        handler.PARAMETER_CACHE["/turnstile"] = "disabled"
        payload = {
            "inquiry_type": "other",
            "name": "山田 太郎",
            "name_kana": "ヤマダ タロウ",
            "organization": None,
            "email": "person@example.com",
            "message": "お問い合わせです。",
            "agreed_to_privacy": True,
            "turnstile_token": None,
        }
        with patch.object(handler, "send_contact_mails"):
            result = handler.submit_contact(payload, "127.0.0.1")
        self.assertEqual(result["status"], "new")
        self.assertEqual(result["email"], "person@example.com")
        self.assertNotIn("email_hash", result)


if __name__ == "__main__":
    unittest.main()
