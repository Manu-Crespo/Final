from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.product_catalog.product.schemas import (
    ProductCreate,
    ProductPublic,
    ProductUpdate,
    ProductList,
)
from app.modules.product_catalog.product.service import ProductService
from typing import Annotated
 
router = APIRouter()
 
 
def get_product_service(session: Session = Depends(get_session)) -> ProductService:
    
    return ProductService(session)
 
 
@router.post(
    "/",
    response_model=ProductPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un producto",
)
def create_product(
    data: ProductCreate,
    svc: ProductService = Depends(get_product_service),
) -> ProductPublic:
    
    return svc.create(data)
 
 


@router.get(
    "/",
    response_model=ProductList,
    summary="Listar productos (paginado)",
)
def list_products(
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    svc: ProductService = Depends(get_product_service),
) -> ProductList:
    
    return svc.get_all(offset=offset, limit=limit)
 
 
@router.get(
    "/{product_id}",
    response_model=ProductPublic,
    summary="Obtener producto por ID",
)
def get_product(
    product_id: int,
    svc: ProductService = Depends(get_product_service),
) -> ProductPublic:
    
    return svc.get_by_id(product_id)
 
 
@router.patch(
    "/{product_id}",
    response_model=ProductPublic,
    summary="Actualización parcial de producto",
)
def update_product(
    product_id: int,
    data: ProductUpdate,
    svc: ProductService = Depends(get_product_service),
) -> ProductPublic:
    
    return svc.update(product_id, data)
 
 
@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Borrado lógico de producto",
)
def delete_product(
    product_id: int,
    svc: ProductService = Depends(get_product_service),
) -> None:
   
    svc.soft_delete(product_id)