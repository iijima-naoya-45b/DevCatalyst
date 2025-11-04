import { onboardingSteps } from '../../app/lp-settings';
import { Badge } from "../../(feature)/common/ui/badge";
import { Clock } from "lucide-react";

export function OnboardingStepsSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
            今夜から、アリアと話せます
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            深夜でも、すぐに始められる。思考のパートナーは、いつでもそっと傍に。
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center relative">
                  {index < onboardingSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gold to-bronze transform translate-x-4 -translate-y-1/2" />
                  )}

                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-bronze rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 text-black">
                    <div className="text-navy-deepest">
                      <Icon />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gold dark:text-gold-light font-medium">STEP {step.step}</div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    <Badge variant="outline" className="border-gold/30 dark:border-gold-light/50 text-gold dark:text-gold-light text-xs bg-gold/5 dark:bg-black/20">
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
