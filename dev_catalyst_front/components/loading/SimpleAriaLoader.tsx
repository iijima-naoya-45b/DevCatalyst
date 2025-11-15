'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'next-themes';
import { Brain, Sparkles } from 'lucide-react';
import '../../app/loader.css';
import { SimpleAriaLoaderProps } from '../types/loading';

const SPARKLE_ANGLES = [0, 60, 120, 180, 240, 300];
const FIRST_VISIT_DURATION = 3000;
const REVISIT_DURATION = 1500;

export function SimpleAriaLoader({ onComplete }: SimpleAriaLoaderProps) {
  const { resolvedTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      setPortalContainer(document.body);
    }
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedLP');
    const duration = hasVisited ? REVISIT_DURATION : FIRST_VISIT_DURATION;
    const progressSpeed = hasVisited ? 4 : 2;

    if (!hasVisited) sessionStorage.setItem('hasVisitedLP', 'true');

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + progressSpeed));
    }, 30);

    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, duration);

    const scrollY = window.scrollY;
    const bodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.documentElement.style.overflow = 'hidden';
    Object.assign(document.body.style, {
      overflow: 'hidden',
      position: 'fixed',
      top: `-${scrollY}px`,
      width: '100%',
    });

    const preventScroll = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      document.documentElement.style.overflow = '';
      Object.assign(document.body.style, bodyStyles);
      window.scrollTo(0, scrollY);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [onComplete]);

  if (!portalContainer) return null;
  if (!isVisible && progress >= 100) return null;

  const getProgressMessage = () => {
    if (progress < 30) return 'アイデアを分析中...';
    if (progress < 60) return '市場を調査中...';
    if (progress < 90) return '戦略を構築中...';
    return 'もうすぐ完了...';
  };

  return createPortal(
    <div
      className="aria-loader-container"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        background: isDark ? 'rgba(2, 6, 23, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
      }}
      data-testid="aria-loader"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-12">
          <div className="relative w-32 h-32 rounded-full gold-soft-gradient flex items-center justify-center shadow-2xl animate-pulse">
            <Brain className="w-16 h-16 text-aria-dark-soft" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-32 h-32 rounded-full border-2 border-gold/30 animate-ping" />
            <div className="absolute w-40 h-40 rounded-full border-2 border-gold/20 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute w-48 h-48 rounded-full border-2 border-gold/10 animate-ping" style={{ animationDelay: '0.6s' }} />
          </div>

          {SPARKLE_ANGLES.map((angle, i) => (
            <div
              key={angle}
              className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
              style={{
                transform: `rotate(${angle}deg) translateY(-80px)`,
                animation: `orbit 3s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <Sparkles className="w-3 h-3 gold-soft-text" />
            </div>
          ))}
        </div>

        <div className="text-center space-y-6 px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold gold-soft-text">
            Aria
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 h-8">
              {[0, 0.15, 0.3].map((delay, i) => (
                <div
                  key={delay}
                  className={`w-3 h-3 rounded-full animate-bounce ${
                    i === 0 ? 'bg-gold' : i === 1 ? 'bg-gold-light' : 'bg-bronze'
                  }`}
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>

            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              思考を整理しています...
            </p>

            <div className={`w-64 h-2 rounded-full mx-auto overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div
                className="h-full gold-soft-gradient transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {getProgressMessage()}
            </p>
          </div>
        </div>
      </div>
    </div>
  , portalContainer);
}


