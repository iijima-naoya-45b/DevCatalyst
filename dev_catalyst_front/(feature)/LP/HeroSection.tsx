import { Brain, CheckCircle } from "lucide-react";
import { heroStats } from '../../app/lp-settings';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-copper/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-bronze/4 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="container mx-auto text-center relative z-10">
        {/* Service Logo & Name */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold via-gold-light to-bronze rounded-xl flex items-center justify-center shadow-2xl">
            <Brain className="w-8 h-8 text-navy-deepest" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
              devCatalist
            </h1>
            <p className="text-gold/70 text-sm tracking-wide">Powered by AI Strategy Partner "Aria"</p>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            <span className="text-foreground">
              考えがまとまらない夜に、
            </span>
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-bronze bg-clip-text text-transparent">
              静かな波紋
            </span>
            <span className="text-foreground">
              を返してくれる
            </span>
          </h2>
          
          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              言葉にするたび、思考が澄んでいく。<br />
              AIパートナー「<strong className="text-gold">アリア</strong>」は、深夜のひとり戦略会議に寄り添う、もうひとつの声。
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gold/60" />
                <span>いつでも、静かに聴いてくれる</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gold/60" />
                <span>対話が、確信を育てる</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gold/60" />
                <span>迷いを、光に変えていく</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {heroStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-gold">
                  <Icon />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
