import asyncio
import pytest
from fastapi.testclient import TestClient
from main import app
from app.models import User, AuthTokens, AuthResponse
from app.auth import get_current_user


def _make_auth_response(plan: str = "free") -> AuthResponse:
    return AuthResponse(
        user=User(id=1, email="user@example.com", name="User", plan=plan, avatar_url=None),
        tokens=AuthTokens(access_token="test", refresh_token=None, expires_in=3600),
        valid=True,
    )


@pytest.fixture
def client_free_plan():
    # override dependency to simulate authenticated user (free plan)
    app.dependency_overrides[get_current_user] = lambda: _make_auth_response("free")
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def client_standard_plan():
    # override dependency to simulate authenticated user (standard plan)
    app.dependency_overrides[get_current_user] = lambda: _make_auth_response("standard")
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


