import { useState, useEffect } from 'react';
import { Button } from '../../(feature)/common/ui/button';
import { Brain, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useInView } from '../../hooks/use-in-view';

export function FinalCTASection({ onStartTrial }: { onStartTrial: () => void }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.2 });

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
  };

  return (
    <section
      ref={ref}
      className="py-20 px-4 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <h3
            className={`text-4xl md:text-5xl font-serif font-bold fade-in-up ${isInView ? 'in-view' : ''}`}
          >
            <span className="text-gray-900 dark:text-white">今夜、</span>
            <span className="gold-soft-text">アリアと話してみませんか</span>
          </h3>

          <p
            className={`text-xl text-gray-700 dark:text-gray-200 leading-relaxed fade-in-up ${isInView ? 'in-view delay-200' : ''}`}
          >
            考えがまとまらない夜も、少しだけ心細い夜も。
            <br />
            アリアは静かに波紋を返してくれる。言葉にするたび、思考が澄んでいく。
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center slide-in-bottom ${isInView ? 'in-view delay-400' : ''}`}
          >
            <Button onClick={handleStartTrial} className="aria-gold-surface h-16 px-12 text-lg">
              <Brain className="w-6 h-6 mr-3" />
              アリアと、静かに話す
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>

          <div
            className={`text-sm text-gray-600 dark:text-gray-300 fade-in-up ${isInView ? 'in-view delay-500' : ''}`}
          >
            クレジットカード不要 • すぐに始められる • 14日間、無料で試せます
          </div>
        </div>
      </div>
    </section>
  );
}
