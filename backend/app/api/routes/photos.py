from typing import Annotated

from fastapi import APIRouter, File, UploadFile

from app.core.config import get_settings
from app.schemas.photo import PhotoUploadResponse
from app.services.photo_service import save_photo

router = APIRouter(prefix="/photos")


@router.post("", response_model=PhotoUploadResponse, status_code=201)
async def upload_photo(
    photo: Annotated[UploadFile, File(description="Photo to inspect")],
) -> PhotoUploadResponse:
    settings = get_settings()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    content = await photo.read(max_bytes + 1)
    await photo.close()
    return save_photo(
        content=content,
        original_filename=photo.filename or "photo",
        content_type=photo.content_type,
        settings=settings,
    )

