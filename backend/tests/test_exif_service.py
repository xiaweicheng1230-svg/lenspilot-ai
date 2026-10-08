from io import BytesIO

from PIL import Image, TiffImagePlugin

from app.services.exif_service import extract_exif


def test_extracts_normalized_camera_settings() -> None:
    exif = Image.Exif()
    exif[271] = "Canon"
    exif[272] = "EOS R50"
    exif[34855] = 800
    exif[33437] = TiffImagePlugin.IFDRational(28, 10)
    exif[33434] = TiffImagePlugin.IFDRational(1, 125)
    exif[37386] = TiffImagePlugin.IFDRational(50, 1)
    exif[36867] = "2026:09:29 10:30:00"

    buffer = BytesIO()
    Image.new("RGB", (64, 48), "navy").save(buffer, format="JPEG", exif=exif)
    buffer.seek(0)

    with Image.open(buffer) as image:
        result = extract_exif(image)

    assert result.has_exif is True
    assert result.camera_make == "Canon"
    assert result.camera_model == "EOS R50"
    assert result.iso == 800
    assert result.aperture == 2.8
    assert result.shutter_speed == "1/125s"
    assert result.focal_length_mm == 50
    assert result.taken_at is not None


def test_missing_exif_returns_safe_empty_shape() -> None:
    with Image.new("RGB", (10, 10), "white") as image:
        result = extract_exif(image)

    assert result.has_exif is False
    assert result.detected_fields == 0
    assert result.camera_model is None

