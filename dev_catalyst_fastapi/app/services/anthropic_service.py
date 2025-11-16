from typing import AsyncGenerator, Optional, Tuple

import anthropic
from anthropic import NOT_GIVEN
from anthropic.types import Message
from anthropic.types.content_block import TextBlock

from ..config import settings
from ..models import ChatRequest, ChatResponse


class AnthropicService:
    def __init__(self):
        self.client = (
            anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            if settings.ANTHROPIC_API_KEY
            else None
        )

    async def chat_completion(self, request: ChatRequest) -> ChatResponse:
        """Anthropic チャット補完"""
        if not self.client:
            raise ValueError("Anthropic API key is not configured")

        model = request.model or "claude-3-sonnet-20240229"
        system_message, messages = self._prepare_messages(request)

        try:
            response: Message = await self.client.messages.create(
                model=model,
                max_tokens=request.max_tokens or 1000,
                temperature=(request.temperature if request.temperature is not None else NOT_GIVEN),
                system=system_message,
                messages=messages,
            )

            # content[0] は TextBlock | ToolUseBlock 等のUnion
            first = response.content[0] if response.content else None
            text: str = first.text if isinstance(first, TextBlock) else ""
            usage = response.usage
            return ChatResponse(
                message=str(text),
                provider="anthropic",
                model=model,
                usage=(
                    {
                        "input_tokens": usage.input_tokens,
                        "output_tokens": usage.output_tokens,
                        "total_tokens": usage.input_tokens + usage.output_tokens,
                    }
                    if usage is not None
                    else None
                ),
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
                temperature=(request.temperature if request.temperature is not None else NOT_GIVEN),
                system=system_message,
                messages=messages,
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as e:
            raise ValueError(f"Anthropic API error: {str(e)}")

    def _prepare_messages(self, request: ChatRequest) -> Tuple[Optional[str], list[dict[str, str]]]:
        """Anthropic用にメッセージを準備（systemメッセージを分離）"""
        system_message: Optional[str] = None
        messages: list[dict[str, str]] = []

        for msg in request.messages:
            role_value = msg.role.value if hasattr(msg.role, "value") else str(msg.role)
            if role_value == "system":
                system_message = msg.content
            else:
                messages.append({"role": role_value, "content": msg.content})

        return system_message, messages
