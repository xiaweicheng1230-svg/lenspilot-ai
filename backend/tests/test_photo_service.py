from io import BytesIO

import pytest
from fastapi import HTTPException
from PIL import Image

from app.core.config import Settings
from app.services.photo_service import save_photo


def make_image(format_name: str = "JPEG") -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (320, 240), "#c64b2d").save(buffer, format=format_name)
    return buffer.getvalue()


def test_saves_valid_photo_and_thumbnail(tmp_path) -> None:
    settings = Settings(upload_dir=tmp_path / "uploads")

    result = save_photo(
        content=make_image(),
        original_filename="sample.jpg",
        content_type="image/jpeg",
        settings=settings,
    )

    assert result.format == "JPEG"
    assert result.width == 320
    assert result.height == 240
    assert result.exif_notice is not None
    assert (settings.upload_dir / f"{result.id}.jpg").is_file()
    assert (settings.upload_dir / "thumbnails" / f"{result.id}.jpg").is_file()


def test_rejects_fake_image(tmp_path) -> None:
    settings = Settings(upload_dir=tmp_path / "uploads")

    with pytest.raises(HTTPException) as error:
        save_photo(
            content=b"not really a jpeg",
            original_filename="fake.jpg",
            content_type="image/jpeg",
            settings=settings,
        )

    assert error.value.status_code == 422
    assert error.value.detail["code"] == "invalid_image"


def test_rejects_file_over_configured_limit(tmp_path) -> None:
    settings = Settings(upload_dir=tmp_path / "uploads", max_upload_size_mb=1)

    with pytest.raises(HTTPException) as error:
        save_photo(
            content=b"0" * (1024 * 1024 + 1),
            original_filename="huge.jpg",
            content_type="image/jpeg",
            settings=settings,
        )

    assert error.value.status_code == 413
    assert error.value.detail["code"] == "file_too_large"

