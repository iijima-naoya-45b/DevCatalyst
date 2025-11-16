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
        provider_key = (
            request.provider.value if hasattr(request.provider, "value") else str(request.provider)
        )
        if provider_key == AIProvider.OPENAI.value:
            return await self.openai_service.chat_completion(request)
        elif provider_key == AIProvider.ANTHROPIC.value:
            return await self.anthropic_service.chat_completion(request)
        else:
            raise ValueError(f"Unsupported AI provider: {provider_key}")

    async def chat_completion_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """AI チャット補完（ストリーミング）"""
        provider_key = (
            request.provider.value if hasattr(request.provider, "value") else str(request.provider)
        )
        if provider_key == AIProvider.OPENAI.value:
            async for chunk in self.openai_service.chat_completion_stream(request):
                yield chunk
        elif provider_key == AIProvider.ANTHROPIC.value:
            async for chunk in self.anthropic_service.chat_completion_stream(request):
                yield chunk
        else:
            raise ValueError(f"Unsupported AI provider: {provider_key}")


ai_service = AIService()
