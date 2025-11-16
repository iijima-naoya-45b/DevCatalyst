from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, validator


class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"


class ChatRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    role: ChatRole
    content: str = Field(..., min_length=1, max_length=10000)

    @validator("content")
    def content_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Content cannot be empty or whitespace only")
        return v.strip()

    class Config:
        use_enum_values = True
        anystr_strip_whitespace = True
        extra = "ignore"

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., min_items=1, max_items=100)
    provider: AIProvider = AIProvider.OPENAI
    model: Optional[str] = Field(None, max_length=100)
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(1000, ge=1, le=4000)
    stream: Optional[bool] = False
    metadata: Optional[Dict[str, Any]] = None

    @validator("messages")
    def validate_message_sequence(cls, v):
        if not v:
            raise ValueError("Messages list cannot be empty")

        # 最後のメッセージは user または assistant を許可（フロント側の実装差異に対応）
        if v[-1].role not in (ChatRole.USER, ChatRole.ASSISTANT):
            raise ValueError("Last message must be from user or assistant")

        return v

    @validator("model")
    def validate_model(cls, v, values):
        if v is None:
            return v

        provider = values.get("provider")
        valid_models = {
            AIProvider.OPENAI: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
            AIProvider.ANTHROPIC: ["claude-3-haiku-20240307", "claude-3-sonnet-20240229"],
        }

        # 以前のクライアント互換性のため、未知モデルはエラーにせず None にフォールバック
        if provider and v not in valid_models.get(provider, []):
            return None

        return v

    class Config:
        use_enum_values = True
        anystr_strip_whitespace = True
        extra = "ignore"


class ChatResponse(BaseModel):
    message: str
    provider: str
    model: str
    usage: Optional[Dict[str, Any]] = None


class AuthTokens(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: Optional[int] = None


class User(BaseModel):
    id: int
    email: str
    name: str
    plan: str
    avatar_url: Optional[str] = None


class AuthResponse(BaseModel):
    user: User
    tokens: AuthTokens
    valid: bool = True


class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int = 400
