"use client";

import HeroAndFeatures from "./components/Hero";
// 🔥 FIXED: Path ko exact tumhari file ke naam "FeaturesSection" se map kar diya hai
import FeaturesSection from "./components/FeaturesSection"; 

export default function LandingPage() {
  return (
    <div className="bg-white text-black min-h-screen selection:bg-black selection:text-white font-sans scroll-smooth overflow-x-hidden">
      
      {/* 1. Core Floating Hero Display Section */}
      <HeroAndFeatures />
      
      {/* 2. Brand Trust & Customer Retention Features Section */}
      <FeaturesSection />
      
    </div>
  );
}