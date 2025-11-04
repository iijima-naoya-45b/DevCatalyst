'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import type { RegisterCredentials } from '@/lib/auth';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();

    const [credentials, setCredentials] = useState<RegisterCredentials>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        password_confirmation?: string;
    }>({});

    useEffect(() => {
        // ページ固有の背景クラスを適用
        document.body.classList.add('register-page-light');

        // 既にログイン済みの場合はダッシュボードにリダイレクト
        if (isAuthenticated()) {
            router.push('/dashboard');
        }

        // クリーンアップ
        return () => {
            document.body.classList.remove('register-page-light');
        };
    }, [router]);

    const validateForm = (): boolean => {
        const validationErrors: {
            name?: string;
            email?: string;
            password?: string;
            password_confirmation?: string;
        } = {};

        // 名前のバリデーション
        if (!credentials.name) {
            validationErrors.name = 'お名前を入力してください';
        } else if (credentials.name.length < 2) {
            validationErrors.name = 'お名前は2文字以上で入力してください';
        }

        // メールアドレスのバリデーション
        if (!credentials.email) {
            validationErrors.email = 'メールアドレスを入力してください';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            validationErrors.email = '有効なメールアドレスを入力してください';
        }

        // パスワードのバリデーション
        if (!credentials.password) {
            validationErrors.password = 'パスワードを入力してください';
        } else if (credentials.password.length < 8) {
            validationErrors.password = 'パスワードは8文字以上で入力してください';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(credentials.password)) {
            validationErrors.password = 'パスワードには大文字、小文字、数字を含めてください';
        }

        // パスワード確認のバリデーション
        if (!credentials.password_confirmation) {
            validationErrors.password_confirmation = 'パスワード（確認）を入力してください';
        } else if (credentials.password !== credentials.password_confirmation) {
            validationErrors.password_confirmation = 'パスワードが一致しません';
        }

        setValidationErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
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
        setErrors([]);

        try {
            const response = await register(credentials);

            if (response.success) {
                router.push('/dashboard');
            } else {
                setError(response.error || 'アカウント作成に失敗しました。入力内容を確認してください。');
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        } catch (err) {
            console.error('Register error:', err);
            setError(err instanceof Error ? err.message : 'アカウント作成中にエラーが発生しました。もう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof RegisterCredentials) => (
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
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* 背景エフェクト */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-pink-100/10 pointer-events-none dark:from-blue-950/10 dark:via-slate-900/5 dark:to-indigo-950/10 -z-10" />
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-200/10 dark:bg-blue-900/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
            <div className="fixed bottom-0 right-1/4 w-64 h-64 bg-pink-200/10 dark:bg-indigo-950/8 rounded-full blur-2xl animate-pulse-slow -z-10" style={{ animationDelay: '2s' }} />

            {/* テーマ切り替えボタン */}
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>

            <div className="max-w-xl w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-gold via-gold-light to-bronze rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                        <Brain className="w-8 h-8 text-navy-deepest" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent dark:from-gold dark:via-gold-light dark:to-gold mb-2">
                        devCatalyst
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-light">はじめまして</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">無料でアカウントを作成しましょう</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/95 dark:bg-black/80 backdrop-blur-md dark:border dark:border-gold/20">
                    <CardHeader className="text-center pb-8 pt-10">
                        <CardTitle className="text-3xl font-serif text-gray-900 dark:text-white mb-3 tracking-tight">新規登録</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                            無料でアカウントを作成
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 px-8 pb-10">
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert variant="destructive" className="border-red-200 dark:border-red-900">
                                    <AlertDescription className="text-sm">{error}</AlertDescription>
                                </Alert>
                            )}

                            {errors.length > 0 && (
                                <Alert variant="destructive" className="border-red-200 dark:border-red-900">
                                    <AlertDescription className="text-sm">
                                        <ul className="list-disc list-inside space-y-1">
                                            {errors.map((err, index) => (
                                                <li key={index}>{err}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">お名前</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="山田 太郎"
                                    value={credentials.name}
                                    onChange={handleInputChange('name')}
                                    required
                                    disabled={loading}
                                    className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationErrors.name ? 'border-red-400 dark:border-red-600' : ''}`}
                                />
                                {validationErrors.name && (
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{validationErrors.name}</p>
                                )}
                            </div>

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
                                <Label htmlFor="password" className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">パスワード</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="8文字以上（大文字・小文字・数字を含む）"
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

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">パスワード（確認）</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={credentials.password_confirmation}
                                    onChange={handleInputChange('password_confirmation')}
                                    required
                                    disabled={loading}
                                    className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationErrors.password_confirmation ? 'border-red-400 dark:border-red-600' : ''}`}
                                />
                                {validationErrors.password_confirmation && (
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{validationErrors.password_confirmation}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-gold via-gold-light to-bronze hover:from-gold-light hover:via-gold hover:to-gold text-navy-deepest font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-8"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        アカウント作成中
                                    </>
                                ) : (
                                    'アカウント作成'
                                )}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-gray-100 dark:border-slate-800/50">
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                すでにアカウントをお持ちの方は{' '}
                                <Link
                                    href="/login"
                                    className="text-gold dark:text-gold-light font-medium hover:underline transition-colors"
                                >
                                    ログイン
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
            </div>
        </div>
    );
}