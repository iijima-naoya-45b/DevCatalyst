'use client';

import * as React from 'react';
import { Moon, Sun, Stars } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggleAnimated() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);

    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }

    // アニメーション終了後にリセット
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <div className="relative inline-flex h-12 w-24 items-center rounded-full bg-gradient-to-r from-gold/30 to-gold/45 shadow-inner">
        <div className="absolute left-1 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <Sun className="h-5 w-5 gold-soft-text" />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      disabled={isAnimating}
      className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
        isDark
          ? 'bg-gradient-to-r from-slate-800 via-slate-900 to-black shadow-inner'
          : 'bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-300 shadow-sm'
      } ${isAnimating ? 'animate-pulse' : ''}`}
      title={`${isDark ? 'ライト' : 'ダーク'}モードに切り替え`}
    >
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* 昼間の雲 */}
        {!isDark && (
          <>
            <div
              className="absolute top-2 left-3 w-2 h-1 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="absolute top-3 right-4 w-1.5 h-0.5 bg-white/40 rounded-full animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </>
        )}

        {/* 夜の星 */}
        {isDark && (
          <>
            <Stars
              className="absolute top-2 left-3 h-2 w-2 text-yellow-300 animate-pulse"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="absolute top-3 right-5 w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="absolute bottom-3 left-5 w-0.5 h-0.5 bg-blue-200 rounded-full animate-pulse"
              style={{ animationDelay: '1.5s' }}
            />
          </>
        )}
      </div>

      {/* メインのスライドボール */}
      <div
        className={`absolute h-10 w-10 rounded-full shadow-lg transition-all duration-500 transform ${
          isDark ? 'translate-x-13' : 'translate-x-1'
        } flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-900/30'
            : 'bg-gradient-to-br from-white to-gold/20 shadow-[rgba(243,200,106,0.3)]'
        } ${isAnimating ? 'scale-110 rotate-180' : ''}`}
      >
        {isDark ? (
          <Moon
            className={`h-5 w-5 text-slate-300 transition-all duration-300 ${isAnimating ? 'rotate-12' : ''}`}
          />
        ) : (
          <Sun
            className={`h-5 w-5 gold-soft-text transition-all duration-300 ${isAnimating ? 'rotate-90' : ''}`}
          />
        )}
      </div>

      {/* 背景のアイコン */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun
          className={`h-4 w-4 transition-all duration-500 ${!isDark ? 'opacity-0 scale-75' : 'opacity-30 gold-soft-text-light scale-100'}`}
        />
        <Moon
          className={`h-4 w-4 transition-all duration-500 ${isDark ? 'opacity-0 scale-75' : 'opacity-30 text-slate-600 scale-100'}`}
        />
      </div>

      {/* 切り替え時のエフェクト */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping" />
      )}
    </button>
  );
}
