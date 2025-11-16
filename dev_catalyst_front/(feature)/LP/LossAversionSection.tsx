'use client';

import { TrendingDown, Clock, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '../../hooks/use-in-view';
import { LpSection } from './components/lp-section';
import { LpSectionHeader } from './components/lp-section-header';
import { LpInfoCard } from './components/lp-info-card';

const losses = [
  {
    icon: Clock,
    title: '戦略立案に週10時間',
    value: '年間520時間',
    cost: '時給5,000円なら¥2,600,000',
    description:
      '市場調査・競合分析・戦略立案。ひとりで全部やると年間520時間。本業に集中できない。',
  },
  {
    icon: DollarSign,
    title: '高額な戦略コンサル',
    value: '月30万円〜',
    cost: '年間¥3,600,000+',
    description:
      '戦略コンサルは月30万円〜。ソロプレナーには重すぎる負担。でも戦略なしでは勝てない。',
  },
  {
    icon: TrendingDown,
    title: '間違った戦略で市場機会を逃す',
    value: '半年〜1年',
    cost: '機会損失 無限大',
    description: '市場調査なしで始めた事業は99%失敗。競合に先を越され、時間と資金を全て失う。',
  },
];

export function LossAversionSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <LpSection
      id="loss-aversion"
      className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20"
      containerClassName="space-y-16"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-yellow-500/5 pointer-events-none" />

      <div ref={ref} className="relative space-y-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <span
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-500 transition-all duration-1000',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <TrendingDown className="h-6 w-6" />
            Loss Aversion（損失回避）
          </span>

          <LpSectionHeader
            title={
              <>
                戦略なしで事業を続けると
                <br />
                <span className="text-red-500">年間260万円以上損をする</span>
                ことをご存知ですか？
              </>
            }
            description="ソロプレナーが戦略立案に時間を取られると、これだけの損失が発生します"
            isVisible={isInView}
            titleClassName="text-3xl md:text-4xl lg:text-5xl"
            descriptionClassName="text-lg"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {losses.map(({ icon: IconComponent, title, value, cost, description }, index) => (
            <LpInfoCard
              key={title}
              icon={
                <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                  <IconComponent className="h-8 w-8 text-red-500" />
                </div>
              }
              title={title}
              description={
                <>
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
                    <p className="text-2xl font-bold text-red-500">{cost}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </>
              }
              className={cn(
                'border-2 border-red-200 text-center transition-all duration-500 hover:border-red-400 hover:shadow-xl dark:border-red-900/50',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              iconWrapperClassName="justify-center"
              descriptionClassName="space-y-4 text-center"
              style={{ transitionDelay: `${index * 120 + 400}ms` }}
            />
          ))}
        </div>

        <div
          className={cn(
            'transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="rounded-3xl border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 p-12 dark:from-green-950/20 dark:to-emerald-950/20">
            <div className="mb-8 flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-green-500" />
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
                devCatalystなら
              </h3>
            </div>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <LossStat value="1/4" label="戦略立案時間を75%削減" />
              <LossStat value="¥9,800/月〜" label="コンサルの1/30のコスト" />
              <LossStat value="24時間" label="いつでも即座に意思決定" />
            </div>

            <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
              月額<span className="mx-2 text-3xl text-green-500">¥9,800</span>で、年間
              <span className="mx-2 text-3xl text-green-500">¥2,600,000+</span>
              の時間損失を防ぎます
            </p>
          </div>
        </div>
      </div>
    </LpSection>
  );
}

function LossStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="mb-2 text-3xl font-bold text-green-500">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
