from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

if TYPE_CHECKING:
    from app.models.garment import Garment


class GarmentImage(Base):
    __tablename__ = "garment_images"

    image_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    garment_id: Mapped[int] = mapped_column(
        ForeignKey("garments.garment_id"), nullable=False
    )
    image_path: Mapped[str] = mapped_column(Text, nullable=False)
    uploaded_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp()
    )

    garment: Mapped[Garment] = relationship(back_populates="images")
