from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, UniqueConstraint, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

if TYPE_CHECKING:
    from app.models.garment import Garment
    from app.models.user import User


class Inventory(Base):
    __tablename__ = "inventory"
    __table_args__ = (
        UniqueConstraint("user_id", "garment_id", name="unique_user_garment"),
    )

    inventory_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    garment_id: Mapped[int] = mapped_column(
        ForeignKey("garments.garment_id"), nullable=False
    )
    quantity: Mapped[int | None] = mapped_column(server_default=text("1"))
    inventory_status: Mapped[str | None] = mapped_column(
        String(30), server_default="available"
    )
    added_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp()
    )

    user: Mapped[User] = relationship(back_populates="inventory_items")
    garment: Mapped[Garment] = relationship(back_populates="inventory_items")
