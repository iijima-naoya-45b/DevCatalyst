'use client'


import { Header } from '../(feature)/layouts/Header';
import { Footer } from '../(feature)/layouts/Footer';
import { HeroSection } from '../(feature)/LP/HeroSection';
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



  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end dark:bg-gradient-to-br dark:from-navy-main dark:via-navy-secondary dark:to-navy-card">
        <HeroSection />
        <ServiceOverviewSection />
        <MainFeaturesSection />
        <AriaDemoSection showAriaDemo={true} />
        <OnboardingStepsSection />
        <PricingSection onStartTrial={onStartTrial} />
        <FinalCTASection onStartTrial={onStartTrial} />
      </div>
      <Footer />
    </>
  );
}