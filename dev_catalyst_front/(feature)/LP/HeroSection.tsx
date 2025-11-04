import { Brain, CheckCircle } from "lucide-react";
import { heroStats, heroCheckpoints } from '../../app/lp-settings';
import { useThemeForceUpdate } from '../../hooks/use-theme-force-update';

export function HeroSection() {
  useThemeForceUpdate();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-12 sm:py-16 md:py-20 bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-950 dark:to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none dark:from-slate-700/10 dark:via-slate-800/5 dark:to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/3 dark:bg-slate-600/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/3 dark:bg-slate-700/5 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Service Logo & Name */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6 sm:mb-8 md:mb-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold via-gold-light to-bronze rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-navy-deepest" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold bg-gradient-to-r from-gold via-gold-light to-bronze bg-clip-text text-transparent dark:from-gold dark:via-gold-light dark:to-gold">
              devCatalyst
            </h1>
            <p className="text-gold dark:text-gold/90 text-xs sm:text-sm tracking-wide mt-1">AI Strategy Partner "Vertex"</p>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-7xl mx-auto mb-16 sm:mb-24 md:mb-32 lg:mb-36">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-serif font-bold mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 leading-tight sm:leading-relaxed px-2">
            <span className="text-gray-900 dark:text-yellow-400 transition-all duration-300">
              深夜、戦略に迷うあなたへ。<br />
              迷いを戦略に変える、AI戦略パートナー。
            </span>
          </h2>

          <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light max-w-5xl mx-auto px-3 sm:px-4 md:px-0 py-2 sm:py-4">
              営業戦略、事業ピボット、新規プロダクト…。<br />
              孤独な夜の問いを、AIが本質から整理し、明日への一手へとつなげる。<br /><br />
              AI戦略解析 <strong className="text-gold font-semibold">devCatalist〈Vertex〉</strong> は、<br />
              「可視化」から「決断」まで、思考のボトルネックを取り除くあなた専属の参謀です。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-24 px-3 sm:px-4 md:px-0">
              {heroCheckpoints.map((checkpoint, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 md:space-x-6 text-left py-4 sm:py-6 px-2 sm:px-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-gold/20">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gold" />
                  </div>
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <h3 className="text-gold font-semibold text-base sm:text-lg md:text-xl">{checkpoint.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-400 leading-relaxed">{checkpoint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto px-3 sm:px-4 md:px-0 mt-8 sm:mt-12 md:mt-16">
          {heroStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/20">
                  <Icon className="text-gold w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" />
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gold">{stat.value}</div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-400 leading-relaxed max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}