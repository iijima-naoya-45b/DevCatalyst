import { mainFeatures } from '../../app/lp-settings';
import { Card, CardContent } from '../../(feature)/common/ui/card';
import { CheckCircle } from 'lucide-react';
import { useInView } from '../../hooks/use-in-view';
import { cn } from '@/lib/utils';
import { LpSection } from './components/lp-section';
import { LpSectionHeader } from './components/lp-section-header';

export function MainFeaturesSection() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <LpSection className="bg-gray-50 dark:bg-slate-950">
      <div ref={ref} className="space-y-16">
        <LpSectionHeader
          title="Vertexとできる、3つのこと"
          description={
            <>
              深い静寂の中、思考は水面のように揺らぎ、道筋を見失うことは、もうない。
              <br />
              AI戦略パートナー「Vertex」は、あなたの戦略の「核」へ、研ぎ澄まされた問いかけの「波紋」を広げます。
            </>
          }
          isVisible={isInView}
          titleClassName="text-4xl"
          descriptionClassName="text-xl max-w-4xl mx-auto"
        />

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.id}
                className={cn(
                  'group border border-gold/25 bg-white/95 backdrop-blur-md transition-all duration-500 dark:border-gold/30 dark:bg-slate-900/60',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ transitionDelay: `${index * 120 + 200}ms` }}
              >
                <CardContent className="flex h-full flex-col p-10">
                  <div className="mb-10 flex items-start gap-6">
                    <div
                      className={cn(
                        'flex h-18 w-18 items-center justify-center rounded-xl border border-gold/20 transition-transform duration-300 group-hover:scale-105',
                        feature.color
                      )}
                    >
                      <Icon className="h-9 w-9 text-aria-dark-soft" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h4 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h4>
                      <p className="text-base font-medium gold-soft-text">{feature.subtitle}</p>
                    </div>
                  </div>

                  <p className="mb-10 flex-1 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>

                  <div className="mb-10 rounded-xl border border-gold/20 bg-gray-50 p-8 dark:bg-slate-900/70">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full gold-soft-gradient shadow-[0_12px_20px_-15px_rgba(15,23,42,0.4)]">
                        <Icon className="h-5 w-5 text-aria-dark-soft" />
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wider gold-soft-text">
                        Vertexとの対話例
                      </span>
                    </div>
                    <div className="whitespace-pre-line font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {feature.demo}
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-4 text-left">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 gold-soft-text" />
                        <span className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </LpSection>
  );
}
