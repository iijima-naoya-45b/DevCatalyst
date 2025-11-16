'use client';

import { Moon, Users, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '../../hooks/use-in-view';
import { LpSection } from './components/lp-section';
import { LpSectionHeader } from './components/lp-section-header';
import { LpInfoCard } from './components/lp-info-card';

const painPoints = [
  {
    icon: Moon,
    title: '深夜、ひとりで戦略に悩む孤独',
    description: 'アイデアはある。でも、市場で勝てる戦略が分からない。ソロだからこそ、相談相手もいない。',
  },
  {
    icon: Users,
    title: 'ひとりで全部やるのは限界',
    description: '市場調査、競合分析、戦略立案、実行…。すべてを一人で抱えるのは現実的ではない。',
  },
  {
    icon: Lightbulb,
    title: '高額なコンサルは手が届かない',
    description: '戦略コンサルは月30万円〜。ソロプレナーには重すぎる負担。でも戦略なしでは勝てない。',
  },
];

export function WhySection() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <LpSection
      id="why-section"
      className="bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      containerClassName="space-y-20"
    >
      <div className="absolute inset-0 gold-soft-gradient opacity-15 pointer-events-none dark:from-slate-700/10 dark:to-transparent" />

      <div ref={ref} className="relative space-y-20">
        <LpSectionHeader
          label="Why We Exist"
          title={
            <>
              ソロプレナーの、
              <br />
              <span className="gold-soft-text">
                孤独な戦略立案を終わらせたい
              </span>
            </>
          }
          description={
            <>
              アイデアはある。やる気もある。でも、ひとりで戦略を組み立てるのは限界がある。
              <br />
              そんな「迷い」を「勝てる戦略」に変え、ソロでも戦える確信を届けることが私たちの使命です。
            </>
          }
          isVisible={isInView}
        />

        <div className="grid gap-8 md:grid-cols-3">
          {painPoints.map(({ icon: IconComponent, title, description }, index) => (
            <LpInfoCard
              key={title}
              icon={
                <div className="p-4 rounded-full bg-gold/20 shadow-[0_12px_25px_-18px_rgba(15,23,42,0.45)]">
                  <IconComponent className="h-8 w-8 text-aria-dark-soft" />
                </div>
              }
              title={title}
              description={description}
              className={cn(
                'text-center transition-all duration-500 hover:scale-[1.02]',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
              style={{ transitionDelay: `${index * 120 + 400}ms` }}
            />
          ))}
        </div>

        <div
          className={cn(
            'transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="rounded-2xl sm:rounded-3xl border-2 border-gold/35 bg-gold/15 p-6 sm:p-8 md:p-12 text-center dark:border-gold/30 dark:bg-gold/20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
              すべてのソロプレナーに、
              <br />
              <span className="gold-soft-text">
                戦略的思考のパートナーを
              </span>
            </h3>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              ひとりで事業を回すソロプレナーが、リソース不足で市場機会を逃してしまう。
              <br />
              戦略コンサルは高額すぎて使えない。でも、戦略なしでは勝てない。
              <br />
              そんな世界を変えたい。
            </p>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">
              AIを活用することで、ソロでも24時間365日、
              <br />
              プロレベルの市場分析・戦略立案・実行支援にアクセスできる。
              <br />
              副業からでも、フルタイムでも。あなたのペースで、勝てる戦略を手に入れる。
              <br />
              それが、私たちdevCatalystの存在理由です。
            </p>
          </div>
        </div>
      </div>
    </LpSection>
  );
}

