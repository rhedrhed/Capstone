from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

if TYPE_CHECKING:
    from app.models.garment import Garment
    from app.models.user import User


class Listing(Base):
    __tablename__ = "listings"

    listing_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    garment_id: Mapped[int] = mapped_column(
        ForeignKey("garments.garment_id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    asking_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    status: Mapped[str | None] = mapped_column(String(30), server_default="draft")
    created_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp()
    )
    # onupdate refreshes this column on every ORM UPDATE of a listing.
    updated_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    garment: Mapped[Garment] = relationship(back_populates="listings")
    user: Mapped[User] = relationship(back_populates="listings")
