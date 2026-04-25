from typing import List
from pydantic import BaseModel, Field


class IngredientCreate(BaseModel):
    
    name: str = Field(min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    is_allergenic: bool = False


class IngredientUpdate(BaseModel):
    
    name: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    is_allergenic: bool | None = None


class IngredientPublic(BaseModel):
    
    id: int
    name: str
    description: str | None
    is_allergenic: bool

    class Config:
        from_attributes = True


class IngredientList(BaseModel):
    
    data: List[IngredientPublic]
    total: int
