from typing import AsyncGenerator

from .models import AIProvider, ChatRequest, ChatResponse
from .services.anthropic_service import AnthropicService
from .services.openai_service import OpenAIService


class AIService:
    def __init__(self):
        self.openai_service = OpenAIService()
        self.anthropic_service = AnthropicService()

    async def chat_completion(self, request: ChatRequest) -> ChatResponse:
        """AI チャット補完"""
        if request.provider == AIProvider.OPENAI:
            return await self.openai_service.chat_completion(request)
        elif request.provider == AIProvider.ANTHROPIC:
            return await self.anthropic_service.chat_completion(request)
        else:
            raise ValueError(f"Unsupported AI provider: {request.provider}")

    async def chat_completion_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """AI チャット補完（ストリーミング）"""
        if request.provider == AIProvider.OPENAI:
            async for chunk in self.openai_service.chat_completion_stream(request):
                yield chunk
        elif request.provider == AIProvider.ANTHROPIC:
            async for chunk in self.anthropic_service.chat_completion_stream(request):
                yield chunk
        else:
            raise ValueError(f"Unsupported AI provider: {request.provider}")


ai_service = AIService()
