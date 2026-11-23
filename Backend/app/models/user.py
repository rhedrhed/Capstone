from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

if TYPE_CHECKING:
    from app.models.garment import Garment
    from app.models.inventory import Inventory
    from app.models.listing import Listing


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp()
    )

    garments: Mapped[list[Garment]] = relationship(back_populates="user")
    listings: Mapped[list[Listing]] = relationship(back_populates="user")
    inventory_items: Mapped[list[Inventory]] = relationship(back_populates="user")
