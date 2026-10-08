from fastapi.testclient import TestClient

from app.core.config import get_settings
from app.main import app, create_app


def test_health_check_reports_mock_mode_by_default() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "lenspilot-api",
        "environment": "development",
        "ai_mode": "mock",
    }


def test_vercel_preview_origin_can_be_allowed_by_regex(monkeypatch) -> None:
    monkeypatch.setenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")
    get_settings.cache_clear()
    test_app = create_app()

    try:
        with TestClient(test_app) as client:
            response = client.options(
                "/api/v1/health",
                headers={
                    "Origin": "https://lenspilot-git-main-example.vercel.app",
                    "Access-Control-Request-Method": "GET",
                },
            )
        assert response.status_code == 200
        assert response.headers["access-control-allow-origin"] == (
            "https://lenspilot-git-main-example.vercel.app"
        )
    finally:
        get_settings.cache_clear()

