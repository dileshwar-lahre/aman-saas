"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiUser } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function Hero() {
  const localImages = [
    { id: 1, src: "/images/1.jpg", alt: "Food asset 1" },
    { id: 2, src: "/images/2.jpg", alt: "Food asset 2" },
    { id: 3, src: "/images/3.jpg", alt: "Food asset 3" },
    { id: 4, src: "/images/4.jpg", alt: "Food asset 4" },
  ];

  return (
    <section className="w-full bg-white text-neutral-900 flex flex-col justify-center items-center py-10 md:py-16 px-6">
      
      {/* Gentle Wave Float Animation */}
      <style jsx global>{`
        @keyframes dynamic-wave-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-custom-float {
          animation: dynamic-wave-float 3.5s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
        
        {/* 🖼️ IMAGES MATRIX: PHONE (2x2 GRID) | DESKTOP (4 IN 1 ROW - THODA BADA SIZE) */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-3.5 sm:gap-4 md:gap-5 w-full max-w-[270px] sm:max-w-xs md:max-w-none">
          {localImages.map((image, index) => (
            <div 
              key={image.id}
              className="w-full aspect-square sm:w-32 sm:h-32 md:w-40 md:h-40 bg-neutral-50 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-custom-float shrink-0 border border-neutral-100 group"
              style={{ animationDelay: `${index * 0.2}s` }} 
            >
              <img 
                src={image.src} 
                alt={image.alt}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-${
                    index === 0 
                      ? "1517248135467-4c7edcad34c4" 
                      : index === 1 
                      ? "1555396273-367ea4eb4db5" 
                      : index === 2 
                      ? "1544025162-d76694265947" 
                      : "1552566626-52f8b828add9"
                  }?auto=format&fit=crop&w=400&q=80`;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* 📝 CRISP CENTERED COPYWRITING */}
        <div className="space-y-2.5 max-w-3xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-neutral-900 md:whitespace-nowrap leading-tight text-center">
            Turn Every Visit Into A <span className="text-[#E23744]">Repeat Customer</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-400 text-center">
            QR Digital Menu <span className="text-[#E23744] mx-1">•</span> 5-Stamp Loyalty Passes
          </p>
        </div>

        {/* 🚀 MODERN ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-md pt-1">
          
          {/* Restaurant Owner CTA[cite: 1] */}
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-bold tracking-wider uppercase text-white bg-[#E23744] rounded-full hover:bg-red-700 active:scale-95 shadow-sm shadow-red-500/20 transition-all"
          >
            <LuChefHat className="text-sm" />
            <span>Restaurant Owner</span>
            <FiArrowRight className="text-xs" />
          </Link>

          {/* User CTA[cite: 1] */}
          <Link
            href="/login-user"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-bold tracking-wider uppercase text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 active:scale-95 rounded-full transition-all"
          >
            <FiUser className="text-sm text-neutral-500" />
            <span>I'm a User</span>
          </Link>

        </div>

      </div>
    </section>
  );
}