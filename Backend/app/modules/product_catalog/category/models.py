from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Column, VARCHAR, TEXT
from sqlmodel import Field, Relationship
from app.core.base import Base

if TYPE_CHECKING:
    from app.modules.product_catalog.product.models import Product

from app.modules.product_catalog.product.models import ProductCategory

class Category(Base, table=True):
    
    __tablename__ = "category"

    name: str = Field(sa_column=Column(VARCHAR(100), nullable=False, unique=True))
    description: Optional[str] = Field(default=None, sa_column=Column(TEXT, nullable=True))
    image_url: Optional[str] = Field(default=None, sa_column=Column(VARCHAR(255), nullable=True))

    # Atributo UML: +parent_id : BIGINT {FK → Categoria.id, NULL}
    parent_id: Optional[int] = Field(
        default=None,
        foreign_key="category.id",
        nullable=True
    )

    # Relación jerárquica: permite acceder a la categoría padre y a las subcategorías
    parent: Optional["Category"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs={"remote_side": "Category.id"}
    )
    children: List["Category"] = Relationship(back_populates="parent")

    # Relación N:M con Product (definida via ProductCategory en product/models.py)
    products: List["Product"] = Relationship(
        back_populates="categories",
        link_model=ProductCategory
    )