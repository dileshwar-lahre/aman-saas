"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";

export default function HomePage() {
  // Shuruat me hamesha false rahega taaki seedhe payment page hi khule
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45, seconds: 12 });

  // 🎯 NEW FRESH STORAGE KEY: Isse tumhara puraana test cache ignore ho jayega aur seedhe Pay screen aayegi!
  useEffect(() => {
    const savedStatus = localStorage.getItem("stonenox_prod_paid_final");
    if (savedStatus === "true" || process.env.NEXT_PUBLIC_PAYMENT_STATUS === "PAID") {
      setIsPaid(true);
    }
  }, []);

  // Countdown timer activation template
  useEffect(() => {
    if (isPaid) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
          if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaid]);

  const handleLivePayment = async () => {
    setPaymentLoading(true);
    try {
      if (typeof window === "undefined" || !window.Razorpay) {
        alert("🚨 Razorpay SDK script missing! Page ek baar refresh kijiye.");
        setPaymentLoading(false);
        return;
      }

      const res = await fetch("/api/create-order", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok || !data.success) throw new Error(data.error || "Backend creation error");

      const options = {
        key: (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "").trim(),
        amount: data.amount, // Exact ₹2,000 + 2% surcharge backend se lekar aayega
        currency: data.currency,
        name: "Stonenox Live Gateway",
        description: "Milestone Advance Setup Ledger",
        order_id: data.order_id,
        prefill: {
          name: "Mr. Aman",
          contact: "9131460470",
          method: "upi"
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Direct UPI",
                instruments: [{ method: "upi", apps: ["google_pay", "phonepe", "paytm", "bhim"] }]
              }
            },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true }
          }
        },
        handler: function (response) {
          if (response.razorpay_payment_id) {
            // 🔥 REAL CLIENT PAYMENT SUCCESS: Ab hi trigger hoga thank you page!
            alert("Ho gya hai bhai okay na yaar 👍");
            localStorage.setItem("stonenox_prod_paid_final", "true");
            setIsPaid(true); 
          }
        },
        theme: { color: "#000000" }, 
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Live Integration Gateway Error: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-white selection:text-black">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      
      {/* Navbar Minimal Setup */}
      <nav className="border-b border-zinc-900 bg-black/90 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-12 py-5 flex justify-between items-center">
        <span className="text-sm font-black tracking-widest uppercase text-white">
          start-stonenox
        </span>
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-zinc-400">
          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-white animate-pulse" : "bg-zinc-700"}`}></span>
          {isPaid ? "Build Pipeline: Active" : "Invoice Awaiting"}
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 sm:px-12 pt-16 pb-32 space-y-12">
        
        {/* Welcome Section */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white">
            Welcome Mr. Aman,
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
            Thank you for choosing <span className="text-white font-bold underline underline-offset-4">stonenox.com</span>. We are ready to deploy your elite full-stack system architecture.
          </p>
        </div>

        {/* ─── DYNAMIC CONDITION ─── */}
        {!isPaid ? (
          /* ❌ STATE 1: Pehle strictly ye payment option hi samne khulega */
          <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wide">
                Please pay advanced amount ₹2,000
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                Payment karte hi aap apna daily progress isi URL ko refresh karke dekh payenge. Next payment 1st August ko ₹8,000 rahega. Kripya niche diye gaye button se live verification complete karein.
              </p>
              <span className="inline-block text-[10px] font-mono text-zinc-500 italic">
                ※ Includes dynamically routed Razorpay transaction charges (+2%). Net ₹2,000 settles securely.
              </span>
            </div>
            
            <button 
              type="button"
              onClick={handleLivePayment}
              disabled={paymentLoading}
              className="w-full md:w-auto bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-md transition-all duration-200 shrink-0"
            >
              {paymentLoading ? "Deploying..." : "Pay ₹2,000 Now"}
            </button>
          </div>
        ) : (
          /* ✅ STATE 2: Jab client real payment kar dega, tabhi ye khulega automatic */
          <div className="space-y-10 animate-fade-in">
            <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-6 sm:p-8 border-dashed border-zinc-800 space-y-3 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">[System Status: Transaction Verified]</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Thank you! Monday se aapka kaam start ho jayega.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                Aapka payment successfully receive ho gaya hai. Abhi architecture planning, database scheme indexation aur initial modular folder structure par deployment chalega. Project ke functional layouts aapko Monday se daily refresh karne par live dikhne churu ho jayenge.
              </p>
            </div>

            {/* Countdown Frame */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                <span>COMING SOON // STONENOX PIPELINE START</span>
                <span className="animate-pulse text-white">INITIALIZING RESOURCING</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: timeLeft.days, label: "DAYS" },
                  { value: timeLeft.hours, label: "HRS" },
                  { value: timeLeft.minutes, label: "MIN" },
                  { value: timeLeft.seconds, label: "SEC" }
                ].map((slot, index) => (
                  <div key={index} className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-mono font-black tracking-tighter text-white">
                      {String(slot.value).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] font-bold text-zinc-600 tracking-wider uppercase">
                      {slot.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-[10px] tracking-widest uppercase text-zinc-600 fixed bottom-0 left-0 w-full z-40">
        Managed by start-stonenox pipeline
      </footer>
    </div>
  );
}