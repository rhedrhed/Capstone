from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

if TYPE_CHECKING:
    from app.models.evaluation import Evaluation
    from app.models.garment_image import GarmentImage
    from app.models.inventory import Inventory
    from app.models.listing import Listing
    from app.models.user import User


class Garment(Base):
    __tablename__ = "garments"

    garment_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))
    brand: Mapped[str | None] = mapped_column(String(100))
    color: Mapped[str | None] = mapped_column(String(50))
    size: Mapped[str | None] = mapped_column(String(30))
    material: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp()
    )

    user: Mapped[User] = relationship(back_populates="garments")
    images: Mapped[list[GarmentImage]] = relationship(back_populates="garment")
    evaluations: Mapped[list[Evaluation]] = relationship(back_populates="garment")
    listings: Mapped[list[Listing]] = relationship(back_populates="garment")
    inventory_items: Mapped[list[Inventory]] = relationship(back_populates="garment")
