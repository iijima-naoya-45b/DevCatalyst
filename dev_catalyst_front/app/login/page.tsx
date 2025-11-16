'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Header } from "@/(feature)/layouts/Header";
import { Footer } from "@/(feature)/layouts/Footer";
import { LoginHero } from './components/login-hero';
import { LoginOAuthOptions } from './components/login-oauth-options';
import { LoginFooterLinks } from './components/login-footer-links';
import { LoginLegalLinks } from './components/login-legal-links';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ページ固有の背景クラスを適用
        document.body.classList.add('auth-page-light');

        // 既にログイン済みの場合はリダイレクト先またはダッシュボードにリダイレクト
        if (isAuthenticated()) {
            const redirectTo = searchParams.get('redirect') || '/dashboard'; router.push(redirectTo);
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


    return (
        <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10 xl:px-16 overflow-hidden">
            {/* 背景エフェクト */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-100/10 via-transparent to-pink-100/10 pointer-events-none dark:from-blue-950/10 dark:via-slate-900/5 dark:to-indigo-950/10 -z-10" />
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-200/10 dark:bg-blue-900/5 rounded-full blur-3xl animate-pulse-slow -z-10" />
            <div className="fixed bottom-0 right-1/4 w-64 h-64 bg-pink-200/10 dark:bg-indigo-950/8 rounded-full blur-2xl animate-pulse-slow -z-10" style={{ animationDelay: '2s' }} />
            <div className="w-full max-w-6xl">
                <div className="flex justify-center">
                    <section className="w-full max-w-xl mx-auto space-y-8">
                        <LoginHero />

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
                                <LoginOAuthOptions />

                                <LoginFooterLinks />

                                <LoginLegalLinks />
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