import { Card, CardContent } from '../../(feature)/common/ui/card';
import { Clock, Target, TrendingUp, Palette, Eye } from 'lucide-react';
import { Badge } from '../../(feature)/common/ui/badge';
import { useInView } from '../../hooks/use-in-view';

export function ServiceOverviewSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 fade-in-up ${isInView ? 'in-view' : ''}`}>
          <h3 className="text-4xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
            ひとりで考える夜も、誰かが聴いてくれる安心
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed mb-6">
            アリアは、そんな夜の小さな灯。
            <br />
            静かに問いかけながら、あなたの迷いを光に変えていく。
          </p>

          {/* デザインの強調 */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge variant="outline" className="border-gold/30 gold-soft-text">
              <Palette className="w-3 h-3 mr-1" />
              視覚的に優れたデザイン
            </Badge>
            <Badge variant="outline" className="border-gold/30 gold-soft-text">
              <Eye className="w-3 h-3 mr-1" />
              直感的なUI/UX
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            洗練されたデザインと美しいビジュアルで、戦略立案のプロセスを視覚的に理解しやすく、楽しみながら進められます。
          </p>
        </div>

        {/* Dashboard Preview */}
        <div
          className={`relative max-w-6xl mx-auto mb-16 scale-in ${isInView ? 'in-view delay-200' : ''}`}
        >
          <Card className="border border-gold/25 bg-white dark:bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                  <div className="text-4xl font-bold gold-soft-text mb-2">安心</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    いつでも聴いてくれる
                  </div>
                  <div className="text-xs gold-soft-text mt-1">ひとりじゃない</div>
                </div>
                <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                  <div className="text-4xl font-bold gold-soft-text mb-2">次の一歩</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    小さな一歩を、一緒に
                  </div>
                  <div className="text-xs gold-soft-text mt-1">あなたのペースで</div>
                </div>
                <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                  <div className="text-4xl font-bold gold-soft-text mb-2">思考の整理</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    言葉にするたび、澄んでいく
                  </div>
                  <div className="text-xs gold-soft-text mt-1">静かな対話</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto fade-in-up ${isInView ? 'in-view delay-400' : ''}`}
        >
          <div className="text-center p-6">
            <Clock className="w-12 h-12 gold-soft-text mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              深夜も、いつでも
            </h4>
            <p className="text-gray-600 dark:text-gray-400">考えたいときに、そっと傍に</p>
          </div>
          <div className="text-center p-6">
            <Target className="w-12 h-12 gold-soft-text mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              焦らず、じっくり
            </h4>
            <p className="text-gray-600 dark:text-gray-400">あなたのペースで、思考を深める</p>
          </div>
          <div className="text-center p-6">
            <TrendingUp className="w-12 h-12 gold-soft-text mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              迷いが、確信に
            </h4>
            <p className="text-gray-600 dark:text-gray-400">対話を重ねるほど、道が見えてくる</p>
          </div>
        </div>
      </div>
    </section>
  );
}
