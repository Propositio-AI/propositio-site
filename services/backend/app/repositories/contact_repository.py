from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contact import Contact


class ContactRepository:
    """
    contactsテーブルへの永続化アクセスのみを担うリポジトリ層。

    Params:
        -

    Returns:
        -
    """

    def __init__(self, db: Session) -> None:
        """
        DBセッションを受け取ってリポジトリを初期化する。

        Params:
            - db (Session): SQLAlchemyセッション

        Returns:
            -
        """
        self.db = db

    def create(self, contact: Contact) -> Contact:
        """
        お問い合わせを新規保存する。

        Params:
            - contact (Contact): 保存対象のお問い合わせエンティティ

        Returns:
            - Contact: 保存後のお問い合わせエンティティ
        """
        self.db.add(contact)
        self.db.commit()
        self.db.refresh(contact)
        return contact

    def count_by_email_since(self, email: str, since: datetime) -> int:
        """
        指定したメールアドレスからの、ある時刻以降の送信件数を数える。

        Params:
            - email (str): 対象のメールアドレス
            - since (datetime): 集計の起点となる時刻

        Returns:
            - int: 該当する送信件数
        """
        stmt = (
            select(func.count())
            .select_from(Contact)
            .where(Contact.email == email, Contact.created_at >= since)
        )
        return self.db.scalar(stmt) or 0
