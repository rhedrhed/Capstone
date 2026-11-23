# Import every model so they register on Base.metadata (needed by Alembic).
from app.models.user import User
from app.models.garment import Garment
from app.models.garment_image import GarmentImage
from app.models.evaluation import Evaluation
from app.models.comparable_item import ComparableItem
from app.models.listing import Listing
from app.models.inventory import Inventory

__all__ = [
    "User",
    "Garment",
    "GarmentImage",
    "Evaluation",
    "ComparableItem",
    "Listing",
    "Inventory",
]
