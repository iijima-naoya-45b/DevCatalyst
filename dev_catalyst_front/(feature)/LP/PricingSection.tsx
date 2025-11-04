import { useState, useEffect } from "react";
import { plans } from '../../app/lp-settings';
import { Card, CardContent, CardHeader, CardTitle } from "../../(feature)/common/ui/card";
import { Badge } from "../../(feature)/common/ui/badge";
import { Target, CheckCircle } from "lucide-react";
import { Button } from "../../(feature)/common/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/auth-context';

export function PricingSection({ onStartTrial }: { onStartTrial: () => void }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartTrial = () => {
    // クライアントサイドでのみ認証チェック
    if (isClient && isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
            あなたに合った、話し方を
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-2">
            まずは無料で試して、気に入ったらいつでも一緒に。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`
              relative border transition-all duration-300 hover:shadow-2xl
              ${plan.popular
                ? 'border-gold shadow-xl shadow-gold/20 bg-gradient-to-br from-gold/10 to-white dark:from-gold/20 dark:to-gold/5 sm:scale-105'
                : 'border-gold/25 dark:border-gold/40 bg-white dark:bg-slate-800/60 hover:border-gold/40 dark:hover:border-gold/60'
              }
              backdrop-blur-md dark:text-white
            `}>
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-gold to-bronze text-navy-deepest px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    最も人気
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl font-serif mb-2 text-gray-900 dark:text-white">{plan.name}</CardTitle>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{plan.period}</div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold dark:text-gold-light flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleStartTrial}
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 transition-all duration-300 ease-out text-sm sm:text-base"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

