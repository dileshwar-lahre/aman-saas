"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUser, FiPhone, FiLock, FiShield, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function RegisterPage() {
  const [role, setRole] = useState("owner"); // 'owner' ya 'customer'
  const [step, setStep] = useState(1);       // Step management state

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      alert(`Account setup successful for ${formData.username}! Initializing DB node.`);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans flex items-center justify-center px-6 py-12 selection:bg-white selection:text-black">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Adyverse
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-white pt-2">Create New Account</h2>
          <p className="text-xs text-neutral-500">Deploy your custom isolated profile instance node.</p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            disabled={step > 1}
            onClick={() => setRole("owner")}
            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${step > 1 ? "opacity-40 cursor-not-allowed" : ""} ${role === "owner" ? "border-white bg-white/5 text-white font-bold" : "border-neutral-900 bg-neutral-900/20 text-neutral-500 hover:text-neutral-300"}`}
          >
            <LuChefHat className="text-lg" />
            <span className="text-xs uppercase tracking-wider">Restaurant</span>
          </button>
          <button
            type="button"
            disabled={step > 1}
            onClick={() => setRole("customer")}
            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${step > 1 ? "opacity-40 cursor-not-allowed" : ""} ${role === "customer" ? "border-white bg-white/5 text-white font-bold" : "border-neutral-900 bg-neutral-900/20 text-neutral-500 hover:text-neutral-300"}`}
          >
            <FiUser className="text-lg" />
            <span className="text-xs uppercase tracking-wider">Customer</span>
          </button>
        </div>

        <div className="h-[1px] bg-neutral-900 w-full my-5" />

        {/* Flow Indicators */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-neutral-600 mb-6 px-1">
          <span className={step >= 1 ? "text-white" : ""}>01. Profile</span>
          <span className={step >= 2 ? "text-white" : ""}>—— 02. OTP</span>
          <span className={step >= 3 ? "text-white" : ""}>—— 03. Secure</span>
        </div>

        {/* Register Multi-Step Form */}
        <form onSubmit={handleNextStep} className="space-y-4">
          
          {/* STEP 1: Name and Phone */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name / Brand Name</label>
                <div className="relative flex items-center">
                  <FiUser className="absolute left-4 text-neutral-500" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g., Aman Lahre"
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mobile Number</label>
                <div className="relative flex items-center">
                  <FiPhone className="absolute left-4 text-neutral-500" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Entry Panel */}
          {step === 2 && (
            <div className="space-y-4 text-center animate-fadeIn">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Verification Token</label>
                <div className="relative flex items-center">
                  <FiShield className="absolute left-4 text-neutral-500" />
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors font-mono tracking-widest"
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500">
                Verification token broadcasted to <span className="text-white font-medium">{formData.phone}</span>.
              </p>
            </div>
          )}

          {/* STEP 3: Create Secure Access Pass */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Create Password</label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-neutral-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-neutral-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Step Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-12 h-12 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              >
                <FiArrowLeft />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <span>{step === 3 ? "Deploy Secure System Instance" : "Verify & Next"}</span>
              <FiArrowRight />
            </button>
          </div>
        </form>

        {/* Footer Link back to login */}
        <div className="text-center pt-6 mt-6 border-t border-neutral-900">
          <p className="text-xs text-neutral-500">
            Already operating an account stack?{" "}
            <Link href="/login" className="text-white font-bold hover:underline transition-all">
              Log In Instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}