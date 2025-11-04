import { mainFeatures } from '../../app/lp-settings';
import { Card, CardContent } from "../../(feature)/common/ui/card";
import { CheckCircle } from "lucide-react";

export function MainFeaturesSection() {
  return (
    <section className="py-40 px-6 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-36">
          <h3 className="text-4xl font-serif font-semibold mb-16 text-gray-900 dark:text-white">
            Vertexとできる、3つのこと
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed py-4">
            深い静寂の中、思考は水面のように揺らぎ、道筋を見失うことは、もうない。<br />
            AI戦略パートナー「Vertex」は、あなたの戦略の「核」へ、研ぎ澄まされた問いかけの「波紋」を広げます。
          </p>
        </div>

        {/* グリッド表示（カード型） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            const color = feature.color;
            return (
              <Card key={feature.id} className="border border-gold/25 bg-white dark:bg-slate-900/60 backdrop-blur-md hover:border-gold/40 transition-all duration-300 group">
                <CardContent className="p-12 h-full flex flex-col">
                  {/* アイコンとタイトル */}
                  <div className="flex items-start space-x-8 mb-12">
                    <div className={`w-18 h-18 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-gold/20`}>
                      <Icon className="w-9 h-9 text-navy-deepest" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h4 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                      <p className="text-gold text-base font-medium">{feature.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* 説明文 */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-12 flex-1 text-lg py-2">
                    {feature.description}
                  </p>

                  {/* 対話例 */}
                  <div className="bg-gray-50 dark:bg-slate-900/80 border border-gold/20 rounded-lg p-8 mb-12">
                    <div className="flex items-center space-x-5 mb-6">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-navy-deepest" />
                      </div>
                      <span className="text-base font-medium text-gold">Vertexとの対話例</span>
                    </div>
                    <div className="text-base whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
                      {feature.demo}
                    </div>
                  </div>

                  {/* チェックリスト */}
                  <div className="space-y-5">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-5">
                        <CheckCircle className="w-6 h-6 text-gold flex-shrink-0" />
                        <span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
