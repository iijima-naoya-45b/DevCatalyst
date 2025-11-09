from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum

class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

class ChatRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: ChatRole
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    provider: AIProvider = AIProvider.OPENAI
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000
    stream: Optional[bool] = False

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