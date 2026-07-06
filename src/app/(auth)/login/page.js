"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPhone, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function LoginPage() {
  const [role, setRole] = useState("owner"); // 'owner' ya 'customer'
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in as ${role === "owner" ? "Restaurant Owner" : "Customer"} with number: ${phone}`);
    // Yahan direct database api pipeline connect hogi baad me
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans flex items-center justify-center px-6 py-12 selection:bg-white selection:text-black">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Adyverse
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-white pt-2">Welcome Back Portal</h2>
          <p className="text-xs text-neutral-500">Select your role to access your synchronized dashboard node.</p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${role === "owner" ? "border-white bg-white/5 text-white font-bold" : "border-neutral-900 bg-neutral-900/20 text-neutral-500 hover:text-neutral-300"}`}
          >
            <LuChefHat className="text-lg" />
            <span className="text-xs uppercase tracking-wider">Restaurant</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${role === "customer" ? "border-white bg-white/5 text-white font-bold" : "border-neutral-900 bg-neutral-900/20 text-neutral-500 hover:text-neutral-300"}`}
          >
            <FiUser className="text-lg" />
            <span className="text-xs uppercase tracking-wider">Customer</span>
          </button>
        </div>

        <div className="h-[1px] bg-neutral-900 w-full my-6" />

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
            <div className="relative flex items-center">
              <FiPhone className="absolute left-4 text-neutral-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-[11px] text-neutral-500 hover:text-white transition-colors">Forgot?</a>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 text-sm font-sans active:scale-95 shadow-md mt-2"
          >
            <span>Sign In to Dashboard</span>
            <FiArrowRight />
          </button>
        </form>

        {/* Footer Link to Registration */}
        <div className="text-center pt-6 mt-6 border-t border-neutral-900">
          <p className="text-xs text-neutral-500">
            Don't have an infrastructure account?{" "}
            <Link href="/register" className="text-white font-bold hover:underline transition-all">
              Sign Up Free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}