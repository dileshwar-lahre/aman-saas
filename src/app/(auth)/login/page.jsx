"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPhone, FiLock, FiArrowRight, FiX, FiUser } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function LoginPage() {
  const [role, setRole] = useState("owner"); // 'owner' ya 'customer'
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in as ${role === "owner" ? "Restaurant Owner" : "Customer"} with number: ${phone}`);
  };

  return (
    /* Card ko thoda upar shift karne ke liye `pb-28` add kiya hai container me */
    <div className="min-h-screen bg-[#F3F4F6] text-black flex items-center justify-center pb-28 font-sans antialiased select-none px-4 relative overflow-hidden">
      
      {/* 🚀 3D ELASTIC BOUNCE POPUP TIMING ENGINES */}
      <style jsx global>{`
        @keyframes isometric-3d-pop {
          0% { transform: scale(0.95) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .animate-3d-popup {
          animation: isometric-3d-pop 0.5s cubic-bezier(0.34, 1.6, 0.64, 1) forwards;
        }
      `}</style>

      {/* 🌟 PREMIUM 3D FLOATING WHITE CARD CONTAINER */}
      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-8 md:p-10 relative z-50 animate-3d-popup shadow-[0_20px_50px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] border border-neutral-100">
        
        {/* Floating Mini Close Route Toggle Cross */}
        <Link 
          href="/"
          className="absolute top-6 right-6 w-8 h-8 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all active:scale-90"
        >
          <FiX className="text-sm" />
        </Link>

        {/* Header */}
        <div className="text-center space-y-1 mb-8 pt-2">
          <h1 className="text-3xl font-black tracking-widest text-black uppercase font-sans">
            LOGIN
          </h1>
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            stonenox Secure Node
          </p>
        </div>

        {/* Dynamic Dual Role Segment Tabs Control */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-[0.98] ${
              role === "owner" 
                ? "bg-black text-white font-black shadow-md shadow-black/10" 
                : "bg-neutral-50 text-neutral-400 font-bold hover:text-black hover:bg-neutral-100"
            }`}
          >
            <LuChefHat className="text-xs" />
            <span className="text-[10px] font-black tracking-widest uppercase">Restaurant</span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-[0.98] ${
              role === "customer" 
                ? "bg-black text-white font-black shadow-md shadow-black/10" 
                : "bg-neutral-50 text-neutral-400 font-bold hover:text-black hover:bg-neutral-100"
            }`}
          >
            <FiUser className="text-xs" />
            <span className="text-[10px] font-black tracking-widest uppercase">Customer</span>
          </button>
        </div>

        {/* 📋 STRICT MANUAL LOGIN FORM ROUTING */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Phone Input Module */}
          <div className="relative flex items-center">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
            />
            <FiPhone className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
          </div>

          {/* Password Input Module */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
              />
              <FiLock className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
            </div>

            {/* Forget Password Anchor Link */}
            <div className="text-right pr-2">
              <a href="#" className="text-[10px] font-bold text-neutral-400 tracking-tight hover:text-black transition-colors">
                Forget Your Password ?
              </a>
            </div>
          </div>

          {/* 💥 ORANGE LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md mt-6 hover:brightness-110"
            style={{ backgroundColor: "#FF9900", boxShadow: "0 4px 14px rgba(255, 153, 0, 0.4)" }}
          >
            <span>LOGIN</span>
            <FiArrowRight className="text-sm" />
          </button>
        </form>

        {/* Footer Navigation Link Setup */}
        <div className="text-center pt-6 mt-6 border-t border-neutral-100">
          <Link 
            href="/register" 
            className="text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            style={{ color: "#FF9900" }}
          >
            Sign Up
          </Link>
        </div>

      </div>

      {/* Decorative Blur Background Highlights */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neutral-900/[0.02] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}