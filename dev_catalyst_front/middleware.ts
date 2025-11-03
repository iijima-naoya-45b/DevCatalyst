import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証が必要なパス
const protectedPaths = [
    '/dashboard',
    '/advisor',
    '/target',
    '/strategy',
    '/settings',
    '/analysis',
    '/chat',
    '/profile'
]

// 認証済みユーザーがアクセスできないパス（ログイン後は不要なページ）
const authPaths = [
    '/login',
    '/register',
    '/forgot-password'
]

// 公開パス（認証不要）
const publicPaths = [
    '/',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/pricing',
    '/auth/callback',  // OAuth認証コールバック
    '/auth/success',   // OAuth認証成功
    '/auth/error'      // OAuth認証エラー
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 静的ファイルやAPIルートはスキップ
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next()
    }



    // OAuth認証関連のパスは常に許可
    if (pathname.startsWith('/auth/')) {
        return NextResponse.next()
    }

    // 公開パスは常に許可
    if (publicPaths.some(path => pathname === path)) {
        return NextResponse.next()
    }

    // 認証状態をチェック
    const isAuthenticated = checkAuthStatus(request)

    // 保護されたパスへのアクセス
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!isAuthenticated) {            // 未認証の場合、ログインページにリダイレクト
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // 認証済みユーザーが認証ページにアクセスした場合
    if (authPaths.some(path => pathname.startsWith(path))) {
        if (isAuthenticated) {            // 認証済みの場合、ダッシュボードにリダイレクト
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

// 認証状態チェック関数
function checkAuthStatus(request: NextRequest): boolean {
    // JWTトークンをCookieまたはAuthorizationヘッダーから取得
    const authToken = request.cookies.get('auth_token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '')

    // トークンが存在するかチェック（簡易実装）
    // 実際の実装では、JWTの検証やexpiration checkを行う
    if (authToken && authToken !== 'undefined' && authToken.length > 10) {
        return true
    }

    return false
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}