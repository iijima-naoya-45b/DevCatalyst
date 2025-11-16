'use client'

import { useState, useEffect } from 'react';
import { Header } from '../(feature)/layouts/Header';
import { Footer } from '../(feature)/layouts/Footer';
import { HeroSection } from '../(feature)/LP/HeroSection';
import { WhySection } from '../(feature)/LP/WhySection';
import { LossAversionSection } from '../(feature)/LP/LossAversionSection';
import { DifferentiationSection } from '../(feature)/LP/DifferentiationSection';
import { HowToUseSection } from '../(feature)/LP/HowToUseSection';
import { ServiceOverviewSection } from '../(feature)/LP/ServiceOverviewSection';
import { MainFeaturesSection } from '../(feature)/LP/MainFeaturesSection';
import { AriaDemoSection } from '../(feature)/LP/AriaDemoSection';
import { OnboardingStepsSection } from '../(feature)/LP/OnboardingStepsSection';
import { FAQSection } from '../(feature)/LP/FAQSection';
import { PricingSection } from '../(feature)/LP/PricingSection';
import { FinalCTASection } from '../(feature)/LP/FinalCTASection';
import { SimpleAriaLoader } from '../components/loading/SimpleAriaLoader';

export default function LandingPage() {
  const onStartTrial = () => {};
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (typeof window !== 'undefined') {
      (window as any).lpSkipAnimation = false;
    }
  }, []);

  const handleLoadingComplete = () => {
    if (typeof window !== 'undefined') {
      (window as any).lpSkipAnimation = true;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      setIsLoading(false);
      window.dispatchEvent(new Event('resize'));
    }, 50);
  };

  return (
    <>
      {/* メインコンテンツ */}
      <div className={`relative transition-opacity duration-500 ${isLoading || !isMounted ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end dark:bg-gradient-to-br dark:from-navy-main dark:via-navy-secondary dark:to-navy-card overflow-x-hidden">
          {/* Hero - フック */}
          <HeroSection />
          
          {/* WHY - なぜ存在するのか */}
          <WhySection />
          
          {/* 損失回避（行動経済学：Loss Aversion） */}
          <LossAversionSection />
          
          {/* HOW - どのように実現するか */}
          <DifferentiationSection />
          <HowToUseSection />
          
          {/* WHAT - 何を提供するか */}
          <ServiceOverviewSection />
          <MainFeaturesSection />
          <AriaDemoSection showAriaDemo={true} />
          
          {/* 行動喚起への準備 */}
          <OnboardingStepsSection />
          <FAQSection />
          <PricingSection onStartTrial={onStartTrial} />
          <FinalCTASection onStartTrial={onStartTrial} />
        </div>
        <Footer />
      </div>
      
      {/* ローディングアニメーション - 最後に配置して確実に最前面に */}
      {isMounted && isLoading && <SimpleAriaLoader onComplete={handleLoadingComplete} />}
    </>
  );
}