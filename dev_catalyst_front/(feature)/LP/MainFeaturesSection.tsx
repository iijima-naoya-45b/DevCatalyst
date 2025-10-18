import { mainFeatures } from '../../app/lp-settings';
import { Card, CardContent } from "../../(feature)/common/ui/card";
import { CheckCircle } from "lucide-react";

export function MainFeaturesSection() {
  return (
    <section className="py-20 px-4 bg-navy-dark/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-serif font-semibold mb-6">
            アリアとできる、3つのこと
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            話すたび、思考が整っていく。<br />
            アリアは、あなたの考えに静かに耳を傾け、一緒に道を探していきます。
          </p>
        </div>

        <div className="space-y-12">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const color = feature.color;
            return (
              <div key={feature.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                {/* Feature Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <div className="text-navy-deepest">
                        <Icon />
                      </div>
                      {/* <Icon className="w-8 h-8 text-navy-deepest" /> */}
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-semibold">{feature.title}</h4>
                      <p className="text-gold text-sm">{feature.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gold" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Demo */}
                <div className="flex-1">
                  <Card className="border border-gold/25 bg-navy-dark/60 backdrop-blur-md">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                            <Icon className="w-4 h-4 text-navy-deepest" />
                          </div>
                          <span className="text-sm font-medium text-gold">アリアとの対話例</span>
                        </div>
                        <div className="text-sm whitespace-pre-line text-muted-foreground leading-relaxed font-mono">
                          {feature.demo}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
