import { Card, CardContent } from "../../(feature)/common/ui/card";
import { Clock, Target, TrendingUp } from "lucide-react";

export function ServiceOverviewSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
            ひとりで考える夜も、誰かが聴いてくれる安心
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed">
            アリアは、そんな夜の小さな灯。<br />
            静かに問いかけながら、あなたの迷いを光に変えていく。
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <Card className="border border-gold/25 bg-white dark:bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                  <div className="text-4xl font-bold text-gold mb-2">安心</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">いつでも聴いてくれる</div>
                  <div className="text-xs text-gold mt-1">ひとりじゃない</div>
                </div>
                <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                  <div className="text-4xl font-bold text-gold mb-2">次の一歩</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">小さな一歩を、一緒に</div>
                  <div className="text-xs text-gold mt-1">あなたのペースで</div>
                </div>
                <div className="text-center p-6 bg-gold/5 rounded-xl border border-gold/20">
                  <div className="text-4xl font-bold text-gold mb-2">思考の整理</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">言葉にするたび、澄んでいく</div>
                  <div className="text-xs text-gold mt-1">静かな対話</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">深夜も、いつでも</h4>
            <p className="text-gray-600 dark:text-gray-400">考えたいときに、そっと傍に</p>
          </div>
          <div className="text-center p-6">
            <Target className="w-12 h-12 text-gold mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">焦らず、じっくり</h4>
            <p className="text-gray-600 dark:text-gray-400">あなたのペースで、思考を深める</p>
          </div>
          <div className="text-center p-6">
            <TrendingUp className="w-12 h-12 text-gold mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">迷いが、確信に</h4>
            <p className="text-gray-600 dark:text-gray-400">対話を重ねるほど、道が見えてくる</p>
          </div>
        </div>
      </div>
    </section>
  );
}
