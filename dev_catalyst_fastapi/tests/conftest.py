import os
import sys

import pytest
from fastapi.testclient import TestClient
import httpx

#
# テスト実行ディレクトリがリポジトリルートの場合でも
# `from app ...` が解決できるように、サービスディレクトリをPYTHONPATHへ追加
#
SERVICE_ROOT = os.path.dirname(os.path.dirname(__file__))  # dev_catalyst_fastapi/
if SERVICE_ROOT not in sys.path:
    sys.path.insert(0, SERVICE_ROOT)

# httpx.Headers 互換: requests風の get_all を提供（テストで使用）
if not hasattr(httpx.Headers, "get_all"):  # type: ignore[attr-defined]
    def _get_all(self, name: str) -> list[str]:  # type: ignore[no-redef]
        return self.get_list(name)
    setattr(httpx.Headers, "get_all", _get_all)

from app.auth import get_current_user
from app.models import AuthResponse, AuthTokens, User
from main import app


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
