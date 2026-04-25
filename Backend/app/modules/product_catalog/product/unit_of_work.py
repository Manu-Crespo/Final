from sqlmodel import Session
from app.core.unit_of_work import UnitOfWork
from app.modules.product_catalog.product.repository import ProductRepository
from app.modules.product_catalog.category.repository import CategoryRepository
from app.modules.product_catalog.ingredient.repository import IngredientRepository


class ProductUnitOfWork(UnitOfWork):
    
    def __init__(self, session: Session) -> None:
        
        super().__init__(session)
        self.products = ProductRepository(session)
        self.categories = CategoryRepository(session)
        self.ingredients = IngredientRepository(session)