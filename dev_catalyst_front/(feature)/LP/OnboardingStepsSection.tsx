import { onboardingSteps } from '../../app/lp-settings';
import { Badge } from '../../(feature)/common/ui/badge';
import { Clock } from 'lucide-react';
import { useInView } from '../../hooks/use-in-view';

export function OnboardingStepsSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 px-3 sm:px-4 bg-white dark:bg-slate-950 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 fade-in-up ${isInView ? 'in-view' : ''}`}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white px-2">
            今夜から、アリアと話せます
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-2">
            深夜でも、すぐに始められる。思考のパートナーは、いつでもそっと傍に。
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`text-center relative fade-in-up ${isInView ? 'in-view' : ''}`}
                  style={{ transitionDelay: `${index * 0.15 + 0.2}s` }}
                >
                  {index < onboardingSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gold/60 transform translate-x-4 -translate-y-1/2" />
                  )}

                  <div className="w-16 h-16 gold-soft-gradient rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-gold/30">
                    <Icon className="h-7 w-7 text-aria-dark-soft" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm gold-soft-text dark:gold-soft-text-light font-medium">
                      STEP {step.step}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    <Badge
                      variant="outline"
                      className="border-gold/30 dark:border-gold-light/50 gold-soft-text dark:gold-soft-text-light text-xs bg-gold/5 dark:bg-black/20"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
