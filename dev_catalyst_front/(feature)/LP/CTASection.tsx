import { Button } from "../../(feature)/common/ui/button";
import { Brain, ArrowRight, PlayCircle, Timer } from "lucide-react";

export function CTASection({ onStartTrial, setShowAriaDemo, showAriaDemo }: { onStartTrial: () => void, setShowAriaDemo: (show: boolean) => void, showAriaDemo: boolean }) {
  return (
    <div className="space-y-8 mb-16">
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Button
          onClick={onStartTrial}
          className="h-16 px-12 text-lg bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light shadow-2xl shadow-gold/25 transform hover:scale-105 transition-all duration-300"
          variant="default"
        >
          <Brain className="w-6 h-6 mr-3" />
          アリアと、静かに話す
          <ArrowRight className="w-5 h-5 ml-3" />
        </Button>
        <Button
          onClick={() => setShowAriaDemo(!showAriaDemo)}
          variant="outline"
          className="h-16 px-12 text-lg border-gold/40 text-gold hover:bg-gold/10 backdrop-blur-sm"
        >
          <PlayCircle className="w-6 h-6 mr-3" />
          どんな対話か、見てみる
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          ✓ クレジットカード不要　✓ すぐに始められる　✓ 14日間、無料で試せます
        </p>
        <div className="flex items-center justify-center space-x-2 mt-2 opacity-70">
          <span className="text-muted-foreground text-sm">深夜でも、いつでも</span>
        </div>
      </div>
    </div>
  );
}
