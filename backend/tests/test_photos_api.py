from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app


def test_upload_photo_contract(tmp_path, monkeypatch) -> None:
    monkeypatch.chdir(tmp_path)
    buffer = BytesIO()
    Image.new("RGB", (120, 80), "green").save(buffer, format="PNG")

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/photos",
            files={"photo": ("leaf.png", buffer.getvalue(), "image/png")},
        )

    assert response.status_code == 201
    payload = response.json()
    assert payload["original_filename"] == "leaf.png"
    assert payload["format"] == "PNG"
    assert payload["width"] == 120
    assert payload["height"] == 80
    assert payload["exif"]["has_exif"] is False
    assert payload["thumbnail_url"].startswith("/media/thumbnails/")


def test_upload_accepts_generic_binary_content_type(tmp_path, monkeypatch) -> None:
    monkeypatch.chdir(tmp_path)
    buffer = BytesIO()
    Image.new("RGB", (40, 30), "orange").save(buffer, format="PNG")

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/photos",
            files={"photo": ("camera-upload.png", buffer.getvalue(), "application/octet-stream")},
        )

    assert response.status_code == 201
    assert response.json()["format"] == "PNG"

