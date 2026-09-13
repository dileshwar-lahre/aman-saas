import React from "react";
import { 
  FiCheckCircle, 
  FiSmartphone, 
  FiTrendingUp, 
  FiShield, 
  FiUsers, 
  FiAward 
} from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <FiSmartphone className="text-lg md:text-xl text-[#E23744]" />,
      title: "Set Up Your Store",
      desc: "Add your restaurant name and target offers in 60 seconds. Set your 5-stamp loyalty reward with custom discounts.",
      tag: "Instant"
    },
    {
      num: "02",
      icon: <LuQrCode className="text-lg md:text-xl text-[#E23744]" />,
      title: "Display Single QR",
      desc: "Place your branded QR standee on tables. Customers scan directly with their phone camera—zero app downloads.",
      tag: "Zero Hardware"
    },
    {
      num: "03",
      icon: <FiTrendingUp className="text-lg md:text-xl text-[#E23744]" />,
      title: "Automate Retention",
      desc: "Visits collect stamps automatically. Track repeat customer uplift and claimed rewards from your owner console.",
      tag: "Autonomous"
    },
  ];

  const metrics = [
    { 
      value: "10+", 
      label: "Active Outlets", 
      desc: "Cafes & Restaurants",
      icon: <FiUsers className="text-xs md:text-base text-[#E23744]" /> 
    },
    { 
      value: "50+", 
      label: "Stamps Claimed", 
      desc: "Customer visits validated",
      icon: <FiAward className="text-xs md:text-base text-[#E23744]" /> 
    },
    { 
      value: "40%", 
      label: "Retention Jump", 
      desc: "Average 30-day boost",
      icon: <FiShield className="text-xs md:text-base text-[#E23744]" /> 
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-white border-t border-neutral-100 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 md:space-y-14">
        
        {/* 3 Step Cards Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step) => (
            <div 
              key={step.num}
              className="bg-neutral-50/70 rounded-2xl p-5 sm:p-6 border border-neutral-200/60 hover:border-neutral-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center shadow-xs">
                    {step.icon}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                    {step.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 font-mono">
                    STEP {step.num}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200/50 flex items-center text-[10px] sm:text-[11px] font-semibold text-neutral-400">
                <span className="flex items-center gap-1">
                  Instant deployment <FiCheckCircle className="text-[#E23744] text-xs" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Product Mockup Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-neutral-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-lg overflow-hidden relative">
          
          {/* Left Text Detail */}
          <div className="space-y-3 sm:space-y-4 z-10 text-left">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#E23744] bg-white/10 px-2.5 py-1 rounded-full inline-block">
              Live Product Experience
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              One Scan Does It All
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
              No downloading clunky apps from the App Store. Customers tap their native camera, unlock their personalized 5-stamp pass, and track rewards in real-time.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs font-semibold text-neutral-300 pt-1">
              <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#E23744]" /> Instant Scan</span>
              <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#E23744]" /> Live Stamp Update</span>
            </div>
          </div>

          {/* Right Interactive Card Mockup */}
          <div className="bg-neutral-800/90 border border-neutral-700/70 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3.5 z-10">
            <div className="flex items-center justify-between border-b border-neutral-700/80 pb-2.5">
              <div>
                <p className="text-[11px] sm:text-xs font-bold uppercase text-white tracking-wide">Loyalty Pass</p>
                <p className="text-[9px] sm:text-[10px] text-neutral-400">Visit 5 Times & Unlock 20% Off</p>
              </div>
              <span className="px-2 py-0.5 bg-[#E23744] text-white text-[9px] font-bold rounded-full">Active</span>
            </div>

            {/* 5-Stamp Slots Visual */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="aspect-square rounded-lg sm:rounded-xl bg-red-500/10 border border-[#E23744] flex flex-col items-center justify-center text-[#E23744]">
                  <FiCheckCircle className="text-sm sm:text-base" />
                  <span className="text-[8px] sm:text-[9px] font-mono mt-0.5">#{s}</span>
                </div>
              ))}
              <div className="aspect-square rounded-lg sm:rounded-xl bg-neutral-900 border border-dashed border-neutral-600 flex flex-col items-center justify-center text-neutral-400">
                <span className="text-[11px] sm:text-xs">🎁</span>
                <span className="text-[8px] sm:text-[9px] font-mono mt-0.5">#5</span>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-center text-neutral-400 font-medium">
              4 of 5 stamps collected • 1 visit left for Reward
            </p>
          </div>

        </div>

        {/* Metrics & Proof Node */}
        <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/60 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 divide-x divide-neutral-200/80 text-center">
            {metrics.map((item, i) => (
              <div key={i} className="first:pl-0 pl-2 sm:pl-4 space-y-0.5 sm:space-y-1">
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-0.5">
                  {item.icon}
                  <span className="text-[9px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">
                    {item.label}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
                  {item.value}
                </h3>
                <p className="text-[9px] sm:text-[11px] text-neutral-400 font-medium hidden sm:block">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}