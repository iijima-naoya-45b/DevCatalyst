from typing import Dict

PLAN_HIERARCHY: Dict[str, int] = {
    "free": 0,
    "standard": 1,
    "premium": 2
}

PROVIDER_REQUIREMENTS: Dict[str, int] = {
    "openai": 0,      # freeプランから利用可能
    "anthropic": 1,   # standardプランから利用可能
}

def check_ai_access(user_plan: str, provider: str) -> bool:
    """ユーザーのプランに基づいてAIプロバイダーへのアクセスをチェック"""
    user_level = PLAN_HIERARCHY.get(user_plan, 0)
    required_level = PROVIDER_REQUIREMENTS.get(provider, 0)
    return user_level >= required_level

def check_plan_access(user_plan: str, required_plan: str) -> bool:
    """プランレベルをチェック"""
    user_level = PLAN_HIERARCHY.get(user_plan, 0)
    required_level = PLAN_HIERARCHY.get(required_plan, 0)
    return user_level >= required_level