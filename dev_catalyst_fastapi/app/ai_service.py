import openai
import anthropic
from typing import List, Dict, Any, AsyncGenerator
from .config import settings
from .models import ChatMessage, ChatRequest, ChatResponse, AIProvider

class AIService:
    def __init__(self):
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None

    async def chat_completion(self, request: ChatRequest) -> ChatResponse:
        """AI チャット補完"""
        if request.provider == AIProvider.OPENAI:
            return await self._openai_chat(request)
        elif request.provider == AIProvider.ANTHROPIC:
            return await self._anthropic_chat(request)
        else:
            raise ValueError(f"Unsupported AI provider: {request.provider}")

    async def chat_completion_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """AI チャット補完（ストリーミング）"""
        if request.provider == AIProvider.OPENAI:
            async for chunk in self._openai_chat_stream(request):
                yield chunk
        elif request.provider == AIProvider.ANTHROPIC:
            async for chunk in self._anthropic_chat_stream(request):
                yield chunk
        else:
            raise ValueError(f"Unsupported AI provider: {request.provider}")

    async def _openai_chat(self, request: ChatRequest) -> ChatResponse:
        """OpenAI チャット補完"""
        if not self.openai_client:
            raise ValueError("OpenAI API key is not configured")

        model = request.model or "gpt-3.5-turbo"
        
        messages = [
            {"role": msg.role.value, "content": msg.content}
            for msg in request.messages
        ]

        try:
            response = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                stream=False
            )

            return ChatResponse(
                message=response.choices[0].message.content,
                provider="openai",
                model=model,
                usage={
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            )
        except Exception as e:
            raise ValueError(f"OpenAI API error: {str(e)}")

    async def _openai_chat_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """OpenAI チャット補完（ストリーミング）"""
        if not self.openai_client:
            raise ValueError("OpenAI API key is not configured")

        model = request.model or "gpt-3.5-turbo"
        
        messages = [
            {"role": msg.role.value, "content": msg.content}
            for msg in request.messages
        ]

        try:
            stream = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                stream=True
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            raise ValueError(f"OpenAI API error: {str(e)}")

    async def _anthropic_chat(self, request: ChatRequest) -> ChatResponse:
        """Anthropic チャット補完"""
        if not self.anthropic_client:
            raise ValueError("Anthropic API key is not configured")

        model = request.model or "claude-3-sonnet-20240229"
        
        # Anthropicの場合、systemメッセージを分離
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

        try:
            response = await self.anthropic_client.messages.create(
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

    async def _anthropic_chat_stream(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """Anthropic チャット補完（ストリーミング）"""
        if not self.anthropic_client:
            raise ValueError("Anthropic API key is not configured")

        model = request.model or "claude-3-sonnet-20240229"
        
        # Anthropicの場合、systemメッセージを分離
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

        try:
            async with self.anthropic_client.messages.stream(
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

ai_service = AIService()