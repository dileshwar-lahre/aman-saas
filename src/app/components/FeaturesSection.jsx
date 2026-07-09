"use client";

import React from "react";

export default function FeaturesSection() {
  return (
    <div className="w-full bg-white text-black font-sans antialiased select-none py-24">
      <main className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-3">
        
        {/* 🛠️ PREMIUM MINIMAL STAGING LOG NODE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 rounded-full text-[10px] font-black tracking-widest uppercase text-neutral-500 font-mono">
          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse"></span>
          Pipeline Locked
        </div>

        {/* Crisp Editorial Headline */}
        <h2 className="text-3xl sm:text-4xl font-serif italic tracking-tight text-black">
          Under Development
        </h2>

        {/* Minimal Subtext */}
        <p className="text-[11px] font-black tracking-widest uppercase text-neutral-400 font-sans">
          Phase 02 Modules Loading // Adyverse Production Group
        </p>

      </main>
    </div>
  );
}