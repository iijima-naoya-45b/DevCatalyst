import { useState, useEffect } from 'react';
import { Brain, CheckCircle } from 'lucide-react';
import { heroStats, heroCheckpoints } from '../../app/lp-settings';
import { useThemeForceUpdate } from '../../hooks/use-theme-force-update';

export function HeroSection() {
  useThemeForceUpdate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // マウント後にアニメーション開始
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 md:py-16 lg:py-20 bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-950 dark:to-black overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gold-soft-gradient opacity-15 pointer-events-none dark:from-slate-700/10 dark:via-slate-800/5 dark:to-transparent" />
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 gold-soft-gradient opacity-30 dark:bg-slate-600/5 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 gold-soft-gradient opacity-25 dark:bg-slate-700/5 rounded-full blur-2xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />

      <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
        {/* Service Logo & Name */}
        <div
          className={`flex items-center justify-center space-x-3 sm:space-x-4 mb-6 sm:mb-8 md:mb-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 gold-soft-gradient rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-25px_rgba(15,23,42,0.5)]">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-aria-dark-soft" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold gold-soft-text">
              devCatalyst
            </h1>
            <p className="gold-soft-text dark:gold-soft-text/90 text-xs sm:text-sm tracking-wide mt-1">
              AI Strategy Partner &quot;Vertex&quot;
            </p>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-7xl mx-auto mb-16 sm:mb-24 md:mb-32 lg:mb-36">
          <h2
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-serif font-bold mb-6 sm:mb-8 md:mb-12 lg:mb-16 xl:mb-20 leading-tight sm:leading-relaxed px-1 sm:px-2 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="text-gray-900 dark:text-yellow-400 transition-all duration-300">
              ひとりで戦うソロプレナーへ。
              <br />
              迷いを戦略に変える、AI戦略パートナー。
            </span>
          </h2>

          <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
            <p
              className={`text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light max-w-5xl mx-auto px-2 sm:px-3 md:px-4 lg:px-0 py-2 sm:py-4 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              事業構築、市場開拓、新規プロダクト…。
              <br />
              ひとりで全て抱え込む孤独な夜を、AIが本質から整理し、明日への一手へとつなげる。
              <br />
              <br />
              <strong className="gold-soft-text font-semibold">RAG技術による戦略特化</strong>と、
              <strong className="gold-soft-text font-semibold">視覚的に優れたデザイン</strong>
              を備えた
              <br />
              AI戦略パートナー{' '}
              <strong className="gold-soft-text font-semibold">devCatalyst〈Aria〉</strong> は、
              <br />
              ソロプレナーの「戦略立案」から「実行」まで、あなたを導く専属の参謀です。
            </p>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-20 px-2 sm:px-3 md:px-0 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {heroCheckpoints.map((checkpoint, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 text-left py-3 sm:py-4 md:py-5 px-1 sm:px-2"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1 border border-gold/20">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 md:space-y-3 flex-1">
                    <h3 className="gold-soft-text font-semibold text-sm sm:text-base md:text-lg">
                      {checkpoint.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-400 leading-relaxed">
                      {checkpoint.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Hero Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto px-2 sm:px-3 md:px-0 mt-6 sm:mt-8 md:mt-12 lg:mt-16 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {heroStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-2 sm:p-3 md:p-4 lg:p-6 space-y-1.5 sm:space-y-2 md:space-y-3"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/20">
                  <Icon className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold gold-soft-text">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-700 dark:text-gray-400 leading-relaxed max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] mx-auto">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
