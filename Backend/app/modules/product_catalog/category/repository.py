from sqlalchemy import func
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.modules.product_catalog.category.models import Category


class CategoryRepository(BaseRepository[Category]):

    def __init__(self, session: Session) -> None:
        super().__init__(session, Category)

    def get_available(self, offset: int = 0, limit: int = 20) -> list[Category]:
        return list(
            self.session.exec(
                select(Category)
                .where(Category.logic_delete == False)  # noqa: E712
                .offset(offset)
                .limit(limit)
            ).all()
        )

    def count_available(self) -> int:
        statement = (
            select(func.count())
            .select_from(Category)
            .where(Category.logic_delete == False)  # noqa: E712
        )
        return self.session.exec(statement).one()
