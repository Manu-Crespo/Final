from sqlalchemy import func
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.modules.product_catalog.product.models import Product
 
 
class ProductRepository(BaseRepository[Product]):
    
    def __init__(self, session: Session) -> None:
        
        super().__init__(session, Product)
 
    def get_available(self, offset: int = 0, limit: int = 20) -> list[Product]:
        
        return list(
            self.session.exec(
                select(Product)
                .where(Product.logic_delete == False)  # noqa: E712
                .offset(offset)
                .limit(limit)
            ).all()
        )
 
    def count_available(self) -> int:
        
        statement = (
            select(func.count())
            .select_from(Product)
            .where(Product.logic_delete == False)  # noqa: E712
        )
        return self.session.exec(statement).one()
 