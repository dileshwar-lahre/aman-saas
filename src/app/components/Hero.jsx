"use client";

import Link from "next/link";
import { FiArrowRight, FiUser, FiMenu, FiActivity } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function Hero() {
  return (
    <section className="bg-black text-white min-h-[calc(100vh-80px)] font-sans selection:bg-white selection:text-black relative flex items-center justify-center pt-2 pb-12">
      
      {/* Ambient Lighting Glow Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-neutral-900/40 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Text Descriptions & System Entry CTA Nodes */}
        {/* Mobile me perfect padding spacing check: pt-10 */}
        <div className="space-y-5 md:space-y-6 max-w-xl pt-10 lg:pt-0">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase">
            Modern QR Menu <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent font-extrabold">
              & Loyalty System.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Adyverse helps restaurants launch commission-free digital menus, manage automated stamp-card rewards, and multiply customer return rates slots instantly. 
          </p>

          {/* Action Trigger Anchors */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
            <Link
              href="/register?role=owner"
              className="flex items-center justify-center gap-2 bg-white text-black font-extrabold px-7 py-3.5 rounded-xl text-sm hover:bg-neutral-200 transition-all active:scale-98 shadow-[0_4px_25px_rgba(255,255,255,0.12)]"
            >
              <LuChefHat className="text-lg" />
              <span>Start as Restaurant</span>
              <FiArrowRight />
            </Link>
            
            <Link
              href="/login?role=customer"
              className="flex items-center justify-center gap-2 bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors active:scale-98"
            >
              <FiUser className="text-lg" />
              <span>Customer Portal</span>
            </Link>
          </div>

          {/* Infrastructure Tagline Footer */}
          <div className="flex items-center gap-2 pt-2 text-[11px] text-neutral-600 font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-pulse" />
            <span>Isolated Cloud Architecture Deployment</span>
          </div>
        </div>

        {/* RIGHT COLUMN MOCKUP WITH VIDEO - Sent below text on mobile naturally */}
        <div className="relative flex justify-center w-full pt-4 lg:pt-0">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl pointer-events-none w-64 h-64 mx-auto lg:ml-auto opacity-30" />
          
          {/* Smartphone Frame Container */}
          <div className="relative w-full max-w-[285px] aspect-[9/18] bg-neutral-950 border-[5px] border-neutral-900 rounded-[38px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2.5 flex flex-col justify-between overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
            
            {/* Dynamic Inner App Screen Layout */}
            <div className="flex-1 bg-black rounded-[30px] flex flex-col justify-between relative overflow-hidden group">
              
              {/* VIDEO LAYER - Silently loops background metrics */}
              <video 
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen pointer-events-none"
                autoPlay 
                muted 
                loop 
                playsInline
                preload="auto"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-42204-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* OVERLAY APP INTERFACE FOR HIGH-CONTRAST UI BRANDING */}
              <div className="relative z-10 flex-1 p-3.5 flex flex-col justify-between bg-gradient-to-b from-black/85 via-black/40 to-black/95 h-full">
                
                {/* Top Dynamic Header with Adyverse Logo & Menu Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-xs font-black tracking-wider bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent uppercase">
                      Adyverse
                    </span>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <FiActivity className="text-xs text-emerald-400 animate-pulse" />
                      <FiMenu className="text-sm text-white" />
                    </div>
                  </div>

                  {/* Simulated Digital Menu View Container */}
                  <div className="space-y-2">
                    <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                      <span className="text-white bg-white/10 border border-white/10 px-2.5 py-0.5 rounded-full">Popular</span>
                      <span className="px-2 py-0.5">Desserts</span>
                    </div>

                    <div className="bg-neutral-950/80 backdrop-blur-md border border-white/5 p-2 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-[11px] font-bold text-white">Truffle Burger</h4>
                        <p className="text-[8px] text-neutral-500 mt-0.5">Aged cheddar blend</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-neutral-300">₹349</span>
                    </div>
                  </div>
                </div>

                {/* Middle/Bottom Interactive Stamp Progress Card Layer */}
                <div className="space-y-3">
                  <div className="bg-neutral-950/90 backdrop-blur-md border border-white/10 p-3 rounded-xl space-y-2.5 shadow-2xl">
                    <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-wider">
                      <span className="text-neutral-400">Loyalty Matrix</span>
                      <span className="text-white font-mono font-bold">3 / 5 Stamps</span>
                    </div>
                    
                    {/* Clean Simple Round Dots for Stamp Progress (Exactly 3/5 Active) */}
                    <div className="flex justify-between items-center gap-1.5 pt-0.5">
                      <div className="w-5.5 h-5.5 rounded-full bg-white text-black flex items-center justify-center text-[8px] font-black shadow-[0_0_8px_rgba(255,255,255,0.4)]">✓</div>
                      <div className="w-5.5 h-5.5 rounded-full bg-white text-black flex items-center justify-center text-[8px] font-black shadow-[0_0_8px_rgba(255,255,255,0.4)]">✓</div>
                      <div className="w-5.5 h-5.5 rounded-full bg-white text-black flex items-center justify-center text-[8px] font-black shadow-[0_0_8px_rgba(255,255,255,0.4)]">✓</div>
                      <div className="w-5.5 h-5.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] text-neutral-500 font-bold font-mono">4</div>
                      <div className="w-5.5 h-5.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] text-neutral-500 font-bold font-mono">5</div>
                    </div>

                    {/* Validity Constraints Indicator */}
                    <p className="text-[8px] text-neutral-400 text-center pt-0.5 leading-tight bg-neutral-900/60 py-1 rounded-md border border-white/5 font-mono text-[7.5px] uppercase tracking-wide">
                      ⚠️ Valid for 1 month only from first stamp
                    </p>
                  </div>

                  {/* Sub-App Footer: Powered by STONENOX Component */}
                  <div className="text-center pt-1">
                    <p className="text-[8px] font-mono text-neutral-500 tracking-widest uppercase font-bold">
                      Powered by <span className="text-blue-500">STONENOX.COM</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}