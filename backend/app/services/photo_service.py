from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, status
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.config import Settings
from app.schemas.photo import ExifData, PhotoUploadResponse
from app.services.exif_service import extract_exif

FORMAT_CONFIG = {
    "JPEG": (".jpg", "image/jpeg"),
    "PNG": (".png", "image/png"),
    "WEBP": (".webp", "image/webp"),
}
ALLOWED_CONTENT_TYPES = {mime_type for _, mime_type in FORMAT_CONFIG.values()}
GENERIC_CONTENT_TYPES = {"application/octet-stream"}
THUMBNAIL_SIZE = (960, 960)


@dataclass(frozen=True)
class InspectedImage:
    format: str
    width: int
    height: int
    exif: ExifData


def _invalid_image(message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        detail={"code": "invalid_image", "message": message},
    )


def inspect_image(content: bytes, settings: Settings) -> InspectedImage:
    try:
        with Image.open(BytesIO(content)) as candidate:
            candidate.verify()
        with Image.open(BytesIO(content)) as image:
            image_format = image.format
            if image_format not in FORMAT_CONFIG:
                raise _invalid_image("仅支持 JPG、JPEG、PNG 和 WEBP 图片。")
            width, height = image.size
            if width * height > settings.max_image_pixels:
                raise _invalid_image(
                    f"图片像素过高，当前上限为 {settings.max_image_pixels:,} 像素。"
                )
            exif = extract_exif(image)
    except HTTPException:
        raise
    except (
        Image.DecompressionBombError,
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
    ) as error:
        raise _invalid_image("文件无法被解码为有效图片，可能已损坏或格式不正确。") from error

    return InspectedImage(format=image_format, width=width, height=height, exif=exif)


def _save_thumbnail(content: bytes, target: Path) -> None:
    with Image.open(BytesIO(content)) as source:
        image = ImageOps.exif_transpose(source)
        image.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
        if image.mode in ("RGBA", "LA"):
            background = Image.new("RGB", image.size, "white")
            alpha = image.getchannel("A")
            background.paste(image.convert("RGB"), mask=alpha)
            image = background
        elif image.mode != "RGB":
            image = image.convert("RGB")
        image.save(target, format="JPEG", quality=86, optimize=True)


def save_photo(
    *, content: bytes, original_filename: str, content_type: str | None, settings: Settings
) -> PhotoUploadResponse:
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if not content:
        raise _invalid_image("请选择一个非空图片文件。")
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail={
                "code": "file_too_large",
                "message": f"图片不能超过 {settings.max_upload_size_mb} MB。",
            },
        )
    if content_type and content_type not in ALLOWED_CONTENT_TYPES | GENERIC_CONTENT_TYPES:
        raise _invalid_image("文件声明的类型不受支持。")

    inspected = inspect_image(content, settings)
    extension, mime_type = FORMAT_CONFIG[inspected.format]
    photo_id = uuid4()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    thumbnail_dir = settings.upload_dir / "thumbnails"
    thumbnail_dir.mkdir(parents=True, exist_ok=True)

    stored_name = f"{photo_id}{extension}"
    thumbnail_name = f"{photo_id}.jpg"
    (settings.upload_dir / stored_name).write_bytes(content)
    _save_thumbnail(content, thumbnail_dir / thumbnail_name)

    notice = None
    if not inspected.exif.has_exif or inspected.exif.detected_fields == 0:
        notice = "未检测到完整 EXIF 信息，AI 将主要基于画面进行分析。"

    return PhotoUploadResponse(
        id=photo_id,
        original_filename=Path(original_filename or "photo").name,
        format=inspected.format,
        mime_type=mime_type,
        file_size=len(content),
        width=inspected.width,
        height=inspected.height,
        image_url=f"/media/{stored_name}",
        thumbnail_url=f"/media/thumbnails/{thumbnail_name}",
        exif=inspected.exif,
        exif_notice=notice,
    )

