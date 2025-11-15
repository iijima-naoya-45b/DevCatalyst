'use client';

import { useInView } from '../../../hooks/use-in-view';
import { Brain, Lightbulb, MessageSquare, Zap, Rocket, CheckCircle } from 'lucide-react';
import { StageCardData, StageCardProps } from '../../types/visualizations';

const stages: StageCardData[] = [
  {
    id: 0,
    title: '曖昧なアイデア',
    icon: Lightbulb,
    description: '「何か作りたいけど、何から始めれば...」',
    visual: 'blur',
  },
  {
    id: 1,
    title: 'Ariaと対話',
    icon: MessageSquare,
    description: '「どんなユーザーに？どんな価値を？」',
    visual: 'dialogue',
  },
  {
    id: 2,
    title: '戦略が見える',
    icon: Zap,
    description: 'MVP範囲、技術選定、収益モデルが明確に',
    visual: 'strategy',
  },
  {
    id: 3,
    title: 'プロダクト完成',
    icon: Rocket,
    description: 'あなたのSaaSが、形になる',
    visual: 'product',
  },
];

function StageCard({ stage, index }: StageCardProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const Icon = stage.icon;
  
  // 左上から右下への斜め順序: 0秒, 0.15秒, 0.15秒, 0.3秒
  const delays = [0, 0.15, 0.15, 0.3];
  const delay = delays[index];

  return (
    <div 
      ref={ref}
      className={`
        relative rounded-2xl border border-gold/20 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-700
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      {/* ステージ番号バッジ */}
      <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center shadow-lg z-10">
        <Icon className="w-6 h-6 text-navy-deepest" />
      </div>

      {/* コンテンツ */}
      <div className="p-8 pt-10 min-h-[300px] flex flex-col">
        {/* ステージタイトル */}
        <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{stage.title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{stage.description}</p>

        {/* ステージビジュアル */}
        <div className="flex-1 flex items-center justify-center">
          {stage.visual === 'blur' && (
            <div className="space-y-4 w-full">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto">
                <Lightbulb className="w-12 h-12 text-gray-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto" />
                <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full mx-auto" />
                <div className="h-2 w-2/3 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto" />
              </div>
            </div>
          )}

          {stage.visual === 'dialogue' && (
            <div className="space-y-3 w-full">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-navy-deepest" />
                </div>
                <div className="bg-gold/10 rounded-lg px-3 py-2 text-left flex-1">
                  <p className="text-xs text-gray-700 dark:text-gray-300">どんなユーザーの課題を？</p>
                </div>
              </div>
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-left max-w-[70%]">
                  <p className="text-xs text-gray-700 dark:text-gray-300">飲食店の予約管理を...</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-navy-deepest" />
                </div>
                <div className="bg-gold/10 rounded-lg px-3 py-2 text-left flex-1">
                  <p className="text-xs text-gray-700 dark:text-gray-300">市場規模を見ましょう</p>
                </div>
              </div>
            </div>
          )}

          {stage.visual === 'strategy' && (
            <div className="space-y-3 w-full">
              {/* 主要戦略項目 */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'MVP範囲', value: '5機能', icon: CheckCircle },
                  { label: '開発期間', value: '6-8週間', icon: Zap },
                  { label: 'ターゲット', value: '小規模店', icon: MessageSquare },
                  { label: '価格設定', value: '¥2,980', icon: Rocket },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-gold/5 rounded-lg"
                    >
                      <ItemIcon className="w-4 h-4 gold-soft-text flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.label}</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 詳細戦略 */}
              <div className="p-3 bg-gradient-to-r from-gold/10 to-bronze/10 rounded-lg border border-gold/30">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">技術: Next.js + Supabase</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">競合優位性: 低価格 + LINE連携</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">目標: 3ヶ月で100店舗導入</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stage.visual === 'product' && (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <p className="text-lg font-bold text-green-600 dark:text-green-400">完成！</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-gold/10 to-bronze/10 rounded-lg border border-gold/30">
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-5 h-5 gold-soft-text" />
                  <span className="font-bold text-gray-800 dark:text-white">ReservePro</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full w-3/4" />
                  <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full w-full" />
                  <div className="h-2 bg-gray-200 dark:bg-slate-600 rounded-full w-2/3" />
                </div>
              </div>
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ローンチ準備完了
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductEvolution() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stages.map((stage, index) => (
          <StageCard key={stage.id} stage={stage} index={index} />
        ))}
      </div>
      
      {/* 最後のメッセージ */}
      <div className="text-center py-8 mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          4つのステージで、アイデアがプロダクトへ進化します
        </p>
      </div>
    </div>
  );
}
