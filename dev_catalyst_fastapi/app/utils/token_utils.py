from typing import Optional


def get_access_token_from_cookies(cookies: dict) -> Optional[str]:
    """Cookieからアクセストークンを取得"""
    return cookies.get("access_token")


def get_refresh_token_from_cookies(cookies: dict) -> Optional[str]:
    """Cookieからリフレッシュトークンを取得"""
    return cookies.get("refresh_token")
