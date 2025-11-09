'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Brain } from 'lucide-react';
import { OAuthButton } from '@/components/auth/oauth-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import type { LoginCredentials } from '@/lib/auth';
import { Header } from "@/(feature)/layouts/Header";
import { Footer } from "@/(feature)/layouts/Footer";

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
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

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

    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string } = {};

        // メールアドレスのバリデーション
        if (!credentials.email) {
            errors.email = 'メールアドレスを入力してください';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            errors.email = '有効なメールアドレスを入力してください';
        }

        // パスワードのバリデーション
        if (!credentials.password) {
            errors.password = 'パスワードを入力してください';
        } else if (credentials.password.length < 6) {
            errors.password = 'パスワードは6文字以上で入力してください';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // バリデーション実行
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await login(credentials);

            if (response.success) {
                const redirectTo = searchParams.get('redirect') || '/dashboard';
                router.push(redirectTo);
            } else {
                setError(response.error || 'ログインに失敗しました。メールアドレスとパスワードを確認してください。');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'ログイン処理中にエラーが発生しました。もう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof LoginCredentials) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setCredentials(prev => ({
            ...prev,
            [field]: value
        }));

        // 入力時にバリデーションエラーをクリア
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }

        // エラーメッセージもクリア
        if (error) {
            setError(null);
        }
    };

    return (
        <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10 xl:px-16 overflow-hidden">
            {/* 背景エフェクト */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-pink-100/10 pointer-events-none dark:from-blue-950/10 dark:via-slate-900/5 dark:to-indigo-950/10 -z-10" />
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-200/10 dark:bg-blue-900/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
            <div className="fixed bottom-0 right-1/4 w-64 h-64 bg-pink-200/10 dark:bg-indigo-950/8 rounded-full blur-2xl animate-pulse-slow -z-10" style={{ animationDelay: '2s' }} />

            {/* テーマ切り替えボタン */}
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-6xl">
                <div className="flex justify-center">
                    <section className="w-full max-w-xl mx-auto space-y-8">
                        <div className="text-center">
                            <div className="mx-auto h-16 w-16 gold-soft-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                <Brain className="w-8 h-8 text-aria-dark-soft" />
                            </div>
                            <h1 className="text-3xl font-serif font-bold gold-soft-text mb-2">
                                devCatalyst
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-lg font-light">おかえりなさい</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">アカウントにログインしてください</p>
                        </div>

                        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-black/80 backdrop-blur-md dark:border dark:border-gold/20">
                            <CardHeader className="text-center pb-8 pt-10">
                                <CardTitle className="text-3xl font-serif text-gray-900 dark:text-white mb-3 tracking-tight">ログイン</CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                    アカウントにアクセス
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 px-8 pb-10">
                                {error && (
                                    <Alert variant="destructive" className="border-red-200 dark:border-red-900">
                                        <AlertDescription className="text-sm">{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* OAuth認証 */}
                                <div className="space-y-3">
                                    <OAuthButton provider="google" />
                                    <OAuthButton provider="github" />
                                </div>

                                {/* 区切り線 */}
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-200 dark:border-slate-700/50" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white dark:bg-black/80 px-6 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">または</span>
                                    </div>
                                </div>

                                {/* メールログイン */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">メールアドレス</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="your@email.com"
                                            value={credentials.email}
                                            onChange={handleInputChange('email')}
                                            required
                                            disabled={loading}
                                            className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationErrors.email ? 'border-red-400 dark:border-red-600' : ''}`}
                                        />
                                        {validationErrors.email && (
                                            <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{validationErrors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">パスワード</Label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                            >
                                                パスワードをお忘れですか？
                                            </Link>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={credentials.password}
                                            onChange={handleInputChange('password')}
                                            required
                                            disabled={loading}
                                            className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationErrors.password ? 'border-red-400 dark:border-red-600' : ''}`}
                                        />
                                        {validationErrors.password && (
                                            <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{validationErrors.password}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 aria-gold-surface font-medium text-sm rounded-lg transition-all duration-300 mt-8"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ログイン中
                                            </>
                                        ) : (
                                            'ログイン'
                                        )}
                                    </Button>
                                </form>

                                <div className="pt-6 border-t border-gray-100 dark:border-slate-800/50 space-y-4">
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                        アカウントをお持ちでない方は{' '}
                                        <Link
                                            href="/register"
                                            className="gold-soft-text dark:gold-soft-text-light font-medium hover:underline transition-colors"
                                        >
                                            新規登録
                                        </Link>
                                    </p>
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                        プロダクトの全体像を確認したい方は{' '}
                                        <Link
                                            href="/"
                                            className="gold-soft-text dark:gold-soft-text-light font-medium hover:underline transition-colors"
                                        >
                                            LPへ戻る
                                        </Link>
                                    </p>
                                </div>

                                <div className="text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                                    <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                                        利用規約
                                    </Link>
                                    <span className="mx-2">·</span>
                                    <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                                        プライバシーポリシー
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </main>
    );
}

function LoginPageFallback() {
    return (
        <main className="flex flex-1 items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
    );
}

export default function LoginPage() {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-slate-950">
            <Header />
            <Suspense fallback={<LoginPageFallback />}>
                <LoginPageContent />
            </Suspense>
            <Footer />
        </div>
    );
}