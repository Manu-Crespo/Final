from sqlalchemy import func
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.modules.product_catalog.ingredient.models import Ingredient


class IngredientRepository(BaseRepository[Ingredient]):

    def __init__(self, session: Session) -> None:
        super().__init__(session, Ingredient)

    def get_available(self, offset: int = 0, limit: int = 20) -> list[Ingredient]:
        return list(
            self.session.exec(
                select(Ingredient)
                .where(Ingredient.logic_delete == False)  # noqa: E712
                .offset(offset)
                .limit(limit)
            ).all()
        )

    def count_available(self) -> int:
        statement = (
            select(func.count())
            .select_from(Ingredient)
            .where(Ingredient.logic_delete == False)  # noqa: E712
        )
        return self.session.exec(statement).one()
