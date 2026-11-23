from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

if TYPE_CHECKING:
    from app.models.comparable_item import ComparableItem
    from app.models.garment import Garment


class Evaluation(Base):
    __tablename__ = "evaluations"

    evaluation_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    garment_id: Mapped[int] = mapped_column(
        ForeignKey("garments.garment_id"), nullable=False
    )
    predicted_category: Mapped[str | None] = mapped_column(String(100))
    predicted_brand: Mapped[str | None] = mapped_column(String(100))
    predicted_color: Mapped[str | None] = mapped_column(String(50))
    condition: Mapped[str | None] = mapped_column(String(50))
    estimated_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    confidence_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 4))
    model_version: Mapped[str | None] = mapped_column(String(50))
    evaluated_at: Mapped[datetime | None] = mapped_column(
        server_default=func.current_timestamp()
    )

    garment: Mapped[Garment] = relationship(back_populates="evaluations")
    comparable_items: Mapped[list[ComparableItem]] = relationship(
        back_populates="evaluation"
    )
