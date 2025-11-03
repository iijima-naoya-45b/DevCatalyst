'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { OAuthButton } from '@/components/auth/oauth-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import type { LoginCredentials } from '@/lib/auth';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();

    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ページ固有の背景クラスを適用
        document.body.classList.add('auth-page-light');

        // 既にログイン済みの場合はリダイレクト先またはダッシュボードにリダイレクト
        if (isAuthenticated()) {
            const redirectTo = searchParams.get('redirect') || '/dashboard';            router.push(redirectTo);
            return;
        }

        // URLパラメータからエラーを取得
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }

        // クリーンアップ
        return () => {
            document.body.classList.remove('auth-page-light');
        };
    }, [router, searchParams, isAuthenticated]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await login(credentials);

            if (response.success) {
                const redirectTo = searchParams.get('redirect') || '/dashboard';
                router.push(redirectTo);
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof LoginCredentials) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCredentials(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* テーマ切り替えボタン */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <span className="text-white font-bold text-2xl">DC</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DevCatalyst</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">おかえりなさい</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">アカウントにログインしてください</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl text-gray-800 dark:text-white">ログイン</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                            お好みの方法でログインしてください
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* OAuth認証 - メイン */}
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">🚀 かんたんログイン</p>
                            </div>
                            <OAuthButton provider="google" />
                            <OAuthButton provider="github" />
                            {process.env.NODE_ENV === 'development' && (
                                <OAuthButton provider="developer" />
                            )}
                        </div>

                        {/* 区切り線 */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white dark:bg-slate-800 px-4 text-gray-500 dark:text-gray-400 text-sm">または、メールアドレスで</span>
                            </div>
                        </div>

                        {/* メールログイン */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">📧 メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={credentials.email}
                                    onChange={handleInputChange('email')}
                                    required
                                    disabled={loading}
                                    className="h-12 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">🔒 パスワード</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="パスワードを入力してください"
                                    value={credentials.password}
                                    onChange={handleInputChange('password')}
                                    required
                                    disabled={loading}
                                    className="h-12 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ログイン中...
                                    </>
                                ) : (
                                    '📧 メールでログイン'
                                )}
                            </Button>
                        </form>

                        <div className="space-y-4">
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                    🤔 パスワードを忘れた方はこちら
                                </Link>
                            </div>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                                まだアカウントをお持ちでない方は{' '}
                                <Link
                                    href="/register"
                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                >
                                    新規登録
                                </Link>
                            </div>

                            <div className="text-center text-xs text-gray-500 leading-relaxed">
                                ログインすることで、{' '}
                                <Link href="/terms" className="text-blue-600 hover:underline">
                                    利用規約
                                </Link>{' '}
                                および{' '}
                                <Link href="/privacy" className="text-blue-600 hover:underline">
                                    プライバシーポリシー
                                </Link>{' '}
                                に同意したものとみなされます
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}