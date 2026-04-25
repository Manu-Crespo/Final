from typing import TYPE_CHECKING
from sqlalchemy import Column, Boolean, TEXT, VARCHAR
from sqlmodel import Field, Relationship
from app.core.base import Base
from app.modules.product_catalog.product.models import ProductIngredient

if TYPE_CHECKING:
    from app.modules.product_catalog.product.models import Product


class Ingredient(Base, table=True):
    
    __tablename__ = "ingredient"

    name: str = Field(sa_column=Column(VARCHAR(100), nullable=False, unique=True))
    description: str | None = Field(default=None, sa_column=Column(TEXT, nullable=True))
    is_allergenic: bool = Field(sa_column=Column(Boolean, nullable=False, default=False))

    products: list["Product"] = Relationship(
        back_populates="ingredients",
        link_model=ProductIngredient,
    )
