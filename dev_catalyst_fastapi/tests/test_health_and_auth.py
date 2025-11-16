from fastapi.testclient import TestClient
from main import app
from app.auth import get_optional_user


def test_health_endpoints():
    client = TestClient(app)
    r1 = client.get("/")
    r2 = client.get("/health")
    assert r1.status_code == 200
    assert r1.json()["status"] == "running"
    assert r2.status_code == 200
    assert r2.json()["status"] == "healthy"


def test_auth_check_unauthenticated(monkeypatch):
    client = TestClient(app)
    # force optional user to return None
    app.dependency_overrides[get_optional_user] = lambda: None
    r = client.get("/api/auth/check")
    app.dependency_overrides.clear()
    assert r.status_code == 200
    data = r.json()
    assert data["authenticated"] is False
    assert data["user"] is None


