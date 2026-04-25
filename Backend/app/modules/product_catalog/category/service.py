from datetime import datetime
from fastapi import HTTPException, status
from sqlmodel import Session
from app.modules.product_catalog.category.models import Category
from app.modules.product_catalog.category.schemas import (
    CategoryCreate,
    CategoryPublic,
    CategoryUpdate,
    CategoryList,
)
from app.modules.product_catalog.category.unit_of_work import CategoryUnitOfWork


class CategoryService:

    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_or_404(self, uow: CategoryUnitOfWork, category_id: int) -> Category:
        category = uow.categories.get_by_id(category_id)
        if not category or category.logic_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoría con id={category_id} no encontrada",
            )
        return category

    def create(self, data: CategoryCreate) -> CategoryPublic:
        with CategoryUnitOfWork(self._session) as uow:
            if data.parent_id is not None:
                parent = uow.categories.get_by_id(data.parent_id)
                if not parent or parent.logic_delete:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Categoría padre con id={data.parent_id} no encontrada",
                    )

            category = Category.model_validate(data)
            uow.categories.add(category)
            result = CategoryPublic.model_validate(category)
        return result

    def get_all(self, offset: int = 0, limit: int = 20) -> CategoryList:
        with CategoryUnitOfWork(self._session) as uow:
            categories = uow.categories.get_available(offset=offset, limit=limit)
            total = uow.categories.count_available()
            result = CategoryList(
                data=[CategoryPublic.model_validate(c) for c in categories],
                total=total,
            )
        return result

    def get_by_id(self, category_id: int) -> CategoryPublic:
        with CategoryUnitOfWork(self._session) as uow:
            category = self._get_or_404(uow, category_id)
            result = CategoryPublic.model_validate(category)
        return result

    def update(self, category_id: int, data: CategoryUpdate) -> CategoryPublic:
        with CategoryUnitOfWork(self._session) as uow:
            category = self._get_or_404(uow, category_id)
            
            patch = data.model_dump(exclude_unset=True)
            
            if "parent_id" in patch and patch["parent_id"] is not None:
                if patch["parent_id"] == category_id:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Una categoría no puede ser su propio padre",
                    )
                parent = uow.categories.get_by_id(patch["parent_id"])
                if not parent or parent.logic_delete:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Categoría padre con id={patch['parent_id']} no encontrada",
                    )

            for field, value in patch.items():
                setattr(category, field, value)
            category.updated_at = datetime.now()
            uow.categories.add(category)
            result = CategoryPublic.model_validate(category)
        return result

    def soft_delete(self, category_id: int) -> None:
        with CategoryUnitOfWork(self._session) as uow:
            category = self._get_or_404(uow, category_id)
            category.logic_delete = True
            category.deleted_at = datetime.now()
            uow.categories.add(category)
