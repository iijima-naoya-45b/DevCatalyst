'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setErrors([]);

        try {
            const response = await register(credentials);

            if (response.success) {
                router.push('/dashboard');
            } else {
                setError(response.error || 'Registration failed');
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof RegisterCredentials) => (
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
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <span className="text-white font-bold text-2xl">DC</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DevCatalyst</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">はじめまして</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">無料でアカウントを作成しましょう</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl text-gray-800">新規登録</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            今すぐ無料でアカウントを作成
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* OAuth認証 - メイン */}
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700 mb-4">🚀 かんたん登録</p>
                            </div>
                            <OAuthButton provider="google" />
                            <OAuthButton provider="github" />
                        </div>

                        {/* 区切り線 */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-gray-500 text-sm">または、メールアドレスで登録</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {errors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        <ul className="list-disc list-inside space-y-1">
                                            {errors.map((err, index) => (
                                                <li key={index}>{err}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">👤 お名前</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="山田 太郎"
                                    value={credentials.name}
                                    onChange={handleInputChange('name')}
                                    required
                                    disabled={loading}
                                    className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">📧 メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={credentials.email}
                                    onChange={handleInputChange('email')}
                                    required
                                    disabled={loading}
                                    className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">🔒 パスワード</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="8文字以上のパスワード"
                                    value={credentials.password}
                                    onChange={handleInputChange('password')}
                                    required
                                    disabled={loading}
                                    className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">🔒 パスワード（確認）</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="もう一度パスワードを入力"
                                    value={credentials.password_confirmation}
                                    onChange={handleInputChange('password_confirmation')}
                                    required
                                    disabled={loading}
                                    className="h-12 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        アカウント作成中...
                                    </>
                                ) : (
                                    '🎉 無料でアカウント作成'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 space-y-4">
                            <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                すでにアカウントをお持ちの方は{' '}
                                <Link
                                    href="/login"
                                    className="text-green-600 hover:text-green-800 font-medium hover:underline transition-colors"
                                >
                                    ログイン
                                </Link>
                            </div>

                            <div className="text-center text-xs text-gray-500 leading-relaxed">
                                アカウントを作成することで、{' '}
                                <Link href="/terms" className="text-green-600 hover:underline">
                                    利用規約
                                </Link>{' '}
                                および{' '}
                                <Link href="/privacy" className="text-green-600 hover:underline">
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