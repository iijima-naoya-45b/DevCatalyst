from typing import AsyncGenerator, List, cast

import openai
from openai.types.chat import ChatCompletion, ChatCompletionMessageParam

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
        messages_raw = [
            {
                "role": (msg.role.value if hasattr(msg.role, "value") else str(msg.role)),
                "content": msg.content,
            }
            for msg in request.messages
        ]
        messages: List[ChatCompletionMessageParam] = cast(
            List[ChatCompletionMessageParam], messages_raw
        )

        try:
            response: ChatCompletion = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                stream=False,
            )

            usage = response.usage
            return ChatResponse(
                message=str(response.choices[0].message.content or ""),
                provider="openai",
                model=model,
                usage=(
                    {
                        "prompt_tokens": usage.prompt_tokens,
                        "completion_tokens": usage.completion_tokens,
                        "total_tokens": usage.total_tokens,
                    }
                    if usage is not None
                    else None
                ),
            )
        except Exception as e:
            # モデル関連エラー時のフォールバック（以前の互換用）
            if model != "gpt-3.5-turbo":
                try:
                    fallback_model = "gpt-3.5-turbo"
                    fallback_response: ChatCompletion = await self.client.chat.completions.create(
                        model=fallback_model,
                        messages=messages,
                        temperature=request.temperature,
                        max_tokens=request.max_tokens,
                        stream=False,
                    )
                    usage = fallback_response.usage
                    return ChatResponse(
                        message=str(fallback_response.choices[0].message.content or ""),
                        provider="openai",
                        model=fallback_model,
                        usage=(
                            {
                                "prompt_tokens": usage.prompt_tokens,
                                "completion_tokens": usage.completion_tokens,
                                "total_tokens": usage.total_tokens,
                            }
                            if usage is not None
                            else None
                        ),
                    )
                except Exception:
                    pass
            raise ValueError(f"OpenAI API error: {str(e)}")

    async def chat_completion_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """OpenAI チャット補完（ストリーミング）"""
        if not self.client:
            raise ValueError("OpenAI API key is not configured")

        model = request.model or "gpt-3.5-turbo"
        messages_raw = [
            {
                "role": (msg.role.value if hasattr(msg.role, "value") else str(msg.role)),
                "content": msg.content,
            }
            for msg in request.messages
        ]
        messages: List[ChatCompletionMessageParam] = cast(
            List[ChatCompletionMessageParam], messages_raw
        )

        candidate_models = [model] + (["gpt-3.5-turbo"] if model != "gpt-3.5-turbo" else [])
        last_error: Exception | None = None

        for candidate in candidate_models:
            try:
                stream = await self.client.chat.completions.create(
                    model=candidate,
                    messages=messages,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                    stream=True,
                )
                # stream は AsyncStream[ChatCompletionChunk]
                async for chunk in stream:
                    # chunk は ChatCompletionChunk を想定
                    content_piece = getattr(chunk.choices[0].delta, "content", None)
                    if content_piece:
                        yield str(content_piece)
                return
            except Exception as e:
                last_error = e
                continue

        raise ValueError(f"OpenAI API error: {str(last_error) if last_error else 'Unknown error'}")
