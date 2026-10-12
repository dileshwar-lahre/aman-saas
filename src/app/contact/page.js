"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle, FiClock, FiShield } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate query dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-[#E23744] selection:text-white">
      
      {/* Header Banner */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#E23744] text-xs font-black uppercase tracking-widest shadow-xs">
          Get in Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
          We're Here to Help Your <span className="text-[#E23744]">Business Grow</span>
        </h1>
        <p className="text-sm md:text-base text-neutral-600 max-w-xl mx-auto font-medium">
          Have questions about our digital loyalty QR engine, pricing plans, or technical setup? Reach out to our team anytime.
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office Address Card */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E23744] flex items-center justify-center text-xl shadow-inner">
                <FiMapPin />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">Registered Office</h3>
                <p className="text-xs text-neutral-600 font-medium mt-1 leading-relaxed">
                  Adyverse, Old Bus Stand, Landmark Complex, Bilaspur, Chhattisgarh, India
                </p>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E23744] flex items-center justify-center text-xl shadow-inner">
                <FiPhone />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">Direct Support Line</h3>
                <p className="text-xs text-neutral-600 font-medium mt-1">
                  Call or WhatsApp: <a href="tel:8446791696" className="text-[#E23744] font-black hover:underline">8446791696</a>
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">Available Monday to Saturday (10:00 AM - 7:00 PM)</p>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E23744] flex items-center justify-center text-xl shadow-inner">
                <FiMail />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">Email Inquiries</h3>
                <p className="text-xs text-neutral-600 font-medium mt-1">
                  Support Email: <a href="mailto:support@adyverse.com" className="text-[#E23744] font-black hover:underline">support@adyverse.com</a>
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">We respond within 24 business hours.</p>
              </div>
            </div>

          </div>

          {/* Right Form Container */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/90 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
            
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-neutral-900">Message Sent Successfully!</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for contacting Adyverse. Our support executive will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="mt-4 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-neutral-900 mb-1">Send Us a Message</h3>
                  <p className="text-xs text-neutral-500 font-medium">Fill out the form below and we’ll get back to you right away.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman Lahre"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3.5 px-4 text-xs font-bold text-black focus:outline-none focus:border-[#E23744] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3.5 px-4 text-xs font-bold text-black focus:outline-none focus:border-[#E23744] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@business.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3.5 px-4 text-xs font-bold text-black focus:outline-none focus:border-[#E23744] focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">Message / Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your restaurant or query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3.5 px-4 text-xs font-bold text-black focus:outline-none focus:border-[#E23744] focus:bg-white transition-all shadow-inner resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E23744] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 active:scale-[0.99] disabled:opacity-50"
                >
                  <span>{loading ? "SENDING MESSAGE..." : "SUBMIT INQUIRY"}</span>
                  <FiSend className="text-sm" />
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}