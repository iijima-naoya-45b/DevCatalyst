'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home, LogIn, Bug, Loader2 } from 'lucide-react';

interface ErrorInfo {
    title: string;
    message: string;
    description?: string;
    solution?: string;
    technical?: string;
}

function AuthErrorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
        title: '認証エラー',
        message: '認証に失敗しました'
    });
    const [showTechnical, setShowTechnical] = useState(false);

    useEffect(() => {
        const error = searchParams.get('error');
        const message = searchParams.get('message');

        let info: ErrorInfo = {
            title: '認証エラー',
            message: '認証に失敗しました'
        };

        if (message) {
            info.message = decodeURIComponent(message);
        }

        if (error) {
            switch (error) {
                case 'authentication_failed':
                    info = {
                        title: '認証失敗',
                        message: '認証に失敗しました',
                        description: 'OAuth認証プロセス中にエラーが発生しました。',
                        solution: '再度ログインを試すか、別の認証方法をお試しください。',
                        technical: `Error Code: ${error}`
                    };
                    break;
                case 'registration_failed':
                    info = {
                        title: 'ユーザー登録失敗',
                        message: 'ユーザー登録に失敗しました',
                        description: 'アカウントの作成中にエラーが発生しました。',
                        solution: 'メールアドレスが既に使用されている可能性があります。ログインを試すか、別のメールアドレスをお使いください。',
                        technical: `Error Code: ${error}${message ? `, Details: ${decodeURIComponent(message)}` : ''}`
                    };
                    break;
                case 'oauth_configuration_error':
                    info = {
                        title: 'OAuth設定エラー',
                        message: 'OAuth認証の設定に問題があります',
                        description: 'OAuth認証プロバイダーの設定が正しくありません。',
                        solution: '開発者にお問い合わせください。一時的にメールアドレスでのログインをお試しください。',
                        technical: `Error Code: ${error} - OAuth provider configuration issue`
                    };
                    break;
                case 'missing_token':
                    info = {
                        title: 'トークンエラー',
                        message: '認証トークンが見つかりません',
                        description: '認証プロセスが正常に完了しませんでした。',
                        solution: '再度ログインをお試しください。',
                        technical: `Error Code: ${error} - Authentication token missing`
                    };
                    break;
                case 'oauth_failed':
                    info = {
                        title: 'OAuth認証失敗',
                        message: 'OAuth認証に失敗しました',
                        description: '外部認証サービスとの連携中にエラーが発生しました。',
                        solution: 'ブラウザのポップアップブロックを無効にして再試行するか、メールアドレスでのログインをお試しください。',
                        technical: `Error Code: ${error}`
                    };
                    break;
                default:
                    info = {
                        title: '不明なエラー',
                        message: '予期しないエラーが発生しました',
                        description: '詳細不明なエラーが発生しました。',
                        solution: '時間をおいて再度お試しいただくか、サポートにお問い合わせください。',
                        technical: `Error Code: ${error}${message ? `, Message: ${decodeURIComponent(message)}` : ''}`
                    };
            }
        }

        setErrorInfo(info);
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-2xl w-full space-y-6">
                {/* メインエラーカード */}
                <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-gray-900 dark:text-white">
                            {errorInfo.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                            {errorInfo.message}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* エラー詳細 */}
                        {errorInfo.description && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                    <strong>詳細:</strong> {errorInfo.description}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* 解決策 */}
                        {errorInfo.solution && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    解決方法
                                </h3>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    {errorInfo.solution}
                                </p>
                            </div>
                        )}

                        {/* 技術的詳細 */}
                        {errorInfo.technical && (
                            <div className="space-y-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowTechnical(!showTechnical)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <Bug className="h-4 w-4 mr-2" />
                                    {showTechnical ? '技術的詳細を隠す' : '技術的詳細を表示'}
                                </Button>

                                {showTechnical && (
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border">
                                        <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
                                            {errorInfo.technical}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* アクションボタン */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <Button
                                onClick={() => router.push('/login')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                ログインページに戻る
                            </Button>

                            <Button
                                onClick={() => router.push('/')}
                                variant="outline"
                                className="w-full"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                ホームページに戻る
                            </Button>
                        </div>

                        {/* 追加のヘルプ */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                問題が解決しない場合は、以下をお試しください：
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 text-xs">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                >
                                    ページを再読み込み
                                </Button>
                                <span className="text-gray-300 dark:text-gray-600">•</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        // ローカルストレージをクリア
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        router.push('/login');
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                >
                                    キャッシュをクリア
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}