import json
from fastapi.testclient import TestClient
from main import app
from app.routers import ai as ai_router
from app.models import ChatResponse, User, AuthTokens, AuthResponse
from app.auth import get_current_user


def _auth_response():
    return AuthResponse(
        user=User(id=1, email="u@example.com", name="User", plan="free", avatar_url=None),
        tokens=AuthTokens(access_token="t", refresh_token=None, expires_in=3600),
        valid=True,
    )


def test_streaming_sends_sse_chunks(monkeypatch):
    # override auth dependency to avoid external calls
    app.dependency_overrides[get_current_user] = lambda: _auth_response()
    client = TestClient(app)

    async def fake_stream(request):
        # emulate streaming of three chunks
        for part in ["Hel", "lo", "!"]:
            yield part

    # patch streaming generator
    monkeypatch.setattr(ai_router.ai_service, "chat_completion_stream", fake_stream)

    payload = {
        "messages": [
            {"role": "system", "content": "assistant"},
            {"role": "user", "content": "Hello"},
        ],
        "provider": "openai",
        "stream": True,
    }

    with client.stream("POST", "/api/ai/chat/stream", json=payload) as r:
        assert r.status_code == 200
        text = "".join(list(r.iter_text()))
        # verify SSE envelope lines exist
        assert "data: " in text
        assert json.dumps({"content": "Hel"}) in text
        assert json.dumps({"content": "lo"}) in text
        assert json.dumps({"content": "!"}) in text
        # done line
        assert json.dumps({"done": True}) in text

    app.dependency_overrides.clear()


