'use client';

import { Brain } from 'lucide-react';
import { LoadingProps, LoadingMessageProps } from './types/loading';

export function Loading({
  message = '読み込み中...',
  size = 'md',
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen bg-background flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center space-y-4">
        {/* ロゴアニメーション */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-gold via-gold-light to-bronze rounded-xl flex items-center justify-center shadow-xl animate-pulse">
            <Brain className="w-8 h-8 text-navy-deepest" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-gold/20 to-bronze/20 rounded-xl blur animate-ping" />
        </div>

        {/* スピナー */}
        <div
          className={`${sizeClasses[size]} border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto`}
        />

        {/* メッセージ */}
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}

// 認証用のローディング
export function AuthLoading() {
  return <Loading message="認証情報を確認しています..." fullScreen />;
}

// ページローディング
export function PageLoading({ message }: LoadingMessageProps) {
  return <Loading message={message || 'ページを読み込んでいます...'} size="lg" fullScreen />;
}

// インラインローディング
export function InlineLoading({ message }: LoadingMessageProps) {
  return <Loading message={message || '処理中...'} size="sm" />;
}
