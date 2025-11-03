import { Button } from "../../(feature)/common/ui/button";
import { Brain, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function FinalCTASection({ onStartTrial }: { onStartTrial: () => void }) {
  const router = useRouter()

  const handleStartTrial = () => {
    router.push('/login')
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-navy-dark via-navy to-navy-dark dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">
            今夜、
            <span className="bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
              アリアと話してみませんか
            </span>
          </h3>

          <p className="text-xl text-gray-300 dark:text-gray-200 leading-relaxed">
            考えがまとまらない夜も、少しだけ心細い夜も。<br />
            アリアは静かに波紋を返してくれる。言葉にするたび、思考が澄んでいく。
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={handleStartTrial}
              className="h-16 px-12 text-lg bg-gradient-to-r from-gold to-bronze text-navy-deepest hover:from-gold-light hover:to-bronze-light shadow-2xl shadow-gold/25 hover:shadow-3xl hover:shadow-gold/40 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 ease-out active:scale-105 active:translate-y-0"
            >
              <Brain className="w-6 h-6 mr-3" />
              アリアと、静かに話す
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </div>

          <div className="text-sm text-gray-400 dark:text-gray-300">
            クレジットカード不要 • すぐに始められる • 14日間、無料で試せます
          </div>
        </div>
      </div>
    </section>
  );
}
