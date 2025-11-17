'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, Clock, Zap, Target, Sparkles, TrendingUp } from 'lucide-react';
import { AriaCharacter, type CharacterState } from './AriaCharacter';

// マイクロコーチの型定義
export interface MicroCoachTask {
  title: string;
  description: string;
  duration: string;
  reason: string;
  choices?: string[];
  one_click_action?: string;
}

export interface ImmediateStep {
  step: number;
  action: string;
  duration: string;
}

export interface MicroCoachData {
  today_task: MicroCoachTask;
  immediate_steps: ImmediateStep[];
  positive_feedback: string;
  next_step_auto_generate: boolean;
}

export interface MicroCoachProps {
  microCoach: MicroCoachData;
  emotionState: 'motivated' | 'anxious' | 'tired' | 'confused' | 'neutral';
  burnoutRisk: 'low' | 'medium' | 'high';
  characterState: CharacterState;
  onTaskComplete?: () => void;
  onNextStep?: () => void;
}

export function MicroCoach({
  microCoach,
  emotionState,
  burnoutRisk,
  characterState,
  onTaskComplete,
  onNextStep,
}: MicroCoachProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
      
      // 全てのステップが完了したらタスク完了
      if (completedSteps.length + 1 === microCoach.immediate_steps.length) {
        setTaskCompleted(true);
        if (onTaskComplete) {
          onTaskComplete();
        }
      }
    }
  };

  const handleOneClickAction = () => {
    // ワンクリックアクションを実行
    if (microCoach.today_task.one_click_action) {
      // ここで実際のアクションを実行（例: 外部リンクを開く、フォームを表示するなど）
      console.log('One-click action:', microCoach.today_task.one_click_action);
    }
    
    // 最初のステップを自動完了
    if (microCoach.immediate_steps.length > 0) {
      handleStepComplete(1);
    }
  };

  // 挫折リスクに応じたバッジの色
  const getBurnoutRiskColor = () => {
    switch (burnoutRisk) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* 今日の3分行動カード */}
      <Card className="border border-gold/25 dark:border-gold/25 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-md shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold gold-soft-text flex items-center gap-2">
              <Target className="w-5 h-5" />
              今日の3分行動
            </CardTitle>
            <Badge className={getBurnoutRiskColor()}>
              {burnoutRisk === 'high' ? '⚠️ 超軽量モード' : burnoutRisk === 'medium' ? '⚡ 軽量モード' : '✨ 通常モード'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* タスク内容 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {microCoach.today_task.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {microCoach.today_task.description}
            </p>
            
            {/* なぜこれが重要か */}
            <div className="bg-gold/10 dark:bg-gold/5 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 gold-soft-text" />
                <span>
                  <strong className="gold-soft-text">なぜこれが重要か:</strong>{' '}
                  {microCoach.today_task.reason}
                </span>
              </p>
            </div>

            {/* 所要時間 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Clock className="w-4 h-4" />
              <span>所要時間: {microCoach.today_task.duration}</span>
            </div>

            {/* ワンクリックアクション */}
            {microCoach.today_task.one_click_action && (
              <Button
                onClick={handleOneClickAction}
                className="w-full aria-gold-surface hover:shadow-lg hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
                disabled={taskCompleted}
              >
                <Zap className="w-4 h-4 mr-2" />
                {microCoach.today_task.one_click_action}
              </Button>
            )}

            {/* 選択肢 */}
            {microCoach.today_task.choices && microCoach.today_task.choices.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">選択肢:</p>
                {microCoach.today_task.choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start gold-soft-outline hover:bg-gold/10 dark:hover:bg-gold/5"
                    onClick={() => handleStepComplete(1)}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* 今すぐできる3ステップ */}
          <div className="border-t border-gold/20 dark:border-gold/20 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              今すぐできる3ステップ
            </h4>
            <div className="space-y-2">
              {microCoach.immediate_steps.map((step) => (
                <div
                  key={step.step}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                    completedSteps.includes(step.step)
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gold/30 dark:hover:border-gold/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {completedSteps.includes(step.step) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gold/40 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gold">{step.step}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{step.action}</p>
                    <p className="text-xs text-muted-foreground">{step.duration}</p>
                  </div>
                  {!completedSteps.includes(step.step) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStepComplete(step.step)}
                      className="aria-gold-surface hover:shadow-md"
                    >
                      完了
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* タスク完了時のフィードバック */}
          {taskCompleted && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gold/20 to-amber/20 dark:from-gold/10 dark:to-amber/10 rounded-lg border border-gold/30 dark:border-gold/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    素晴らしい！🎉
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {microCoach.positive_feedback}
                  </p>
                </div>
              </div>
              
              {/* 次の一歩を自動生成 */}
              {microCoach.next_step_auto_generate && onNextStep && (
                <Button
                  onClick={onNextStep}
                  className="mt-3 w-full aria-gold-surface hover:shadow-lg hover:shadow-gold/30"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  次の一歩を生成
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 立ち絵（モバイル表示用） */}
      <div className="lg:hidden">
        <Card className="border border-gold/25 dark:border-gold/25 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-md shadow-xl">
          <CardContent className="p-4">
            <AriaCharacter state={characterState} className="w-full h-48" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

