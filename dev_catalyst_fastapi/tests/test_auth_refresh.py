from fastapi.testclient import TestClient

from app.models import AuthResponse, AuthTokens, User
from app.routers import auth as auth_router
from main import app


def _auth_response() -> AuthResponse:
    return AuthResponse(
        user=User(id=1, email="u@example.com", name="User", plan="free", avatar_url=None),
        tokens=AuthTokens(access_token="new_access", refresh_token="new_refresh", expires_in=3600),
        valid=True,
    )


def test_refresh_sets_cookies_and_returns_tokens(monkeypatch):
    client = TestClient(app)

    async def fake_refresh(refresh_token: str):
        assert refresh_token == "old_refresh"
        return _auth_response()

    # monkeypatch underlying service used by /api/auth/refresh
    monkeypatch.setattr(auth_router.auth_service, "refresh_token", fake_refresh)

    # send request with refresh_token cookie
    res = client.post("/api/auth/refresh", cookies={"refresh_token": "old_refresh"})
    assert res.status_code == 200
    body = res.json()
    assert body["tokens"]["access_token"] == "new_access"
    assert body["tokens"]["refresh_token"] == "new_refresh"
    # cookies should be set in response
    set_cookie_headers = res.headers.get_all("set-cookie")
    # access token cookie present
    assert any("access_token=new_access" in sc for sc in set_cookie_headers)
    # refresh token cookie present
    assert any("refresh_token=new_refresh" in sc for sc in set_cookie_headers)
