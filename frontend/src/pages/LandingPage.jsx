import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  // Force dark mode for landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Allow it to be removed or managed by other pages when navigating away
    };
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen text-slate-50 overflow-x-hidden">
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <LandingFooter />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155',
        }
      }} />
    </div>
  );
}
