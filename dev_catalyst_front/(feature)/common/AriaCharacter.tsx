'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// 感情状態の型定義
export type EmotionState = 'motivated' | 'anxious' | 'tired' | 'confused' | 'neutral';
export type PsychologyMode = 'gentle' | 'cognitive_restructure' | 'strategic' | 'questioning' | 'default';

// キャラクターの状態
export type CharacterState = {
  emotion: EmotionState;
  psychologyMode: PsychologyMode;
  isThinking: boolean;
  isSpeaking: boolean;
  energyLevel: number; // 0-100（ゲーミフィケーション用）
  lastInteraction: Date | null;
};

interface AriaCharacterProps {
  state: CharacterState;
  className?: string;
  characterVariant?: 'celestia' | 'nocturne' | 'orbit'; // キャラクターのバリアント
}

// 感情状態に応じた画像とスタイルのマッピング
const emotionStyles: Record<EmotionState, { 
  bgColor: string; 
  expression: string; 
  scale: number;
  imageOpacity: number;
  imageFilter: string;
}> = {
  motivated: {
    bgColor: 'from-gold/20 to-amber/10',
    expression: 'happy',
    scale: 1.05,
    imageOpacity: 1.0,
    imageFilter: 'brightness(1.1) saturate(1.2)',
  },
  anxious: {
    bgColor: 'from-blue/20 to-cyan/10',
    expression: 'concerned',
    scale: 0.98,
    imageOpacity: 0.9,
    imageFilter: 'brightness(0.95) saturate(0.9)',
  },
  tired: {
    bgColor: 'from-gray/20 to-slate/10',
    expression: 'gentle',
    scale: 0.95,
    imageOpacity: 0.85,
    imageFilter: 'brightness(0.9) saturate(0.8)',
  },
  confused: {
    bgColor: 'from-purple/20 to-pink/10',
    expression: 'questioning',
    scale: 1.0,
    imageOpacity: 0.95,
    imageFilter: 'brightness(1.0) saturate(1.0)',
  },
  neutral: {
    bgColor: 'from-gold/10 to-amber/5',
    expression: 'neutral',
    scale: 1.0,
    imageOpacity: 1.0,
    imageFilter: 'brightness(1.0) saturate(1.0)',
  },
};

// ChatGPT Imageファイルのマッピング
// 複数の画像を使って表情を切り替える
// 新しい画像を追加する場合は、ここに追加してください
const chatGptImages = {
  // 基本状態
  neutral: '/ChatGPT Image 2025年11月17日 22_44_47.png',
  thinking: '/ChatGPT Image 2025年11月17日 22_51_56.png',
  speaking: '/ChatGPT Image 2025年11月17日 22_59_17.png',
  
  // 感情状態（必要に応じて追加）
  // motivated: '/ChatGPT Image 2025年11月17日 XX_XX_XX.png', // 明るい表情
  // tired: '/ChatGPT Image 2025年11月17日 XX_XX_XX.png', // 疲れた表情
  // anxious: '/ChatGPT Image 2025年11月17日 XX_XX_XX.png', // 不安な表情
  // confused: '/ChatGPT Image 2025年11月17日 XX_XX_XX.png', // 混乱した表情
};

// 感情状態に応じた画像マッピング（拡張可能）
// 感情状態ごとに異なる画像を指定できます
const emotionImageMap: Partial<Record<EmotionState, keyof typeof chatGptImages>> = {
  // 例: 感情状態に応じた画像を指定
  // motivated: 'motivated', // chatGptImages.motivated を使用
  // tired: 'tired', // chatGptImages.tired を使用
  // anxious: 'anxious', // chatGptImages.anxious を使用
  // 指定がない場合は neutral を使用
};

// キャラクターバリアントに応じた画像パス（フォールバック用）
const characterImages = {
  celestia: '/aria-celestia.png',
  nocturne: '/aria-nocturne.png',
  orbit: '/aria-orbit.png',
};

// 感情状態と動作状態に応じた表情画像を取得
const getExpressionImage = (
  characterVariant: 'celestia' | 'nocturne' | 'orbit',
  emotion: EmotionState,
  isThinking: boolean,
  isSpeaking: boolean
): string => {
  // 優先順位: speaking > thinking > 感情状態 > neutral
  
  // 1. 話している時
  if (isSpeaking) {
    return chatGptImages.speaking;
  }
  
  // 2. 考え中
  if (isThinking) {
    return chatGptImages.thinking;
  }
  
  // 3. 感情状態に応じた画像（emotionImageMapで指定されている場合）
  const emotionImageKey = emotionImageMap[emotion];
  if (emotionImageKey && chatGptImages[emotionImageKey]) {
    return chatGptImages[emotionImageKey];
  }
  
  // 4. デフォルト（neutral）
  return chatGptImages.neutral;
};

export function AriaCharacter({ 
  state, 
  className = '',
  characterVariant = 'celestia'
}: AriaCharacterProps) {
  const [randomAction, setRandomAction] = useState<string | null>(null);
  const randomActionTimer = useRef<NodeJS.Timeout | null>(null);
  const breathingAnimation = useRef<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previousEmotion, setPreviousEmotion] = useState<EmotionState>(state.emotion);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const emotionStyle = emotionStyles[state.emotion] || emotionStyles.neutral;
  const characterImage = getExpressionImage(
    characterVariant,
    state.emotion,
    state.isThinking,
    state.isSpeaking
  );
  
  // 画像のプリロード（スムーズな切り替えのため）
  useEffect(() => {
    const imagesToPreload = Object.values(chatGptImages);
    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // 感情状態が変わった時にトランジションを開始
  useEffect(() => {
    if (previousEmotion !== state.emotion) {
      setIsTransitioning(true);
      setTimeout(() => {
        setPreviousEmotion(state.emotion);
        setIsTransitioning(false);
      }, 300);
    }
  }, [state.emotion, previousEmotion]);

  // 微細なランダム行動（5-15秒間隔）
  useEffect(() => {
    const scheduleRandomAction = () => {
      const delay = 5000 + Math.random() * 10000; // 5-15秒
      randomActionTimer.current = setTimeout(() => {
        const actions = ['stretch', 'blink', 'lookAround', 'weightShift'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        setRandomAction(action);
        setTimeout(() => setRandomAction(null), 2000); // 2秒でリセット
        scheduleRandomAction(); // 次のランダム行動をスケジュール
      }, delay);
    };

    scheduleRandomAction();

    return () => {
      if (randomActionTimer.current) {
        clearTimeout(randomActionTimer.current);
      }
    };
  }, []);

  // 微呼吸アニメーション（常時動作）
  useEffect(() => {
    const breathing = () => {
      breathingAnimation.current = requestAnimationFrame(breathing);
    };
    breathingAnimation.current = requestAnimationFrame(breathing);

    return () => {
      if (breathingAnimation.current) {
        cancelAnimationFrame(breathingAnimation.current);
      }
    };
  }, []);

  // 瞬きアニメーション（3-7秒間隔）
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(blinkInterval);
  }, []);


  return (
    <div className={`relative ${className}`}>
      {/* 背景グラデーション（感情状態に応じて変化） */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${emotionStyle.bgColor} opacity-30 transition-all duration-500 ${
          state.isThinking ? 'opacity-40' : 'opacity-30'
        }`}
        style={{ transform: `scale(${emotionStyle.scale})` }}
      />

      {/* キャラクター本体 */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* 立ち絵画像（円形） */}
        <div
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden"
          style={{
            transform: `scale(${emotionStyle.scale})`,
            filter: emotionStyle.imageFilter,
            opacity: emotionStyle.imageOpacity,
          }}
        >
          {/* 画像の読み込み状態管理 */}
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {/* 複数画像の切り替え（フェードイン・アウト） */}
            {Object.entries(chatGptImages).map(([key, src]) => {
              // アクティブな画像を決定（優先順位: speaking > thinking > 感情状態 > neutral）
              const emotionImageKey = emotionImageMap[state.emotion];
              const isActive = 
                (key === 'speaking' && state.isSpeaking) ||
                (key === 'thinking' && state.isThinking && !state.isSpeaking) ||
                (key === emotionImageKey && !state.isThinking && !state.isSpeaking) ||
                (key === 'neutral' && !state.isThinking && !state.isSpeaking && !emotionImageKey);
              
              return (
                <Image
                  key={key}
                  src={src}
                  alt={`Aria ${key}`}
                  fill
                  className={`transition-opacity duration-500 ease-in-out absolute inset-0 rounded-full ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center 20%', // 顔を上に配置（20%上から）
                  }}
                  onLoad={() => {
                    if (isActive && !imageLoaded) {
                      setImageLoaded(true);
                    }
                  }}
                  priority={isActive && key === 'neutral'} // 最初はneutralを優先読み込み
                  sizes="(max-width: 768px) 192px, 224px"
                />
              );
            })}
            
            {/* 読み込み中のプレースホルダー（最初の1回のみ） */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/30 to-amber/20 rounded-full animate-pulse z-0">
                <div className="w-16 h-16 rounded-full bg-gold/40 border-2 border-gold/60" />
              </div>
            )}

            {/* 瞬きエフェクト（画像の上にオーバーレイ） */}
            {isBlinking && (
              <div className="absolute inset-0 bg-white/20 animate-[blink_0.15s_ease-in-out]" />
            )}

            {/* 話している時の口元エフェクト（円形の外側に表示） */}
            {state.isSpeaking && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-gold/40 rounded-full animate-[speaking_0.5s_ease-in-out_infinite] blur-sm -mb-2" />
            )}

            {/* 考え中のエフェクト */}
            {state.isThinking && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>

          {/* 感情状態インジケーター（画像の上に表示） */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            {state.emotion === 'tired' && (
              <div className="text-2xl opacity-70 animate-[fadeIn_0.3s_ease-in-out]">😌</div>
            )}
            {state.emotion === 'motivated' && (
              <div className="text-2xl opacity-70 animate-[fadeIn_0.3s_ease-in-out]">✨</div>
            )}
            {state.emotion === 'anxious' && (
              <div className="text-2xl opacity-70 animate-[fadeIn_0.3s_ease-in-out]">💭</div>
            )}
            {state.emotion === 'confused' && (
              <div className="text-2xl opacity-70 animate-[fadeIn_0.3s_ease-in-out]">🤔</div>
            )}
          </div>
        </div>

        {/* 元気レベルインジケーター（ゲーミフィケーション） */}
        {state.energyLevel > 0 && (
          <div className="mt-4 w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
            <div
              className="h-full bg-gradient-to-r from-gold to-amber rounded-full transition-all duration-500"
              style={{ width: `${state.energyLevel}%` }}
            />
          </div>
        )}

      </div>

      {/* タスク完了時の花火エフェクト */}
      {state.energyLevel > 80 && (
        <div className="absolute inset-0 pointer-events-none animate-[fireworks_2s_ease-in-out]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gold rounded-full"
              style={{
                left: `${50 + (Math.random() - 0.5) * 100}%`,
                top: `${50 + (Math.random() - 0.5) * 100}%`,
                animation: `fireworkParticle 1.5s ease-in-out ${i * 0.1}s forwards`,
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}

