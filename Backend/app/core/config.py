from urllib.parse import quote_plus
from pydantic import Field, computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    postgres_user: str = "postgres"
    postgres_password: str = "password"
    postgres_db: str = "team_hero_db"
    postgres_host: str = "localhost"
    postgres_port: int = 5433
    database_url: str | None = Field(default=None, alias="DATABASE_URL")

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        if self.database_url:
            return self.database_url
        user = quote_plus(self.postgres_user)
        password = quote_plus(self.postgres_password)
        return (
            f"postgresql://{user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()