'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Brain, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/contexts/auth-context';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { forgotPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState<string | undefined>();

    useEffect(() => {
        document.body.classList.add('auth-page-light');

        return () => {
            document.body.classList.remove('auth-page-light');
        };
    }, []);

    const validateEmail = (): boolean => {
        if (!email) {
            setValidationError('メールアドレスを入力してください');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setValidationError('有効なメールアドレスを入力してください');
            return false;
        }
        setValidationError(undefined);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!validateEmail()) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await forgotPassword({ email });

            if (response.success) {
                setSuccess(true);
                setEmail('');
            } else {
                setError(response.error || 'パスワードリセットメールの送信に失敗しました。');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err instanceof Error ? err.message : 'エラーが発生しました。もう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (validationError) {
            setValidationError(undefined);
        }
        if (error) {
            setError(null);
        }
        if (success) {
            setSuccess(false);
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
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-light">パスワードをお忘れの方</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">パスワードリセット用のメールをお送りします</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/95 dark:bg-black/80 backdrop-blur-md dark:border dark:border-gold/20">
                    <CardHeader className="text-center pb-8 pt-10">
                        <CardTitle className="text-3xl font-serif text-gray-900 dark:text-white mb-3 tracking-tight">パスワードリセット</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                            登録されているメールアドレスを入力してください
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-10">
                        {success && (
                            <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                                    パスワードリセット用のメールを送信しました。メールボックスをご確認ください。
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive" className="border-red-200 dark:border-red-900">
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                    className={`h-11 text-sm border-gray-200 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-gray-100 focus:border-gold dark:focus:border-gold/50 focus:ring-1 focus:ring-gold dark:focus:ring-gold/50 transition-all ${validationError ? 'border-red-400 dark:border-red-600' : ''}`}
                                />
                                {validationError && (
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">{validationError}</p>
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
                                        送信中
                                    </>
                                ) : (
                                    'リセットメールを送信'
                                )}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-gray-100 dark:border-slate-800/50 space-y-4">
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                パスワードを思い出した方は{' '}
                                <Link
                                    href="/login"
                                    className="text-gold dark:text-gold-light font-medium hover:underline transition-colors"
                                >
                                    ログイン
                                </Link>
                            </p>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                アカウントをお持ちでない方は{' '}
                                <Link
                                    href="/register"
                                    className="text-gold dark:text-gold-light font-medium hover:underline transition-colors"
                                >
                                    新規登録
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

