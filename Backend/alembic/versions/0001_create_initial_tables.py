"""create initial tables

Revision ID: 0001
Revises:
Create Date: 2026-11-23

Creates the seven application tables. Tables that already exist in the
database (e.g. created earlier from the DBML schema) are left untouched,
so this migration is safe on both an empty and a pre-populated database.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

NOW = sa.text("CURRENT_TIMESTAMP")


def upgrade() -> None:
    existing = set(sa.inspect(op.get_bind()).get_table_names())

    if "users" not in existing:
        op.create_table(
            "users",
            sa.Column("user_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("full_name", sa.String(100), nullable=False),
            sa.Column("email", sa.String(150), nullable=False),
            sa.Column("password_hash", sa.Text(), nullable=False),
            sa.Column("created_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.PrimaryKeyConstraint("user_id"),
            sa.UniqueConstraint("email"),
        )

    if "garments" not in existing:
        op.create_table(
            "garments",
            sa.Column("garment_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("category", sa.String(100), nullable=True),
            sa.Column("brand", sa.String(100), nullable=True),
            sa.Column("color", sa.String(50), nullable=True),
            sa.Column("size", sa.String(30), nullable=True),
            sa.Column("material", sa.String(100), nullable=True),
            sa.Column("created_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.user_id"]),
            sa.PrimaryKeyConstraint("garment_id"),
        )

    if "garment_images" not in existing:
        op.create_table(
            "garment_images",
            sa.Column("image_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("garment_id", sa.Integer(), nullable=False),
            sa.Column("image_path", sa.Text(), nullable=False),
            sa.Column("uploaded_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.ForeignKeyConstraint(["garment_id"], ["garments.garment_id"]),
            sa.PrimaryKeyConstraint("image_id"),
        )

    if "evaluations" not in existing:
        op.create_table(
            "evaluations",
            sa.Column("evaluation_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("garment_id", sa.Integer(), nullable=False),
            sa.Column("predicted_category", sa.String(100), nullable=True),
            sa.Column("predicted_brand", sa.String(100), nullable=True),
            sa.Column("predicted_color", sa.String(50), nullable=True),
            sa.Column("condition", sa.String(50), nullable=True),
            sa.Column("estimated_price", sa.Numeric(10, 2), nullable=True),
            sa.Column("confidence_score", sa.Numeric(5, 4), nullable=True),
            sa.Column("model_version", sa.String(50), nullable=True),
            sa.Column("evaluated_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.ForeignKeyConstraint(["garment_id"], ["garments.garment_id"]),
            sa.PrimaryKeyConstraint("evaluation_id"),
        )

    if "comparable_items" not in existing:
        op.create_table(
            "comparable_items",
            sa.Column("comparable_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("evaluation_id", sa.Integer(), nullable=False),
            sa.Column("source_name", sa.String(150), nullable=True),
            sa.Column("item_title", sa.Text(), nullable=True),
            sa.Column("category", sa.String(100), nullable=True),
            sa.Column("brand", sa.String(100), nullable=True),
            sa.Column("condition", sa.String(50), nullable=True),
            sa.Column("listed_price", sa.Numeric(10, 2), nullable=True),
            sa.Column("item_url", sa.Text(), nullable=True),
            sa.ForeignKeyConstraint(["evaluation_id"], ["evaluations.evaluation_id"]),
            sa.PrimaryKeyConstraint("comparable_id"),
        )

    if "listings" not in existing:
        op.create_table(
            "listings",
            sa.Column("listing_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("garment_id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(200), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("asking_price", sa.Numeric(10, 2), nullable=True),
            sa.Column("status", sa.String(30), server_default="draft", nullable=True),
            sa.Column("created_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.Column("updated_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.ForeignKeyConstraint(["garment_id"], ["garments.garment_id"]),
            sa.ForeignKeyConstraint(["user_id"], ["users.user_id"]),
            sa.PrimaryKeyConstraint("listing_id"),
        )

    if "inventory" not in existing:
        op.create_table(
            "inventory",
            sa.Column("inventory_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("garment_id", sa.Integer(), nullable=False),
            sa.Column("quantity", sa.Integer(), server_default=sa.text("1"), nullable=True),
            sa.Column(
                "inventory_status", sa.String(30), server_default="available", nullable=True
            ),
            sa.Column("added_at", sa.DateTime(), server_default=NOW, nullable=True),
            sa.ForeignKeyConstraint(["garment_id"], ["garments.garment_id"]),
            sa.ForeignKeyConstraint(["user_id"], ["users.user_id"]),
            sa.PrimaryKeyConstraint("inventory_id"),
            sa.UniqueConstraint("user_id", "garment_id", name="unique_user_garment"),
        )


def downgrade() -> None:
    op.drop_table("inventory")
    op.drop_table("listings")
    op.drop_table("comparable_items")
    op.drop_table("evaluations")
    op.drop_table("garment_images")
    op.drop_table("garments")
    op.drop_table("users")
