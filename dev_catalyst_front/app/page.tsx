'use client'

import { useState } from "react";
import { Header } from '../(feature)/layouts/Header';
import { Footer } from '../(feature)/layouts/Footer';
import { HeroSection } from '../(feature)/LP/HeroSection';
import { CTASection } from '../(feature)/LP/CTASection';
import { AriaDemoSection } from '../(feature)/LP/AriaDemoSection';
import { ServiceOverviewSection } from '../(feature)/LP/ServiceOverviewSection';
import { MainFeaturesSection } from '../(feature)/LP/MainFeaturesSection';
import { OnboardingStepsSection } from '../(feature)/LP/OnboardingStepsSection';
import { PricingSection } from '../(feature)/LP/PricingSection';
import { FinalCTASection } from '../(feature)/LP/FinalCTASection';

export default function LandingPage() {
  const onStartTrial = () => {
    console.log('onStartTrial');
  };

  const [showAriaDemo, setShowAriaDemo] = useState<boolean>(true);
  
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-navy-deepest via-navy-darker to-navy-dark">
      <HeroSection />
      <CTASection onStartTrial={onStartTrial} setShowAriaDemo={setShowAriaDemo} showAriaDemo={showAriaDemo} />
      <AriaDemoSection showAriaDemo={showAriaDemo} onStartTrial={onStartTrial} />
      <ServiceOverviewSection />
      <MainFeaturesSection />
      <OnboardingStepsSection />
      <PricingSection onStartTrial={onStartTrial} />
      <FinalCTASection onStartTrial={onStartTrial} />
    </div>
    <Footer />
    </>
  );
}