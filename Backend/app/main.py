from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.product_catalog.product.router import router as product_router
from app.modules.product_catalog.category.router import router as category_router
from app.modules.product_catalog.ingredient.router import router as ingredient_router
from app.core.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas al iniciar la aplicación
    create_db_and_tables()
    yield

def create_app() -> FastAPI:
    app = FastAPI(
        title="Food Store API",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Aquí incluirías tus otros archivos de rutas
    # app.include_router(user.router)
    app.include_router(product_router, prefix="/products", tags=["products"])
    app.include_router(category_router, prefix="/categories", tags=["categories"])
    app.include_router(ingredient_router, prefix="/ingredients", tags=["ingredients"])

    @app.get("/")
    def health_check():
        return {"status": "ok"}

    return app

app = create_app()