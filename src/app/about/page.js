"use client";

import React from "react";
import Link from "next/link";
import { FiCheckCircle, FiShield, FiHeart, FiArrowRight, FiPhone, FiMail } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#E23744] selection:text-white">
      
      {/* 🌟 HERO & WELCOME SECTION FOR MR. AMAN */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#E23744] text-xs font-black uppercase tracking-widest shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#E23744] animate-pulse" />
          Welcome, Mr. Aman!
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 leading-[1.15]">
          Pioneering Digital Ecosystems with <span className="text-[#E23744]">Stonenox</span>
        </h1>

        <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Welcome to Adyverse, built under the visionary architecture and technical excellence of Stonenox. We empower modern businesses with seamless QR loyalty engines and instant customer retention solutions.
        </p>
      </section>

      {/* 🤝 SPECIAL THANK YOU SECTION FOR STONENOX */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E23744] text-white flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
              <FiHeart />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Special Acknowledgement</p>
              <h3 className="text-xl md:text-2xl font-black text-white">Thank You, Stonenox!</h3>
            </div>
          </div>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-normal">
            A heartfelt thank you to <span className="text-white font-bold">Stonenox</span> for their phenomenal partnership, robust infrastructure support, and exceptional code architecture that brings this entire SaaS platform to life. Together, we are setting new standards in digital automation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold">
            <a 
              href="https://stonenox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#E23744] hover:bg-red-700 text-white rounded-xl transition-all shadow-md shadow-red-500/20 inline-flex items-center gap-2"
            >
              <span>Visit Stonenox.com</span>
              <FiArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* 📜 TERMS & CONDITIONS & PLATFORM CONDITIONS */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="border-t border-neutral-100 pt-10">
          <h3 className="text-xl font-black text-neutral-900 mb-4 flex items-center gap-2">
            <FiShield className="text-[#E23744]" /> Platform Conditions & Access Policy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-600 font-medium">
            <div className="bg-neutral-50 border border-neutral-200/70 p-6 rounded-2xl space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">1. Active Subscription Required</h4>
              <p className="leading-relaxed">
                All platform features, dashboard analytics, and QR loyalty tools require an active subscription plan. Unpaid accounts or expired billing cycles will have restricted dashboard access until renewed.
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/70 p-6 rounded-2xl space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">2. Data Security & Compliance</h4>
              <p className="leading-relaxed">
                Customer mobile numbers, WhatsApp OTP authentications, and merchant data are securely encrypted. Unauthorized data scraping or misuse will lead to immediate account termination.
              </p>
            </div>
          </div>
        </div>

        {/* Support CTA Strip */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-black text-neutral-900">Need Enterprise Assistance?</h4>
            <p className="text-xs text-neutral-500">Our technical team powered by Stonenox is available 24/7.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:8446791696" className="px-4 py-2.5 bg-white border border-red-200 text-[#E23744] hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-xs">
              <FiPhone /> Call 8446791696
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}