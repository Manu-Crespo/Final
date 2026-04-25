from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.product_catalog.ingredient.schemas import (
    IngredientCreate,
    IngredientPublic,
    IngredientUpdate,
    IngredientList,
)
from app.modules.product_catalog.ingredient.service import IngredientService


router = APIRouter()


def get_ingredient_service(session: Session = Depends(get_session)) -> IngredientService:
    return IngredientService(session)


@router.post(
    "/",
    response_model=IngredientPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Crear ingrediente",
)
def create_ingredient(
    data: IngredientCreate,
    svc: IngredientService = Depends(get_ingredient_service),
) -> IngredientPublic:
    return svc.create(data)


@router.get(
    "/",
    response_model=IngredientList,
    summary="Listar ingredientes (paginado)",
)
def list_ingredients(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    svc: IngredientService = Depends(get_ingredient_service),
) -> IngredientList:
    return svc.get_all(offset=offset, limit=limit)


@router.get(
    "/{ingredient_id}",
    response_model=IngredientPublic,
    summary="Obtener ingrediente por ID",
)
def get_ingredient(
    ingredient_id: int,
    svc: IngredientService = Depends(get_ingredient_service),
) -> IngredientPublic:
    return svc.get_by_id(ingredient_id)


@router.patch(
    "/{ingredient_id}",
    response_model=IngredientPublic,
    summary="Actualizar ingrediente",
)
def update_ingredient(
    ingredient_id: int,
    data: IngredientUpdate,
    svc: IngredientService = Depends(get_ingredient_service),
) -> IngredientPublic:
    return svc.update(ingredient_id, data)


@router.delete(
    "/{ingredient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Borrado lógico de ingrediente",
)
def delete_ingredient(
    ingredient_id: int,
    svc: IngredientService = Depends(get_ingredient_service),
) -> None:
    svc.soft_delete(ingredient_id)
