from contextlib import suppress
from datetime import datetime
from fractions import Fraction
from typing import Any

from PIL import ExifTags, Image

from app.schemas.photo import ExifData

METERING_MODES = {
    0: "未知",
    1: "平均测光",
    2: "中央重点平均测光",
    3: "点测光",
    4: "多点测光",
    5: "多区/评价测光",
    6: "局部测光",
}

WHITE_BALANCE_MODES = {0: "自动白平衡", 1: "手动白平衡"}


def _as_float(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return round(float(value), 6)
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def _as_int(value: Any) -> int | None:
    number = _as_float(value)
    return round(number) if number is not None else None


def _clean_text(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, bytes):
        value = value.decode("utf-8", errors="replace")
    text = str(value).replace("\x00", "").strip()
    return text or None


def _format_shutter(seconds: float | None) -> str | None:
    if seconds is None or seconds <= 0:
        return None
    if seconds < 1:
        denominator = round(1 / seconds)
        return f"1/{denominator}s"
    if seconds.is_integer():
        return f'{int(seconds)}s'
    return f'{seconds:g}s'


def _parse_datetime(value: Any) -> datetime | None:
    text = _clean_text(value)
    if not text:
        return None
    for pattern in ("%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(text, pattern)
        except ValueError:
            continue
    return None


def _read_named_tags(image: Image.Image) -> dict[str, Any]:
    exif = image.getexif()
    if not exif:
        return {}

    values: dict[int, Any] = dict(exif.items())
    with suppress(KeyError, TypeError, ValueError):
        values.update(exif.get_ifd(ExifTags.IFD.Exif))

    # GPS deliberately remains excluded from the normalized output.
    return {ExifTags.TAGS.get(tag_id, str(tag_id)): value for tag_id, value in values.items()}


def extract_exif(image: Image.Image) -> ExifData:
    tags = _read_named_tags(image)
    shutter_seconds = _as_float(tags.get("ExposureTime"))
    metering_value = _as_int(tags.get("MeteringMode"))
    white_balance_value = _as_int(tags.get("WhiteBalance"))

    values: dict[str, Any] = {
        "camera_make": _clean_text(tags.get("Make")),
        "camera_model": _clean_text(tags.get("Model")),
        "lens_model": _clean_text(tags.get("LensModel")),
        "iso": _as_int(tags.get("PhotographicSensitivity") or tags.get("ISOSpeedRatings")),
        "aperture": _as_float(tags.get("FNumber")),
        "shutter_speed": _format_shutter(shutter_seconds),
        "shutter_seconds": shutter_seconds,
        "focal_length_mm": _as_float(tags.get("FocalLength")),
        "exposure_compensation": _as_float(tags.get("ExposureBiasValue")),
        "metering_mode": METERING_MODES.get(metering_value, f"模式 {metering_value}")
        if metering_value is not None
        else None,
        "white_balance": WHITE_BALANCE_MODES.get(
            white_balance_value, f"模式 {white_balance_value}"
        )
        if white_balance_value is not None
        else None,
        "taken_at": _parse_datetime(tags.get("DateTimeOriginal") or tags.get("DateTime")),
    }
    detected_fields = sum(value is not None for value in values.values())
    return ExifData(
        **values,
        detected_fields=detected_fields,
        has_exif=bool(tags),
    )


def rational(numerator: int, denominator: int) -> Fraction:
    """Small helper used by tests and future metadata fixtures."""
    return Fraction(numerator, denominator)

