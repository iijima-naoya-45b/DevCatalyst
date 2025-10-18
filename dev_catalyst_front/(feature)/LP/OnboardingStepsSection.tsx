import { onboardingSteps } from '../../app/lp-settings';
import { Badge } from "../../(feature)/common/ui/badge";
import { Clock } from "lucide-react";

export function OnboardingStepsSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-serif font-semibold mb-6">
            今夜から、アリアと話せます
          </h3>
          <p className="text-xl text-muted-foreground">
            深夜でも、すぐに始められる。思考のパートナーは、いつでもそっと傍に。
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
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
                    <div className="text-sm text-gold font-medium">STEP {step.step}</div>
                    <h4 className="text-lg font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <Badge variant="outline" className="border-gold/30 text-gold text-xs">
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
