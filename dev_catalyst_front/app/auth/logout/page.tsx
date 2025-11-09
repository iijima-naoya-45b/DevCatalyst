'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { SimpleAriaLoader } from '@/components/loading/SimpleAriaLoader';
import { Header } from '@/(feature)/layouts/Header';
import { Footer } from '@/(feature)/layouts/Footer';

function LogoutContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const hasTriggered = useRef(false);
  const errorMessageRef = useRef<string | null>(null);
  const [logoutStatus, setLogoutStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const executeLogout = async () => {
      try {
        setLogoutStatus('pending');
        await logout();
        setLogoutStatus('success');
      } catch (error) {
        const message =
          error instanceof Error
            ? `LogoutContent: logout() 実行中に例外が発生しました。name=${error.name}, message=${error.message}`
            : 'LogoutContent: logout() 実行中に不明なエラーが発生しました。';
        errorMessageRef.current = message;
        setLogoutStatus('error');
      }
    };

    executeLogout();
  }, [logout]);

  const handleLoaderComplete = () => {
    const storedMessage = errorMessageRef.current;
    if (storedMessage) {
      router.replace(`/login?error=${encodeURIComponent(storedMessage)}`);
      return;
    }
    router.replace('/login');
  };

  return (
    <>
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-16 overflow-hidden">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 dark:border-gray-700/60 max-w-md mx-auto">
          <div className="mb-6 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin gold-soft-text" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3">ログアウト処理中...</h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Ariaがセッションを終了しています。完了までこのままお待ちください。
          </p>

          {logoutStatus === 'error' && errorMessageRef.current && (
            <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300 text-left">
              <p className="text-sm font-semibold">エラー詳細</p>
              <p className="text-xs mt-1 break-words leading-relaxed">{errorMessageRef.current}</p>
            </div>
          )}
        </div>
      </main>
      <SimpleAriaLoader onComplete={handleLoaderComplete} />
    </>
  );
}

function LogoutFallback() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-16">
      <Loader2 className="h-12 w-12 animate-spin gold-soft-text" />
    </main>
  );
}

export default function LogoutPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-slate-950">
      <Header />
      <Suspense fallback={<LogoutFallback />}>
        <LogoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}

