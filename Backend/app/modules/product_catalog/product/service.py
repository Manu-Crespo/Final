from datetime import datetime
from fastapi import HTTPException, status
from sqlmodel import Session
from app.modules.product_catalog.product.models import Product
from app.modules.product_catalog.product.schemas import (
    ProductCreate,
    ProductPublic,
    ProductUpdate,
    ProductList,
)
from app.modules.product_catalog.product.unit_of_work import ProductUnitOfWork


class ProductService:
    
    def __init__(self, session: Session) -> None:
        
        self._session = session

    # ── Helpers privados ──────────────────────────────────────────────────────

    def _get_or_404(self, uow: ProductUnitOfWork, product_id: int) -> Product:
        
        product = uow.products.get_by_id(product_id)
        if not product or product.logic_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con id={product_id} no encontrado",
            )
        return product

    # ── Casos de uso ──────────────────────────────────────────────────────────

    def create(self, data: ProductCreate) -> ProductPublic:
        
        with ProductUnitOfWork(self._session) as uow:
            product_data = data.model_dump(exclude={"category_ids", "ingredient_ids"})
            product = Product(**product_data)
            
            # Agregamos primero a la sesión para evitar SAWarning en el autoflush de las consultas subsecuentes
            uow.products.add(product)

            # Relacionar categorías
            for cat_id in data.category_ids:
                cat = uow.categories.get_by_id(cat_id)
                if not cat or cat.logic_delete:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Categoría con id={cat_id} no encontrada"
                    )
                product.categories.append(cat)

            # Relacionar ingredientes
            for ing_id in data.ingredient_ids:
                ing = uow.ingredients.get_by_id(ing_id)
                if not ing or ing.logic_delete:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Ingrediente con id={ing_id} no encontrado"
                    )
                product.ingredients.append(ing)

            result = ProductPublic.model_validate(product)
        return result

    def get_all(self, offset: int = 0, limit: int = 20) -> ProductList:
        
        with ProductUnitOfWork(self._session) as uow:
            products = uow.products.get_available(offset=offset, limit=limit)
            total = uow.products.count_available()
            result = ProductList(
                data=[ProductPublic.model_validate(p) for p in products],
                total=total,
            )
        return result

    def get_by_id(self, product_id: int) -> ProductPublic:
        
        with ProductUnitOfWork(self._session) as uow:
            product = self._get_or_404(uow, product_id)
            result = ProductPublic.model_validate(product)
        return result

    def update(self, product_id: int, data: ProductUpdate) -> ProductPublic:
        
        with ProductUnitOfWork(self._session) as uow:
            product = self._get_or_404(uow, product_id)

            # Solo aplica campos enviados por el cliente
            patch = data.model_dump(exclude_unset=True, exclude={"category_ids", "ingredient_ids"})
            for field, value in patch.items():
                setattr(product, field, value)

            if data.category_ids is not None:
                product.categories = []  # Limpiar relaciones viejas
                for cat_id in data.category_ids:
                    cat = uow.categories.get_by_id(cat_id)
                    if not cat or cat.logic_delete:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Categoría con id={cat_id} no encontrada"
                        )
                    product.categories.append(cat)

            if data.ingredient_ids is not None:
                product.ingredients = []  # Limpiar relaciones viejas
                for ing_id in data.ingredient_ids:
                    ing = uow.ingredients.get_by_id(ing_id)
                    if not ing or ing.logic_delete:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Ingrediente con id={ing_id} no encontrado"
                        )
                    product.ingredients.append(ing)

            product.updated_at = datetime.now()
            uow.products.add(product)
            result = ProductPublic.model_validate(product)
        return result

    def soft_delete(self, product_id: int) -> None:
        
        with ProductUnitOfWork(self._session) as uow:
            product = self._get_or_404(uow, product_id)
            product.logic_delete = True
            product.deleted_at = datetime.now()
            uow.products.add(product)