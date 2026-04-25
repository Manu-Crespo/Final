from typing import TYPE_CHECKING, List
#from datetime import datetime, timezone
from sqlalchemy import Column, VARCHAR, TEXT, DECIMAL, Integer, Boolean, ARRAY, String, CheckConstraint
from sqlmodel import Field, Relationship, SQLModel
from app.core.base import Base

if TYPE_CHECKING:
    from app.modules.product_catalog.category.models import Category
    from app.modules.product_catalog.ingredient.models import Ingredient


# ─── Tablas intermedias ───────────────────────────────────────────────────────

class ProductCategory(SQLModel, table=True):
    
    __tablename__ = "product_category"

    product_id: int = Field(
        foreign_key="product.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    category_id: int = Field(
        foreign_key="category.id",
        primary_key=True,
        ondelete="CASCADE"
    )


class ProductIngredient(SQLModel, table=True):
    
    __tablename__ = "product_ingredient"

    product_id: int = Field(
        foreign_key="product.id",
        primary_key=True,
        ondelete="CASCADE"
    )
    ingredient_id: int = Field(
        foreign_key="ingredient.id",
        primary_key=True,
        ondelete="CASCADE"
    )


# ─── Modelo principal ─────────────────────────────────────────────────────────

class Product(Base, table=True):
    
    __tablename__ = "product"
    __table_args__ = (
        CheckConstraint("base_price >= 0", name="chk_product_base_price_positive"),
        CheckConstraint("stock_quantity >= 0", name="chk_product_stock_positive"),
    )

    name: str = Field(
        sa_column=Column(VARCHAR(150), nullable=False)
    )
    description: str | None = Field(
        sa_column=Column(TEXT, nullable=True)
    )
    base_price: float = Field(
        sa_column=Column(DECIMAL(10, 2), nullable=False)
    )
    images_url: list[str] | None = Field(
        sa_column=Column(ARRAY(String), nullable=True)
    )
    stock_quantity: int = Field(
        sa_column=Column(Integer, nullable=False, default=0)
    )
    available: bool = Field(
        sa_column=Column(Boolean, nullable=False, default=True)
    )

    # ── Relación N:M con Category via ProductCategory ─────────────────────────
    categories: List["Category"] = Relationship(
        back_populates="products",
        link_model=ProductCategory
    )

    # ── Relación N:M con Ingredient via ProductIngredient ─────────────────────
    ingredients: List["Ingredient"] = Relationship(
        back_populates="products",
        link_model=ProductIngredient
    )