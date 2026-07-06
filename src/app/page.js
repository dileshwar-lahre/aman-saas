"use client";

import HeroAndFeatures from "./components/Hero";

// Tumhare path (app/components/Hero) ke mutabik direct import

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-white selection:text-black font-sans scroll-smooth">
      
      {/* Sirf aur sirf core Hero section load hoga yahan */}
<HeroAndFeatures/>      
    </div>
  );
}