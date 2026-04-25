from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.product_catalog.category.schemas import (
    CategoryCreate,
    CategoryPublic,
    CategoryUpdate,
    CategoryList,
)
from app.modules.product_catalog.category.service import CategoryService


router = APIRouter()


def get_category_service(session: Session = Depends(get_session)) -> CategoryService:
    return CategoryService(session)


@router.post(
    "/",
    response_model=CategoryPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una categoría",
)
def create_category(
    data: CategoryCreate,
    svc: CategoryService = Depends(get_category_service),
) -> CategoryPublic:
    return svc.create(data)


@router.get(
    "/",
    response_model=CategoryList,
    summary="Listar categorías (paginado)",
)
def list_categories(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    svc: CategoryService = Depends(get_category_service),
) -> CategoryList:
    return svc.get_all(offset=offset, limit=limit)


@router.get(
    "/{category_id}",
    response_model=CategoryPublic,
    summary="Obtener categoría por ID",
)
def get_category(
    category_id: int,
    svc: CategoryService = Depends(get_category_service),
) -> CategoryPublic:
    return svc.get_by_id(category_id)


@router.patch(
    "/{category_id}",
    response_model=CategoryPublic,
    summary="Actualizar categoría",
)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    svc: CategoryService = Depends(get_category_service),
) -> CategoryPublic:
    return svc.update(category_id, data)


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Borrado lógico de categoría",
)
def delete_category(
    category_id: int,
    svc: CategoryService = Depends(get_category_service),
) -> None:
    svc.soft_delete(category_id)
