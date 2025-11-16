from typing import AsyncGenerator

import openai

from ..config import settings
from ..models import ChatRequest, ChatResponse


class OpenAIService:
    def __init__(self):
        self.client = (
            openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        )

    async def chat_completion(self, request: ChatRequest) -> ChatResponse:
        """OpenAI チャット補完"""
        if not self.client:
            raise ValueError("OpenAI API key is not configured")

        model = request.model or "gpt-3.5-turbo"
        messages = [
            {
                "role": (msg.role.value if hasattr(msg.role, "value") else str(msg.role)),
                "content": msg.content,
            }
            for msg in request.messages
        ]

        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                stream=False,
            )

            return ChatResponse(
                message=response.choices[0].message.content,
                provider="openai",
                model=model,
                usage={
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens,
                },
            )
        except Exception as e:
            # モデル関連エラー時のフォールバック（以前の互換用）
            if model != "gpt-3.5-turbo":
                try:
                    fallback_model = "gpt-3.5-turbo"
                    response = await self.client.chat.completions.create(
                        model=fallback_model,
                        messages=messages,
                        temperature=request.temperature,
                        max_tokens=request.max_tokens,
                        stream=False,
                    )
                    return ChatResponse(
                        message=response.choices[0].message.content,
                        provider="openai",
                        model=fallback_model,
                        usage={
                            "prompt_tokens": response.usage.prompt_tokens,
                            "completion_tokens": response.usage.completion_tokens,
                            "total_tokens": response.usage.total_tokens,
                        },
                    )
                except Exception:
                    pass
            raise ValueError(f"OpenAI API error: {str(e)}")

    async def chat_completion_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """OpenAI チャット補完（ストリーミング）"""
        if not self.client:
            raise ValueError("OpenAI API key is not configured")

        model = request.model or "gpt-3.5-turbo"
        messages = [
            {
                "role": (msg.role.value if hasattr(msg.role, "value") else str(msg.role)),
                "content": msg.content,
            }
            for msg in request.messages
        ]

        try:
            stream = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                stream=True,
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            # モデル関連エラー時のフォールバック（ストリーミング）
            if model != "gpt-3.5-turbo":
                try:
                    fallback_model = "gpt-3.5-turbo"
                    stream = await self.client.chat.completions.create(
                        model=fallback_model,
                        messages=messages,
                        temperature=request.temperature,
                        max_tokens=request.max_tokens,
                        stream=True,
                    )
                    async for chunk in stream:
                        if chunk.choices[0].delta.content:
                            yield chunk.choices[0].delta.content
                    return
                except Exception:
                    pass
            raise ValueError(f"OpenAI API error: {str(e)}")
