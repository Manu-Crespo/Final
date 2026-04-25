from datetime import datetime
from fastapi import HTTPException, status
from sqlmodel import Session
from app.modules.product_catalog.ingredient.models import Ingredient
from app.modules.product_catalog.ingredient.schemas import (
    IngredientCreate,
    IngredientPublic,
    IngredientUpdate,
    IngredientList,
)
from app.modules.product_catalog.ingredient.unit_of_work import IngredientUnitOfWork


class IngredientService:
    
    def __init__(self, session: Session) -> None:
        self._session = session

    def _get_or_404(self, uow: IngredientUnitOfWork, ingredient_id: int) -> Ingredient:
        ingredient = uow.ingredients.get_by_id(ingredient_id)
        if not ingredient or ingredient.logic_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Ingrediente con id={ingredient_id} no encontrado",
            )
        return ingredient

    def create(self, data: IngredientCreate) -> IngredientPublic:
        with IngredientUnitOfWork(self._session) as uow:
            ingredient = Ingredient.model_validate(data)
            uow.ingredients.add(ingredient)
            result = IngredientPublic.model_validate(ingredient)
        return result

    def get_all(self, offset: int = 0, limit: int = 20) -> IngredientList:
        with IngredientUnitOfWork(self._session) as uow:
            ingredients = uow.ingredients.get_available(offset=offset, limit=limit)
            total = uow.ingredients.count_available()
            result = IngredientList(
                data=[IngredientPublic.model_validate(i) for i in ingredients],
                total=total,
            )
        return result

    def get_by_id(self, ingredient_id: int) -> IngredientPublic:
        with IngredientUnitOfWork(self._session) as uow:
            ingredient = self._get_or_404(uow, ingredient_id)
            result = IngredientPublic.model_validate(ingredient)
        return result

    def update(self, ingredient_id: int, data: IngredientUpdate) -> IngredientPublic:
        with IngredientUnitOfWork(self._session) as uow:
            ingredient = self._get_or_404(uow, ingredient_id)
            patch = data.model_dump(exclude_unset=True)
            for field, value in patch.items():
                setattr(ingredient, field, value)
            ingredient.updated_at = datetime.now()
            uow.ingredients.add(ingredient)
            result = IngredientPublic.model_validate(ingredient)
        return result

    def soft_delete(self, ingredient_id: int) -> None:
        with IngredientUnitOfWork(self._session) as uow:
            ingredient = self._get_or_404(uow, ingredient_id)
            ingredient.logic_delete = True
            ingredient.deleted_at = datetime.now()
            uow.ingredients.add(ingredient)
