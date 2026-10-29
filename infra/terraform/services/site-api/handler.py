"""Public site API for microCMS activities and contact submissions.

The function intentionally uses only the Python standard library and boto3 so
the deployment package stays small and reproducible.
"""

from __future__ import annotations

import json
import os
import re
from datetime import datetime, timedelta, timezone
from email.utils import parseaddr
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
from typing import Any, ClassVar
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
from uuid import uuid4

import boto3
from boto3.dynamodb.conditions import Key

ssm = boto3.client("ssm")
ses = boto3.client("ses")
dynamodb = boto3.resource("dynamodb")
contacts = dynamodb.Table(os.environ["CONTACTS_TABLE"])

PARAMETER_CACHE: dict[str, str] = {}
INQUIRY_LABELS = {
    "partnership": "連携・協力のご相談",
    "participation": "検証への参加",
    "media": "取材",
    "other": "その他",
}
KATAKANA = re.compile(r"^[ァ-ヶー\s　]+$")
CONTENT_ID = re.compile(r"^[A-Za-z0-9_-]{1,128}$")


class ApiError(Exception):
    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


class SafeHtml(HTMLParser):
    allowed_tags: ClassVar[set[str]] = {
        "p",
        "br",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "s",
        "blockquote",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "a",
        "img",
        "figure",
        "figcaption",
        "pre",
        "code",
        "hr",
        "span",
    }
    void_tags: ClassVar[set[str]] = {"br", "img", "hr"}
    skip_tags: ClassVar[set[str]] = {"script", "style", "iframe", "object", "embed"}
    allowed_attributes: ClassVar[dict[str, set[str]]] = {
        "a": {"href", "title"},
        "img": {"src", "alt", "title", "width", "height"},
        "span": {"class"},
        "code": {"class"},
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in self.skip_tags:
            self.skip_depth += 1
            return
        if self.skip_depth or tag not in self.allowed_tags:
            return
        safe_attrs: list[str] = []
        for name, value in attrs:
            if name not in self.allowed_attributes.get(tag, set()) or value is None:
                continue
            if name in {"href", "src"}:
                lowered = value.strip().lower()
                schemes = ("https://", "http://", "mailto:", "/", "#")
                if not lowered.startswith(schemes):
                    continue
            safe_attrs.append(f' {name}="{escape(value, quote=True)}"')
        if tag == "a":
            safe_attrs.append(' rel="noopener noreferrer"')
        self.parts.append(f"<{tag}{''.join(safe_attrs)}>")

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in self.skip_tags:
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if (
            not self.skip_depth
            and tag in self.allowed_tags
            and tag not in self.void_tags
        ):
            self.parts.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(escape(data))


def response(status: int, body: Any) -> dict[str, Any]:
    return {
        "statusCode": status,
        "headers": {"content-type": "application/json; charset=utf-8"},
        "body": json.dumps(body, ensure_ascii=False),
    }


def parameter(name: str) -> str:
    if name not in PARAMETER_CACHE:
        PARAMETER_CACHE[name] = ssm.get_parameter(Name=name, WithDecryption=True)[
            "Parameter"
        ]["Value"]
    return PARAMETER_CACHE[name]


def microcms(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    query = f"?{urlencode(params)}" if params else ""
    url = f"https://{os.environ['MICROCMS_SERVICE_DOMAIN']}.microcms.io/api/v1{path}{query}"
    request = Request(
        url,
        headers={"X-MICROCMS-API-KEY": parameter(os.environ["MICROCMS_API_KEY_PARAM"])},
    )
    try:
        with urlopen(request, timeout=10) as result:
            return json.load(result)
    except HTTPError as error:
        if error.code == 404:
            raise ApiError(404, "活動記録が見つかりません。") from error
        raise ApiError(502, "活動記録を取得できませんでした。") from error
    except URLError as error:
        raise ApiError(502, "活動記録を取得できませんでした。") from error


def summary(item: dict[str, Any]) -> dict[str, Any]:
    category = item.get("category")
    thumbnail = item.get("thumbnail")
    return {
        "id": item["id"],
        "title": item.get("title", ""),
        "description": item.get("description") or "",
        "category": {"id": category["id"], "name": category.get("name", "")}
        if category
        else None,
        "thumbnail": {
            "url": thumbnail["url"],
            "width": thumbnail.get("width"),
            "height": thumbnail.get("height"),
        }
        if thumbnail and thumbnail.get("url")
        else None,
        "published_at": item["publishedAt"],
    }


def neighbor(filters: str, orders: str) -> dict[str, str] | None:
    data = microcms(
        "/activities",
        {"limit": 1, "filters": filters, "orders": orders, "fields": "id,title"},
    )
    if not data.get("contents"):
        return None
    item = data["contents"][0]
    return {"id": item["id"], "title": item.get("title", "")}


def list_activities(query: dict[str, str]) -> dict[str, Any]:
    try:
        limit = min(max(int(query.get("limit", "10")), 1), 100)
        offset = max(int(query.get("offset", "0")), 0)
    except ValueError as error:
        raise ApiError(400, "limitまたはoffsetが不正です。") from error
    params: dict[str, Any] = {
        "limit": limit,
        "offset": offset,
        "orders": "-publishedAt",
    }
    if query.get("category"):
        if not CONTENT_ID.fullmatch(query["category"]):
            raise ApiError(400, "categoryが不正です。")
        params["filters"] = f"category[equals]{query['category']}"
    data = microcms("/activities", params)
    return {
        "contents": [summary(item) for item in data["contents"]],
        "total_count": data["totalCount"],
    }


def get_activity(content_id: str) -> dict[str, Any]:
    if not CONTENT_ID.fullmatch(content_id):
        raise ApiError(404, "活動記録が見つかりません。")
    item = microcms(f"/activities/{quote(content_id)}")
    sanitizer = SafeHtml()
    sanitizer.feed(item.get("content") or "")
    published = item["publishedAt"]
    return {
        **summary(item),
        "content": "".join(sanitizer.parts),
        "newer": neighbor(f"publishedAt[greater_than]{published}", "publishedAt"),
        "older": neighbor(f"publishedAt[less_than]{published}", "-publishedAt"),
    }


def list_categories() -> list[dict[str, str]]:
    data = microcms("/categories", {"limit": 100})
    return [
        {"id": item["id"], "name": item.get("name", "")} for item in data["contents"]
    ]


def clean_line(
    value: Any, field: str, maximum: int, required: bool = True
) -> str | None:
    if value is None and not required:
        return None
    if not isinstance(value, str):
        raise ApiError(400, f"{field}を入力してください。")
    cleaned = value.strip()
    if (
        (required and not cleaned)
        or len(cleaned) > maximum
        or "\r" in cleaned
        or "\n" in cleaned
    ):
        raise ApiError(400, f"{field}が不正です。")
    return cleaned or None


def verify_turnstile(token: Any, remote_ip: str | None) -> None:
    secret = parameter(os.environ["TURNSTILE_SECRET_PARAM"])
    if secret == "disabled":
        return
    if not isinstance(token, str) or not token:
        raise ApiError(
            400, "送信元の確認に失敗しました。ページを再読み込みしてお試しください。"
        )
    payload = urlencode(
        {"secret": secret, "response": token, "remoteip": remote_ip or ""}
    ).encode()
    try:
        with urlopen(
            Request(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data=payload,
            ),
            timeout=10,
        ) as result:
            verified = json.load(result).get("success") is True
    except (HTTPError, URLError) as error:
        raise ApiError(
            400, "送信元を確認できませんでした。時間をおいてお試しください。"
        ) from error
    if not verified:
        raise ApiError(
            400, "送信元の確認に失敗しました。ページを再読み込みしてお試しください。"
        )


def valid_email(value: Any) -> str:
    if not isinstance(value, str) or len(value) > 254 or "\r" in value or "\n" in value:
        raise ApiError(400, "メールアドレスが不正です。")
    _, address = parseaddr(value.strip())
    if (
        address != value.strip()
        or address.count("@") != 1
        or "." not in address.rsplit("@", 1)[1]
    ):
        raise ApiError(400, "メールアドレスが不正です。")
    return address.lower()


def submit_contact(payload: dict[str, Any], remote_ip: str | None) -> dict[str, Any]:
    inquiry_type = payload.get("inquiry_type")
    if inquiry_type not in INQUIRY_LABELS:
        raise ApiError(400, "お問い合わせ種別が不正です。")
    if payload.get("agreed_to_privacy") is not True:
        raise ApiError(400, "プライバシーポリシーへの同意が必要です。")
    name = clean_line(payload.get("name"), "お名前", 100)
    name_kana = clean_line(payload.get("name_kana"), "フリガナ", 100)
    if not KATAKANA.fullmatch(name_kana or ""):
        raise ApiError(400, "フリガナは全角カタカナで入力してください。")
    organization = clean_line(payload.get("organization"), "所属", 200, required=False)
    email = valid_email(payload.get("email"))
    message = payload.get("message")
    if (
        not isinstance(message, str)
        or not message.strip()
        or len(message.strip()) > 2000
    ):
        raise ApiError(400, "お問い合わせ内容が不正です。")
    message = message.strip()
    verify_turnstile(payload.get("turnstile_token"), remote_ip)

    now = datetime.now(timezone.utc)
    email_hash = sha256(email.encode()).hexdigest()
    since = (now - timedelta(hours=1)).isoformat()
    recent = contacts.query(
        IndexName="email-created-at",
        KeyConditionExpression=Key("email_hash").eq(email_hash)
        & Key("created_at").gte(since),
        Select="COUNT",
    )
    if recent.get("Count", 0) >= 5:
        raise ApiError(
            429,
            "短時間に多くのお問い合わせが送信されています。しばらく時間をおいてお試しください。",
        )

    contact_id = str(uuid4())
    created_at = now.isoformat()
    item = {
        "id": contact_id,
        "email_hash": email_hash,
        "created_at": created_at,
        "inquiry_type": inquiry_type,
        "name": name,
        "name_kana": name_kana,
        "organization": organization,
        "email": email,
        "message": message,
        "status": "new",
    }
    contacts.put_item(
        Item={key: value for key, value in item.items() if value is not None}
    )
    try:
        send_contact_mails(item)
    except Exception as error:  # noqa: BLE001 - delivery failure must not lose the submission
        # The submission remains in DynamoDB if mail delivery temporarily fails.
        print(
            json.dumps({"mail_error": type(error).__name__, "contact_id": contact_id})
        )
    return {key: value for key, value in item.items() if key != "email_hash"}


def send_mail(to: str, subject: str, body: str, reply_to: str) -> None:
    ses.send_email(
        Source=os.environ["MAIL_FROM"],
        Destination={"ToAddresses": [to]},
        ReplyToAddresses=[reply_to],
        Message={
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {"Text": {"Data": body, "Charset": "UTF-8"}},
        },
        ConfigurationSetName=os.environ["SES_CONFIGURATION_SET"],
    )


def send_contact_mails(item: dict[str, Any]) -> None:
    label = INQUIRY_LABELS[item["inquiry_type"]]
    notify_to = os.environ["CONTACT_NOTIFY_TO"]
    notification = "\n".join(
        [
            "Webサイトのお問い合わせフォームから送信がありました。",
            "このメールに返信すると、送信者へ直接返信できます。",
            "",
            f"お問い合わせ種別: {label}",
            f"お名前: {item['name']}（{item['name_kana']}）",
            f"所属: {item.get('organization') or '—'}",
            f"メールアドレス: {item['email']}",
            "",
            "お問い合わせ内容:",
            item["message"],
            "",
            "----",
            f"受付ID: {item['id']}",
        ]
    )
    send_mail(
        notify_to,
        f"【お問い合わせ】{label} - {item['name']} 様",
        notification,
        item["email"],
    )
    auto_reply = "\n".join(
        [
            f"{item['name']} 様",
            "",
            "お問い合わせありがとうございます。",
            "以下の受付IDで承りました。内容を確認のうえ、担当者よりご連絡します。",
            "",
            f"受付ID: {item['id']}",
            "",
            "Propositio AI",
        ]
    )
    send_mail(
        item["email"],
        "【Propositio AI】お問い合わせを受け付けました",
        auto_reply,
        notify_to,
    )


def lambda_handler(event: dict[str, Any], _context: Any) -> dict[str, Any]:
    try:
        request = event.get("requestContext", {}).get("http", {})
        method = request.get("method", "")
        path = event.get("rawPath", "/").rstrip("/") or "/"
        query = event.get("queryStringParameters") or {}
        if method == "GET" and path == "/activities":
            return response(200, list_activities(query))
        if method == "GET" and path.startswith("/activities/"):
            return response(200, get_activity(path.removeprefix("/activities/")))
        if method == "GET" and path == "/categories":
            return response(200, list_categories())
        if method == "POST" and path == "/contacts":
            try:
                payload = json.loads(event.get("body") or "{}")
            except json.JSONDecodeError as error:
                raise ApiError(400, "リクエストが不正です。") from error
            remote_ip = request.get("sourceIp")
            return response(201, submit_contact(payload, remote_ip))
        raise ApiError(404, "Not found")
    except ApiError as error:
        return response(error.status, {"detail": str(error)})
    except Exception as error:  # noqa: BLE001 - public API must not expose internals
        print(
            json.dumps(
                {"error": type(error).__name__, "message": str(error)},
                ensure_ascii=False,
            )
        )
        return response(500, {"detail": "サーバーでエラーが発生しました。"})
