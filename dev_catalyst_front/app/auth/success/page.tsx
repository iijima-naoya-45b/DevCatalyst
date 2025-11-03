'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

function AuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handleOAuthCallback } = useAuth();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const processAuth = async () => {
            try {                setStatus('processing');
                
                const result = handleOAuthCallback(searchParams);
                
                if (result && result.success) {                    setStatus('success');
                    
                    // すぐにリダイレクト（待ち時間を短縮）
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 500);
                } else {                    setStatus('error');
                    setErrorMessage('認証データが不完全です');
                    setTimeout(() => {
                        router.push('/login?error=' + encodeURIComponent('認証データが不完全です'));
                    }, 2000);
                }
            } catch (error) {                const errorMsg = error instanceof Error ? error.message : '認証処理中にエラーが発生しました';
                setStatus('error');
                setErrorMessage(errorMsg);
                setTimeout(() => {
                    router.push('/login?error=' + encodeURIComponent(errorMsg));
                }, 2000);
            }
        };

        processAuth();
    }, [searchParams, handleOAuthCallback, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                {status === 'processing' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">認証処理中...</h2>
                        <p className="text-gray-600 dark:text-gray-400">しばらくお待ちください</p>
                    </>
                )}
                
                {status === 'success' && (
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