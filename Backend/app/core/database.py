from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings
from app.modules.product_catalog.product import models as product_models  # noqa: F401
from app.modules.product_catalog.category import models as category_models  # noqa: F401
from app.modules.product_catalog.ingredient import models as ingredient_models  # noqa: F401

engine = create_engine(
    settings.DATABASE_URL, 
    echo=False,
    connect_args={"client_encoding": "utf8"}
)


def create_db_and_tables() -> None:
    
    SQLModel.metadata.create_all(engine)


def get_session():
    
    with Session(engine) as session:
        yield session