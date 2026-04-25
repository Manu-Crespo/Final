from typing import List
from pydantic import BaseModel, Field
from app.modules.product_catalog.category.schemas import CategoryPublic
from app.modules.product_catalog.ingredient.schemas import IngredientPublic


# ── Entrada ───────────────────────────────────────────────────────────────────

class ProductCreate(BaseModel):
    
    name: str = Field(min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=500)
    base_price: float = Field(gt=0, le=100000)
    images_url: list[str] | None = None
    stock_quantity: int = Field(default=0, ge=0, le=10000)
    available: bool = True
    category_ids: List[int] = Field(default_factory=list)
    ingredient_ids: List[int] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    
    name: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=500)
    base_price: float | None = Field(default=None, gt=0, le=100000)
    images_url: list[str] | None = None
    stock_quantity: int | None = Field(default=None, ge=0, le=10000)
    available: bool | None = None
    category_ids: List[int] | None = None
    ingredient_ids: List[int] | None = None


# ── Salida ────────────────────────────────────────────────────────────────────

class ProductPublic(BaseModel):
    
    id: int
    name: str
    description: str | None
    base_price: float
    images_url: list[str] | None
    stock_quantity: int
    available: bool
    categories: List[CategoryPublic] = []
    ingredients: List[IngredientPublic] = []

    class Config:
        from_attributes = True


class ProductList(BaseModel):
    
    data: List[ProductPublic]
    total: int