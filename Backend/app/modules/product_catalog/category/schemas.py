from typing import List
from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    
    parent_id: int | None = None
    name: str = Field(min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    image_url: str | None = None


class CategoryUpdate(BaseModel):
    
    parent_id: int | None = None
    name: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    image_url: str | None = None


class CategoryPublic(BaseModel):
    
    id: int
    parent_id: int | None
    name: str
    description: str | None
    image_url: str | None

    class Config:
        from_attributes = True


class CategoryList(BaseModel):
    
    data: List[CategoryPublic]
    total: int
