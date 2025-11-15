import anthropic
from typing import AsyncGenerator
from ..config import settings
from ..models import ChatRequest, ChatResponse

class AnthropicService:
    def __init__(self):
        self.client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None

    async def chat_completion(self, request: ChatRequest) -> ChatResponse:
        """Anthropic チャット補完"""
        if not self.client:
            raise ValueError("Anthropic API key is not configured")

        model = request.model or "claude-3-sonnet-20240229"
        system_message, messages = self._prepare_messages(request)

        try:
            response = await self.client.messages.create(
                model=model,
                max_tokens=request.max_tokens or 1000,
                temperature=request.temperature,
                system=system_message,
                messages=messages
            )

            return ChatResponse(
                message=response.content[0].text,
                provider="anthropic",
                model=model,
                usage={
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                    "total_tokens": response.usage.input_tokens + response.usage.output_tokens
                }
            )
        except Exception as e:
            raise ValueError(f"Anthropic API error: {str(e)}")

    async def chat_completion_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """Anthropic チャット補完（ストリーミング）"""
        if not self.client:
            raise ValueError("Anthropic API key is not configured")

        model = request.model or "claude-3-sonnet-20240229"
        system_message, messages = self._prepare_messages(request)

        try:
            async with self.client.messages.stream(
                model=model,
                max_tokens=request.max_tokens or 1000,
                temperature=request.temperature,
                system=system_message,
                messages=messages
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as e:
            raise ValueError(f"Anthropic API error: {str(e)}")

    def _prepare_messages(self, request: ChatRequest):
        """Anthropic用にメッセージを準備（systemメッセージを分離）"""
        system_message = None
        messages = []
        
        for msg in request.messages:
            if msg.role.value == "system":
                system_message = msg.content
            else:
                messages.append({
                    "role": msg.role.value,
                    "content": msg.content
                })
        
        return system_message, messages