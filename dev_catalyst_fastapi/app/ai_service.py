from typing import AsyncGenerator

from .models import AIProvider, ChatRequest, ChatResponse, ChatMessage, ChatRole
from .services.anthropic_service import AnthropicService
from .services.openai_service import OpenAIService
from .prompts.aria_multi_layer import get_prompt_for_mode, detect_emotion_state, detect_burnout_risk


class AIService:
    def __init__(self):
        self.openai_service = OpenAIService()
        self.anthropic_service = AnthropicService()

    def _enhance_request_with_mode(self, request: ChatRequest) -> ChatRequest:
        """モードに応じてシステムプロンプトを注入"""
        if not request.mode:
            # デフォルトは統合モード
            request.mode = "integrated"
        
        # システムプロンプトを取得
        system_prompt = get_prompt_for_mode(request.mode)
        
        # 統合モードまたはマイクロコーチモードの場合、感情状態と挫折リスクも検出
        if request.mode in ("integrated", "micro_coach") and request.messages:
            last_user_message = next(
                (msg.content for msg in reversed(request.messages) if msg.role == ChatRole.USER),
                ""
            )
            if last_user_message:
                emotion_state = detect_emotion_state(last_user_message)
                burnout_risk = detect_burnout_risk(last_user_message)
                # メタデータに感情状態と挫折リスクを追加
                if request.metadata is None:
                    request.metadata = {}
                request.metadata["emotion_state"] = emotion_state
                request.metadata["burnout_risk"] = burnout_risk
        
        # システムメッセージが既に存在するかチェック
        has_system = any(msg.role == ChatRole.SYSTEM for msg in request.messages)
        
        if not has_system:
            # システムメッセージを先頭に追加
            system_message = ChatMessage(role=ChatRole.SYSTEM, content=system_prompt)
            request.messages = [system_message] + request.messages
        
        return request

    async def chat_completion(self, request: ChatRequest) -> ChatResponse:
        """AI チャット補完"""
        # モードに応じてシステムプロンプトを注入
        request = self._enhance_request_with_mode(request)
        
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
        # モードに応じてシステムプロンプトを注入
        request = self._enhance_request_with_mode(request)
        
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
