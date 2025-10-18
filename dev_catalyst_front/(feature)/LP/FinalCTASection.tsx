import { Button } from "../../(feature)/common/ui/button";
import { Brain, ArrowRight } from "lucide-react";

export function FinalCTASection({ onStartTrial }: { onStartTrial: () => void }) {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-navy-dark via-navy to-navy-dark">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h3 className="text-4xl md:text-5xl font-serif font-bold">
            今夜、
            <span className="bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
              アリアと話してみませんか
            </span>
          </h3>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            考えがまとまらない夜も、少しだけ心細い夜も。<br />
            アリアは静かに波紋を返してくれる。言葉にするたび、思考が澄んでいく。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={onStartTrial}
              className="h-16 px-12 text-lg bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light shadow-2xl shadow-gold/25 transform hover:scale-105 transition-all duration-300"
            >
              <Brain className="w-6 h-6 mr-3" />
              アリアと、静かに話す
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            クレジットカード不要 • すぐに始められる • 14日間、無料で試せます
          </div>
        </div>
      </div>
    </section>
  );
}
