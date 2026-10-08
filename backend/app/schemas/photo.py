from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class ExifData(BaseModel):
    camera_make: str | None = None
    camera_model: str | None = None
    lens_model: str | None = None
    iso: int | None = None
    aperture: float | None = None
    shutter_speed: str | None = None
    shutter_seconds: float | None = None
    focal_length_mm: float | None = None
    exposure_compensation: float | None = None
    metering_mode: str | None = None
    white_balance: str | None = None
    taken_at: datetime | None = None
    detected_fields: int = Field(ge=0)
    has_exif: bool


class PhotoUploadResponse(BaseModel):
    id: UUID
    original_filename: str
    format: Literal["JPEG", "PNG", "WEBP"]
    mime_type: Literal["image/jpeg", "image/png", "image/webp"]
    file_size: int = Field(gt=0)
    width: int = Field(gt=0)
    height: int = Field(gt=0)
    image_url: str
    thumbnail_url: str
    exif: ExifData
    exif_notice: str | None = None

