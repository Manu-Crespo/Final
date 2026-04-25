from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional

class Base(SQLModel):

    __abstract__ = True
    
    id: Optional[int] = Field(default=None, primary_key=True)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(),
        nullable=False
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        nullable=True
    )
    deleted_at: Optional[datetime] = Field(
        default=None,
        nullable=True
    )

    logic_delete: bool = Field(default=False)