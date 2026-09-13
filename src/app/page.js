"use client";

import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PricingSection from "./components/PricingSection";

export default function LandingPage() {
  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-[#E23744] selection:text-white font-sans scroll-smooth overflow-x-hidden">
      
      {/* 1. Core Floating Interactive Hero Section */}
      <Hero />
      
      {/* 2. 3-Step Setup & India Trust Metrics Section */}
      <HowItWorks />
      
      {/* 3. Transparent Pricing & Enterprise Support Section */}
      <PricingSection />
      
    </div>
  );
}