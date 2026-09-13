import React from "react";
import Link from "next/link";
import { FiCheck, FiPhone, FiMail, FiZap, FiArrowRight } from "react-icons/fi";

export default function PricingSection() {
  const plans = [
    {
      name: "Basic",
      originalPrice: "₹1,999",
      price: "₹999",
      billing: "/yr",
      badge: "Starter",
      location: "1 Store Location",
      popular: false,
      features: [
        "1 store location",
        "Digital Stamp Cards",
        "AI Digital Menu",
        "Scratch Cards",
        "Unlimited QR scans",
        "Analytics dashboard",
        "FREE QR code stand",
      ],
    },
    {
      name: "Growth",
      originalPrice: "₹4,999",
      price: "₹2,499",
      billing: "/yr",
      badge: "Best Value",
      location: "Up to 3 Locations",
      popular: true,
      features: [
        "Up to 3 store locations",
        "Digital Stamp Cards",
        "AI Digital Menu",
        "Scratch Cards",
        "Same QR, GPS branch detection",
        "Branch-wise scan analytics",
        "Priority support",
      ],
    },
    {
      name: "Pro",
      originalPrice: "₹9,999",
      price: "₹4,999",
      billing: "/yr",
      badge: "Multi-Outlet",
      location: "Up to 6 Locations",
      popular: false,
      features: [
        "Up to 6 store locations",
        "Digital Stamp Cards",
        "AI Digital Menu",
        "Scratch Cards",
        "Same QR, GPS branch detection",
        "Branch-wise scan analytics",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <section id="pricing" className="w-full bg-white border-t border-neutral-100 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 md:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E23744] text-[11px] font-bold uppercase tracking-wider">
            <FiZap className="text-xs" />
            <span>Transparent Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
            Simple Pricing, No Hidden Fees
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Everything you need to turn first-time visitors into regular guests.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-200 ${
                plan.popular
                  ? "bg-white border-2 border-[#E23744] shadow-xl shadow-red-500/10 md:-translate-y-2"
                  : "bg-neutral-50/60 border border-neutral-200/80 shadow-xs hover:border-neutral-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E23744] text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
                    <p className="text-xs font-semibold text-[#E23744] mt-0.5">{plan.location}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-600">
                    {plan.badge}
                  </span>
                </div>

                <div className="pb-4 border-b border-neutral-200/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">
                      {plan.billing}
                    </span>
                    <span className="text-xs text-neutral-400 line-through font-medium ml-1">
                      {plan.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
                      <span className="w-4 h-4 rounded-full bg-red-50 text-[#E23744] flex items-center justify-center shrink-0">
                        <FiCheck className="text-[11px] stroke-[3]" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA */}
              <div className="pt-6 mt-4">
                <Link
                  href="/register"
                  className={`w-full py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-[#E23744] text-white hover:bg-red-700 active:scale-95 shadow-md shadow-red-500/20"
                      : "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-100 active:scale-95"
                  }`}
                >
                  <span>Get Started</span>
                  <FiArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Support Banner */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E23744]">
              Custom Deployments
            </span>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Need a Custom Enterprise Plan?
            </h3>
            <p className="text-xs text-neutral-500 max-w-lg">
              Have 6+ locations or custom franchise integration requirements? Speak directly with our integration team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="tel:8446791696"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs font-bold tracking-wide uppercase text-neutral-700 hover:border-[#E23744] hover:text-[#E23744] transition-colors shadow-2xs"
            >
              <FiPhone className="text-xs" /> 8446791696
            </a>
            <a
              href="mailto:support@adyverse.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E23744] text-white text-xs font-bold tracking-wide uppercase hover:bg-red-700 transition-colors shadow-sm shadow-red-500/20"
            >
              <FiMail className="text-xs" /> Email Support
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}