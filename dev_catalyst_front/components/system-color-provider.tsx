'use client';

import * as React from 'react';

export function SystemColorProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // システムアクセントカラーを検出して適用
    const updateSystemColors = () => {
      if (
        typeof window !== 'undefined' &&
        'CSS' in window &&
        CSS.supports('color', 'AccentColor')
      ) {
        // システムカラーがサポートされている場合は何もしない（CSSで処理）
        return;
      }

      // フォールバック: getComputedStyleでシステムカラーを取得
      const testElement = document.createElement('div');
      testElement.style.color = 'AccentColor';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const accentColor = computedStyle.color;

      if (accentColor && accentColor !== 'AccentColor') {
        document.documentElement.style.setProperty('--fallback-accent', accentColor);
      }

      document.body.removeChild(testElement);
    };

    // 初期化
    updateSystemColors();

    // テーマ変更時にも更新
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateSystemColors);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemColors);
    };
  }, []);

  return <>{children}</>;
}
