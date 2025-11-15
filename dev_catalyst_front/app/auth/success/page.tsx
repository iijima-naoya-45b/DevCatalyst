'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { SimpleAriaLoader } from '@/components/loading/SimpleAriaLoader';
import { Loader2 } from 'lucide-react';

function AuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleOAuthCallback } = useAuth();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showLoader, setShowLoader] = useState(false);

    const handleLoaderComplete = () => {
        router.push('/dashboard');
    };

    useEffect(() => {
        const processAuth = async () => {
            const invalidParamsMessage =
                'AuthSuccessContent: handleOAuthCallback(searchParams) が成功レスポンスを返しませんでした。引数: ' +
                searchParams.toString();

            try {
                setStatus('processing');

                const result = handleOAuthCallback(searchParams);

                if (result && result.success) {
                    setStatus('success');
                    setTimeout(() => {
                        setShowLoader(true);
                    }, 600);
                    return;
                }

                setStatus('error');
                setShowLoader(false);
                setErrorMessage(invalidParamsMessage);
                setTimeout(() => {
                    router.push('/login?error=' + encodeURIComponent(invalidParamsMessage));
                }, 2000);
            } catch (error) {
                setStatus('error');
                setShowLoader(false);

                const detailedErrorMessage =
                    error instanceof Error
                        ? `AuthSuccessContent: handleOAuthCallback(searchParams) 実行中に例外が発生しました。name=${error.name}, message=${error.message}, params=${searchParams.toString()}`
                        : `AuthSuccessContent: handleOAuthCallback(searchParams) 実行中に不明なエラーが発生しました。params=${searchParams.toString()}`;

                setErrorMessage(detailedErrorMessage);
                setTimeout(() => {
                    router.push('/login?error=' + encodeURIComponent(detailedErrorMessage));
                }, 2000);
            }
        };

        processAuth();
    }, [searchParams, handleOAuthCallback, router]);

    return (
        <>
            {!(status === 'success' && showLoader) && (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                        {status === 'processing' && (
                            <>
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">認証処理中...</h2>
                                <p className="text-gray-600 dark:text-gray-400">しばらくお待ちください</p>
                            </>
                        )}

                        {status === 'success' && !showLoader && (
                            <>
                                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">認証成功！</h2>
                                <p className="text-gray-600 dark:text-gray-400">ダッシュボードに移動しています...</p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">認証エラー</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{errorMessage}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">ログインページに戻ります...</p>
                            </>
                        )}
                    </div>
                </div>
            )}
            {showLoader && <SimpleAriaLoader onComplete={handleLoaderComplete} />}
        </>
    );
}

export default function AuthSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        }>
            <AuthSuccessContent />
        </Suspense>
    );
}