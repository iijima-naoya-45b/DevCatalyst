from typing import Optional

import httpx
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from .config import settings
from .models import AuthResponse, AuthTokens, User

security = HTTPBearer(auto_error=False)


class AuthService:
    def __init__(self):
        self.rails_backend_url = settings.RAILS_BACKEND_URL
        self.jwt_secret = settings.JWT_SECRET_KEY
        self.jwt_algorithm = settings.JWT_ALGORITHM

    async def verify_token_with_rails(self, token: str) -> Optional[AuthResponse]:
        """Railsバックエンドでトークンを検証"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.rails_backend_url}/api/auth/verify_token",
                    json={"token": token},
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code == 200:
                    data = response.json()
                    return AuthResponse(
                        user=User(**data["user"]),
                        tokens=AuthTokens(access_token=token, expires_in=data.get("expires_in")),
                        valid=True,
                    )
                return None
        except Exception as e:
            print(f"Token verification error: {e}")
            return None

    async def refresh_token(self, refresh_token: str) -> Optional[AuthResponse]:
        """リフレッシュトークンで新しいアクセストークンを取得"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.rails_backend_url}/api/auth/refresh",
                    json={"refresh_token": refresh_token},
                )

                if response.status_code == 200:
                    data = response.json()
                    return AuthResponse(
                        user=User(**data["user"]), tokens=AuthTokens(**data["tokens"]), valid=True
                    )
                return None
        except Exception as e:
            print(f"Token refresh error: {e}")
            return None

    def decode_jwt_token(self, token: str) -> Optional[dict]:
        """JWTトークンをデコード（ローカル検証用）"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.jwt_algorithm])
            return payload
        except JWTError:
            return None


auth_service = AuthService()


async def get_current_user(
    request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> AuthResponse:
    """現在のユーザーを取得（認証チェック付き）"""

    # Authorizationヘッダーからトークンを取得
    token = None
    if credentials:
        token = credentials.credentials

    # Cookieからトークンを取得（フォールバック）
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401, detail="認証トークンが見つかりません。ログインしてください。"
        )

    # Railsバックエンドでトークンを検証
    auth_response = await auth_service.verify_token_with_rails(token)

    if not auth_response:
        # トークンが無効な場合、リフレッシュトークンを試す
        refresh_token = request.cookies.get("refresh_token")
        if refresh_token:
            auth_response = await auth_service.refresh_token(refresh_token)
            if auth_response:
                return auth_response

        raise HTTPException(
            status_code=401, detail="認証トークンが無効です。再度ログインしてください。"
        )

    return auth_response


async def get_optional_user(
    request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[AuthResponse]:
    """オプショナルなユーザー取得（認証が必須でない場合）"""
    try:
        return await get_current_user(request, credentials)
    except HTTPException:
        return None
