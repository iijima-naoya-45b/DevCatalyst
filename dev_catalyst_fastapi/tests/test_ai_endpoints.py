import pytest
from fastapi.testclient import TestClient
from main import app
from app.models import ChatRequest, ChatMessage, ChatRole, AIProvider, ChatResponse
from app.routers import ai as ai_router


def _chat_payload(provider="openai"):
    return {
        "messages": [
            {"role": "system", "content": "You are helpful"},
            {"role": "user", "content": "Hello"},
        ],
        "provider": provider,
        "model": None,
        "temperature": 0.2,
        "max_tokens": 50,
        "stream": False,
        "metadata": None,
    }


def test_models_filtered_by_plan(client_free_plan: TestClient):
    res = client_free_plan.get("/api/ai/models")
    assert res.status_code == 200
    data = res.json()
    assert data["user_plan"] == "free"
    # free plan should have openai entries, anthropic filtered by plan
    assert "openai" in data["models"]
    assert "anthropic" in data["models"]
    # anthropic requires standard or higher, so for free it should be empty
    assert data["models"]["anthropic"] == []
    assert len(data["models"]["openai"]) >= 1


def test_chat_forbidden_with_anthropic_on_free_plan(client_free_plan: TestClient):
    res = client_free_plan.post("/api/ai/chat", json=_chat_payload(provider="anthropic"))
    assert res.status_code == 403
    assert "does not support anthropic" in res.json()["message"]


def test_chat_success_with_openai_on_free_plan(monkeypatch, client_free_plan: TestClient):
    async def fake_chat_completion(request):
        return ChatResponse(message="ok", provider="openai", model="gpt-3.5-turbo", usage={"tokens": 10})

    # patch underlying ai_service
    monkeypatch.setattr(ai_router.ai_service, "chat_completion", fake_chat_completion)

    res = client_free_plan.post("/api/ai/chat", json=_chat_payload(provider="openai"))
    assert res.status_code == 200
    assert res.json()["message"] == "ok"
    assert res.json()["provider"] == "openai"


