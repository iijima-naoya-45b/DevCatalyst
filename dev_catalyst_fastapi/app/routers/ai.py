import json

from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse

from ..ai_service import ai_service
from ..auth import AuthResponse, get_current_user
from ..models import ChatRequest, ChatResponse
from ..utils.plan_checker import check_ai_access, check_plan_access

router = APIRouter(prefix="/ai", tags=["AI"])


def _normalize_chat_payload(payload: dict) -> dict:
    """
    受け取りボディが以下のいずれでも正規化して返す:
    - {"messages": [...], "provider": "...", ...}  (フラット)
    - {"chat": {...}}                              (ラップ)
    - {"stream": {"chat": {...}}}                  (二重ラップ)
    """
    if not isinstance(payload, dict):
        return {}
    # 二重ラップ優先で展開
    if "stream" in payload and isinstance(payload["stream"], dict):
        inner = payload["stream"]
        if "chat" in inner and isinstance(inner["chat"], dict):
            return inner["chat"]
    # 単ラップ
    if "chat" in payload and isinstance(payload["chat"], dict):
        return payload["chat"]
    # フラット
    return payload


@router.post("/chat", response_model=ChatResponse)
async def chat_completion(
    payload: dict = Body(...),
    current_user: AuthResponse = Depends(get_current_user),
):
    """AI チャット補完"""
    try:
        normalized = _normalize_chat_payload(payload)
        request = ChatRequest(**normalized)
        provider_key = request.provider.value if hasattr(request.provider, "value") else str(request.provider)
        if not check_ai_access(current_user.user.plan, provider_key):
            raise HTTPException(
                status_code=403,
                detail=f"Your plan ({current_user.user.plan}) does not support {provider_key} AI provider",
            )

        response = await ai_service.chat_completion(request)
        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/chat/stream")
async def chat_completion_stream(
    payload: dict = Body(...),
    current_user: AuthResponse = Depends(get_current_user),
):
    """AI チャット補完（ストリーミング）"""
    try:
        normalized = _normalize_chat_payload(payload)
        request = ChatRequest(**normalized)
        provider_key = request.provider.value if hasattr(request.provider, "value") else str(request.provider)
        if not check_ai_access(current_user.user.plan, provider_key):
            raise HTTPException(
                status_code=403,
                detail=f"Your plan ({current_user.user.plan}) does not support {provider_key} AI provider",
            )

        request.stream = True

        async def generate():
            try:
                async for chunk in ai_service.chat_completion_stream(request):
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                error_data = {"error": True, "message": str(e)}
                yield f"data: {json.dumps(error_data)}\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/models")
async def get_available_models(current_user: AuthResponse = Depends(get_current_user)):
    """利用可能なAIモデル一覧を取得"""
    models = {
        "openai": [
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "plan_required": "free"},
            {"id": "gpt-4", "name": "GPT-4", "plan_required": "standard"},
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "plan_required": "premium"},
        ],
        "anthropic": [
            {
                "id": "claude-3-haiku-20240307",
                "name": "Claude 3 Haiku",
                "plan_required": "standard",
            },
            {
                "id": "claude-3-sonnet-20240229",
                "name": "Claude 3 Sonnet",
                "plan_required": "premium",
            },
            {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus", "plan_required": "premium"},
        ],
    }

    user_plan = current_user.user.plan
    filtered_models = {}

    for provider, provider_models in models.items():
        filtered_models[provider] = [
            model
            for model in provider_models
            if check_plan_access(user_plan, model["plan_required"])
        ]

    return {"models": filtered_models, "user_plan": user_plan}
