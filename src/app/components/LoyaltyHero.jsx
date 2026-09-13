"use client";

import React from "react";
import Link from "next/link";
import { 
  FiCheckCircle, 
  FiArrowRight, 
  FiTrendingUp, 
  FiDollarSign, 
  FiSmartphone, 
  FiRefreshCw, 
  FiBarChart2, 
  FiMapPin, 
  FiBookOpen, 
  FiGift, 
  FiBox 
} from "react-icons/fi";

export default function LoyaltyHero() {
  const features = [
    {
      icon: <FiSmartphone className="text-2xl text-[#E23744]" />,
      title: "One QR Code",
      desc: "Print one QR code. Customers scan, stamps collect automatically. No apps to download.",
    },
    {
      icon: <FiRefreshCw className="text-2xl text-[#E23744]" />,
      title: "Repeat Visits",
      desc: "Customers come back to complete their stamp card. Average 40% repeat rate increase.",
    },
    {
      icon: <FiBarChart2 className="text-2xl text-[#E23744]" />,
      title: "Real-time Analytics",
      desc: "See daily scans, active customers, completed cards, and trends at a glance.",
    },
    {
      icon: <FiMapPin className="text-2xl text-[#E23744]" />,
      title: "Multi-Branch GPS",
      desc: "One QR code for all branches. GPS auto-detects which location the customer is at.",
    },
    {
      icon: <FiBookOpen className="text-2xl text-[#E23744]" />,
      title: "AI Digital Menu",
      desc: "Turn your physical menu into a beautiful digital experience with QR access for all your customers.",
    },
    {
      icon: <FiGift className="text-2xl text-[#E23744]" />,
      title: "Scratch Cards",
      desc: "Delight customers with instant digital scratch cards and surprise rewards on every scan.",
    },
    {
      icon: <FiBox className="text-2xl text-[#E23744]" />,
      title: "FREE QR Stand",
      desc: "Every paid plan gets a free physical QR stand delivered to your store. Ready to use.",
    },
  ];

  return (
    <section id="about" className="w-full bg-white py-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* Core Product Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#E23744] text-xs font-black uppercase tracking-wider border border-red-100/60">
              Digital loyalty for modern businesses
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 leading-[1.15]">
              Turn every visit into a <br className="hidden sm:inline" />
              <span className="text-[#E23744]">repeat customer</span>
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              QR-based loyalty program for cafés, salons, gyms, restaurants & more. Set up in 2 minutes, no app download needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase text-white bg-[#E23744] rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/25"
              >
                <span>Start Free Trial</span>
                <FiArrowRight />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-all active:scale-95"
              >
                I'm a customer
              </Link>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs text-neutral-500 font-medium">
                Already have a business?{" "}
                <Link href="/login" className="text-[#E23744] font-black underline underline-offset-4">
                  Sign In
                </Link>
              </p>
              <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                3-day free trial • No payment required • Cancel anytime
              </p>
            </div>
          </div>

          {/* Floating Metric Nodes */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="p-6 bg-red-50/50 border border-red-100 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#E23744] text-white flex items-center justify-center text-xl shrink-0 shadow-sm shadow-red-500/30">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Success!</p>
                <h3 className="text-lg font-black text-neutral-900">+1 Stamp Added</h3>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200/70 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-xl shrink-0">
                <FiTrendingUp />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Growth</p>
                <h3 className="text-lg font-black text-neutral-900">40% More Repeats</h3>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200/70 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
                <FiDollarSign />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Profit</p>
                <h3 className="text-lg font-black text-neutral-900">Boost Revenue</h3>
              </div>
            </div>
          </div>

        </div>

        {/* Features Catalog */}
        <div className="pt-10 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              Why businesses choose Druto
            </h2>
            <p className="text-xs font-black uppercase tracking-widest text-[#E23744]">
              Everything you need to boost repeat customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-3xl border border-neutral-100 bg-white hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black text-neutral-900">{item.title}</h3>
                <p className="text-xs font-medium text-neutral-500 leading-relaxed">
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