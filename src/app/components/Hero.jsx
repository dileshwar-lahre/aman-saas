"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiUser } from "react-icons/fi";

export default function UltimatePremiumHero() {
  const localImages = [
    { id: 1, src: "/images/1.jpg", alt: "Asset Node 1" },
    { id: 2, src: "/images/2.jpg", alt: "Asset Node 2" },
    { id: 3, src: "/images/3.jpg", alt: "Asset Node 3" },
    { id: 4, src: "/images/4.jpg", alt: "Asset Node 4" },
  ];

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-white text-black flex flex-col font-sans antialiased select-none selection:bg-black selection:text-white justify-center items-center">
      
      {/* High-performance wave float animation configuration */}
      <style jsx global>{`
        @keyframes dynamic-wave-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-custom-float {
          animation: dynamic-wave-float 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* MAIN HERO PURE VIEW NODE */}
      <main className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center space-y-12 md:space-y-14 py-8">
        
        {/* 🌊 INTERACTIVE FLOATING IMAGES MATRIX */}
        {/* Desktop par perfect top margin spacing set hai */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-4 sm:gap-6 overflow-visible md:mt-8">
          {localImages.map((image, index) => (
            <div 
              key={image.id}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 bg-neutral-50 rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer group animate-custom-float shrink-0"
              style={{ animationDelay: `${index * 0.3}s` }} 
            >
              <img 
                src={image.src} 
                alt={image.alt}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-${index === 0 ? "1517248135467-4c7edcad34c4" : index === 1 ? "1555396273-367ea4eb4db5" : index === 2 ? "1544025162-d76694265947" : "1552566626-52f8b828add9"}?auto=format&fit=crop&w=400&q=80`;
                }}
                className="w-full h-full object-cover opacity-100 group-hover:scale-110 group-hover:rotate-1 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* 📝 CORE MINIMALIST COPYWRITING SECTION */}
        {/* Headline converted to clean English and locked in a single line for desktop views */}
        <div className="text-center space-y-4 max-w-4xl px-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight text-black font-serif italic md:whitespace-nowrap leading-none">
            Digitize Your Restaurant
          </h1>
          <p className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-neutral-400 font-sans">
            Digital Menu // Loyalty Stamp Card Ecosystem
          </p>
        </div>

        {/* 🚀 MODERN INTERACTIVE BUTTONS INTERFACE (2 Clean Options) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          
          {/* 1. Start CTA Button */}
          <Link
            href="/start"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-black tracking-widest uppercase text-white bg-black rounded-xl transition-all duration-200 hover:bg-neutral-800 hover:translate-y-[-2px] active:scale-[0.98] shadow-md shadow-black/10"
          >
            <span>Start Now</span>
            <FiArrowRight className="text-sm" />
          </Link>
          
          {/* 2. User Login Button */}
          <Link
            href="/login-user"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-black tracking-widest uppercase text-black bg-white border-2 border-black rounded-xl transition-all duration-200 hover:bg-neutral-50 hover:translate-y-[-2px] active:scale-[0.98]"
          >
            <FiUser className="text-sm" />
            <span>User Login</span>
          </Link>

        </div>

      </main>
    </div>
  );
}