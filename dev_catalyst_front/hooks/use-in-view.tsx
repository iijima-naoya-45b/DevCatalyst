import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options;
  const ref = useRef<HTMLDivElement>(null);
  
  // グローバルフラグをチェック
  const skipAnimation = typeof window !== 'undefined' && (window as any).lpSkipAnimation === true;
  const [isInView, setIsInView] = useState(skipAnimation);
  const hasBeenInView = useRef(skipAnimation);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // アニメーションスキップ時は即座に表示
    if (skipAnimation) {
      setIsInView(true);
      hasBeenInView.current = true;
      return;
    }

    // 初回チェック: すでに画面内にある要素は即座に表示
    const checkInitialPosition = () => {
      if (hasBeenInView.current && triggerOnce) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isCurrentlyInView = 
        rect.top < windowHeight &&
        rect.bottom > 0;
      
      if (isCurrentlyInView) {
        setIsInView(true);
        hasBeenInView.current = true;
      }
    };

    // 初回チェック
    checkInitialPosition();
    const initialCheckTimer = setTimeout(checkInitialPosition, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          hasBeenInView.current = true;
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      clearTimeout(initialCheckTimer);
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, triggerOnce, rootMargin, skipAnimation]);

  return { ref, isInView };
}

