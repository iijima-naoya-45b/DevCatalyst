'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { EmotionState, PsychologyMode, CharacterState } from './AriaCharacter';

interface AriaAnimationControllerProps {
  userMessage: string | null;
  isStreaming: boolean;
  isThinking: boolean;
  onStateChange?: (state: CharacterState) => void;
}

/**
 * AriaAnimationController
 * ユーザーのメッセージから感情状態を検出し、キャラクターの状態を管理
 */
export function useAriaAnimationController({
  userMessage,
  isStreaming,
  isThinking,
  onStateChange,
}: AriaAnimationControllerProps) {
  const [characterState, setCharacterState] = useState<CharacterState>({
    emotion: 'neutral',
    psychologyMode: 'default',
    isThinking: false,
    isSpeaking: false,
    energyLevel: 50, // 初期値
    lastInteraction: null,
  });

  const energyLevelRef = useRef(50);
  const taskCompletionCountRef = useRef(0);

  // ユーザーメッセージから感情状態を検出
  const detectEmotion = useCallback((message: string): EmotionState => {
    const messageLower = message.toLowerCase();

    // モチベーション低下のキーワード
    const tiredKeywords = ['疲れた', 'やる気', 'できない', '無理', '諦め', 'だめ', '失敗', 'つらい', 'きつい'];
    if (tiredKeywords.some((kw) => messageLower.includes(kw))) {
      return 'tired';
    }

    // 不安・焦りのキーワード
    const anxiousKeywords = ['不安', '焦る', '心配', 'どうしよう', '困った', '急いで', '時間がない', '間に合わない'];
    if (anxiousKeywords.some((kw) => messageLower.includes(kw))) {
      return 'anxious';
    }

    // 前向きのキーワード
    const motivatedKeywords = ['やる', '進める', '頑張る', 'できる', '挑戦', '目標', '計画', 'やった', '成功'];
    if (motivatedKeywords.some((kw) => messageLower.includes(kw))) {
      return 'motivated';
    }

    // 混乱・不明のキーワード
    const confusedKeywords = ['わからない', 'どうすれば', '教えて', '何を', 'どれ', 'どちら', '迷ってる'];
    if (confusedKeywords.some((kw) => messageLower.includes(kw))) {
      return 'confused';
    }

    return 'neutral';
  }, []);

  // 感情状態から心理学モードを決定
  const determinePsychologyMode = useCallback((emotion: EmotionState): PsychologyMode => {
    const modeMap: Record<EmotionState, PsychologyMode> = {
      tired: 'gentle',
      anxious: 'cognitive_restructure',
      motivated: 'strategic',
      confused: 'questioning',
      neutral: 'default',
    };
    return modeMap[emotion];
  }, []);

  // ユーザーメッセージが変更されたら感情状態を更新
  useEffect(() => {
    if (userMessage) {
      const emotion = detectEmotion(userMessage);
      const psychologyMode = determinePsychologyMode(emotion);

      setCharacterState((prev) => ({
        ...prev,
        emotion,
        psychologyMode,
        lastInteraction: new Date(),
      }));
    }
  }, [userMessage, detectEmotion, determinePsychologyMode]);

  // ストリーミング状態を反映
  useEffect(() => {
    setCharacterState((prev) => ({
      ...prev,
      isSpeaking: isStreaming,
      isThinking: isThinking,
    }));
  }, [isStreaming, isThinking]);

  // タスク完了時に元気レベルを増加（ゲーミフィケーション）
  const incrementEnergyLevel = useCallback((amount: number = 5) => {
    energyLevelRef.current = Math.min(100, energyLevelRef.current + amount);
    taskCompletionCountRef.current += 1;

    setCharacterState((prev) => ({
      ...prev,
      energyLevel: energyLevelRef.current,
    }));

    // 元気レベルが高い時は花火エフェクトを表示（AriaCharacter側で処理）
  }, []);

  // 時間経過で元気レベルを少し減少（自然な減衰）
  useEffect(() => {
    const interval = setInterval(() => {
      if (energyLevelRef.current > 30) {
        // 30以下には下がらない（最低限の元気を維持）
        energyLevelRef.current = Math.max(30, energyLevelRef.current - 0.1);
        setCharacterState((prev) => ({
          ...prev,
          energyLevel: energyLevelRef.current,
        }));
      }
    }, 60000); // 1分ごと

    return () => clearInterval(interval);
  }, []);

  // 状態変更を親コンポーネントに通知
  useEffect(() => {
    if (onStateChange) {
      onStateChange(characterState);
    }
  }, [characterState, onStateChange]);

  return {
    characterState,
    incrementEnergyLevel,
    taskCompletionCount: taskCompletionCountRef.current,
  };
}

