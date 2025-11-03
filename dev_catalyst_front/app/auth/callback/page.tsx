'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleOAuthCallback } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // URLパラメータを処理
                const result = handleOAuthCallback(searchParams);

                if (result) {
                    setStatus('success');

                    // 成功時は少し待ってからダッシュボードにリダイレクト
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 1500);
                }
            } catch (err) {                setError(err instanceof Error ? err.message : 'Authentication failed');
                setStatus('error');

                // エラー時は少し待ってからログインページにリダイレクト
                setTimeout(() => {
                    router.push('/login?error=' + encodeURIComponent(err instanceof Error ? err.message : 'Authentication failed'));
                }, 3000);
            }
        };

        processCallback();
    }, [searchParams, handleOAuthCallback, router]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                        <div>
                            <h3 className="text-lg font-medium">Authenticating...</h3>
                            <p className="text-gray-600">Please wait while we sign you in</p>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center space-y-4">
                        <div className="h-8 w-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-green-900">Authentication Successful!</h3>
                            <p className="text-green-700">Redirecting to dashboard...</p>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="space-y-4">
                        <Alert variant="destructive">
                            <AlertDescription>
                                {error || 'Authentication failed. Please try again.'}
                            </AlertDescription>
                        </Alert>
                        <div className="text-center">
                            <p className="text-gray-600">Redirecting to login page...</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">DevCatalyst</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Authentication</CardTitle>
                        <CardDescription>
                            Processing your authentication request
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}