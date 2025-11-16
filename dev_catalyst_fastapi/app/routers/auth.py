from fastapi import APIRouter, Depends, HTTPException, Request, Response

from ..auth import AuthResponse, auth_service, get_current_user, get_optional_user
from ..models import AuthTokens, User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me")
async def get_current_user_info(current_user: AuthResponse = Depends(get_current_user)):
    """現在のユーザー情報を取得"""
    return {"user": current_user.user, "tokens": current_user.tokens}


@router.post("/refresh")
async def refresh_access_token(request: Request, response: Response):
    """リフレッシュトークンを使用してアクセストークンを更新"""
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="リフレッシュトークンが見つかりません")

    auth_response = await auth_service.refresh_token(refresh_token)

    if not auth_response:
        raise HTTPException(status_code=401, detail="リフレッシュトークンが無効です")

    # 新しいトークンをCookieに設定
    response.set_cookie(
        key="access_token",
        value=auth_response.tokens.access_token,
        httponly=True,
        secure=False,  # 開発環境ではFalse
        samesite="lax",
        max_age=auth_response.tokens.expires_in,
    )

    if auth_response.tokens.refresh_token:
        response.set_cookie(
            key="refresh_token",
            value=auth_response.tokens.refresh_token,
            httponly=True,
            secure=False,  # 開発環境ではFalse
            samesite="lax",
            max_age=7 * 24 * 60 * 60,  # 7日間
        )

    return {
        "user": auth_response.user,
        "tokens": auth_response.tokens,
        "message": "トークンが更新されました",
    }


@router.post("/logout")
async def logout(response: Response, current_user: AuthResponse = Depends(get_optional_user)):
    """ログアウト"""
    # Cookieを削除
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")

    return {"message": "ログアウトしました"}


@router.get("/check")
async def check_auth_status(current_user: AuthResponse = Depends(get_optional_user)):
    """認証状態をチェック"""
    if current_user:
        return {
            "authenticated": True,
            "user": current_user.user,
            "expires_in": current_user.tokens.expires_in,
        }
    else:
        return {"authenticated": False, "user": None, "expires_in": None}
