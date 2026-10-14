"""contacts: add name_kana and replace inquiry types for the Karynos contact form

Revision ID: c3f1a9d2e4b7
Revises: 87a924a01794
Create Date: 2026-10-14 12:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'c3f1a9d2e4b7'
down_revision: str | Sequence[str] | None = '87a924a01794'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'contacts',
        sa.Column('name_kana', sa.String(length=100), server_default='', nullable=False),
    )
    # 旧種別（PROGRAM / JOIN）を新種別へ寄せてから、enum型を作り直す
    op.execute("ALTER TYPE inquiry_type RENAME TO inquiry_type_old")
    op.execute("CREATE TYPE inquiry_type AS ENUM ('PARTNERSHIP', 'PARTICIPATION', 'MEDIA', 'OTHER')")
    op.execute(
        """
        ALTER TABLE contacts ALTER COLUMN inquiry_type TYPE inquiry_type USING (
            CASE inquiry_type::text
                WHEN 'JOIN' THEN 'PARTICIPATION'
                WHEN 'PROGRAM' THEN 'OTHER'
                ELSE inquiry_type::text
            END
        )::inquiry_type
        """
    )
    op.execute("DROP TYPE inquiry_type_old")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("ALTER TYPE inquiry_type RENAME TO inquiry_type_new")
    op.execute(
        "CREATE TYPE inquiry_type AS ENUM ('PROGRAM', 'PARTNERSHIP', 'MEDIA', 'JOIN', 'OTHER')"
    )
    op.execute(
        """
        ALTER TABLE contacts ALTER COLUMN inquiry_type TYPE inquiry_type USING (
            CASE inquiry_type::text
                WHEN 'PARTICIPATION' THEN 'JOIN'
                ELSE inquiry_type::text
            END
        )::inquiry_type
        """
    )
    op.execute("DROP TYPE inquiry_type_new")
    op.drop_column('contacts', 'name_kana')
