from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import List
import json
from ..models import ChatRequest, ChatResponse, ErrorResponse
from ..auth import get_current_user, AuthResponse
from ..ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/chat", response_model=ChatResponse)
async def chat_completion(
    request: ChatRequest,
    current_user: AuthResponse = Depends(get_current_user)
):
    """AI チャット補完"""
    try:
        # ユーザーのプランに基づいてアクセス制御
        if not _check_ai_access(current_user.user.plan, request.provider.value):
            raise HTTPException(
                status_code=403,
                detail=f"Your plan ({current_user.user.plan}) does not support {request.provider.value} AI provider"
            )
        
        response = await ai_service.chat_completion(request)
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/chat/stream")
async def chat_completion_stream(
    request: ChatRequest,
    current_user: AuthResponse = Depends(get_current_user)
):
    """AI チャット補完（ストリーミング）"""
    try:
        # ユーザーのプランに基づいてアクセス制御
        if not _check_ai_access(current_user.user.plan, request.provider.value):
            raise HTTPException(
                status_code=403,
                detail=f"Your plan ({current_user.user.plan}) does not support {request.provider.value} AI provider"
            )
        
        # ストリーミングを強制的に有効にする
        request.stream = True
        
        async def generate():
            try:
                async for chunk in ai_service.chat_completion_stream(request):
                    # Server-Sent Events形式でデータを送信
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                
                # ストリーム終了を示す
                yield f"data: {json.dumps({'done': True})}\n\n"
                
            except Exception as e:
                error_data = {
                    "error": True,
                    "message": str(e)
                }
                yield f"data: {json.dumps(error_data)}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/models")
async def get_available_models(
    current_user: AuthResponse = Depends(get_current_user)
):
    """利用可能なAIモデル一覧を取得"""
    models = {
        "openai": [
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "plan_required": "free"},
            {"id": "gpt-4", "name": "GPT-4", "plan_required": "standard"},
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "plan_required": "premium"},
        ],
        "anthropic": [
            {"id": "claude-3-haiku-20240307", "name": "Claude 3 Haiku", "plan_required": "standard"},
            {"id": "claude-3-sonnet-20240229", "name": "Claude 3 Sonnet", "plan_required": "premium"},
            {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus", "plan_required": "premium"},
        ]
    }
    
    # ユーザーのプランに基づいてフィルタリング
    user_plan = current_user.user.plan
    filtered_models = {}
    
    for provider, provider_models in models.items():
        filtered_models[provider] = [
            model for model in provider_models
            if _check_plan_access(user_plan, model["plan_required"])
        ]
    
    return {
        "models": filtered_models,
        "user_plan": user_plan
    }

def _check_ai_access(user_plan: str, provider: str) -> bool:
    """ユーザーのプランに基づいてAIプロバイダーへのアクセスをチェック"""
    plan_hierarchy = {"free": 0, "standard": 1, "premium": 2}
    
    provider_requirements = {
        "openai": 0,      # freeプランから利用可能
        "anthropic": 1,   # standardプランから利用可能
    }
    
    user_level = plan_hierarchy.get(user_plan, 0)
    required_level = provider_requirements.get(provider, 0)
    
    return user_level >= required_level

def _check_plan_access(user_plan: str, required_plan: str) -> bool:
    """プランレベルをチェック"""
    plan_hierarchy = {"free": 0, "standard": 1, "premium": 2}
    
    user_level = plan_hierarchy.get(user_plan, 0)
    required_level = plan_hierarchy.get(required_plan, 0)
    
    return user_level >= required_level