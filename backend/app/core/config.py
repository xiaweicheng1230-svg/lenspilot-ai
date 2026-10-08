from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    log_level: str = "INFO"
    database_url: str = "sqlite:///./data/lenspilot.db"
    data_dir: Path = Path("data")
    upload_dir: Path = Path("uploads")
    max_upload_size_mb: int = Field(default=10, ge=1, le=100)
    max_image_pixels: int = Field(default=40_000_000, ge=1_000_000, le=200_000_000)
    cors_origins: list[str] = ["http://localhost:3000"]
    cors_origin_regex: str | None = None

    mock_ai: bool = True
    ai_api_key: str | None = None
    ai_model: str | None = None
    ai_base_url: str | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

