"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiHome, FiLayers, FiCompass, FiInfo, FiPhone, FiLogIn } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "/", icon: <FiHome className="text-xl" /> },
    { name: "Features", href: "/features", icon: <FiLayers className="text-xl" /> },
    { name: "Plan", href: "/plan", icon: <FiCompass className="text-xl" /> },
    { name: "About", href: "/about", icon: <FiInfo className="text-xl" /> },
    { name: "Contact", href: "/contact", icon: <FiPhone className="text-xl" /> },
  ];

  return (
    <>
      {/* 🌟 PREMIUM BORDERLESS HIGH-CONTRAST LIGHT NAVBAR */}
      {/* Height ko h-24 karke bada aur premium banaya hai, aur koi border nahi hai */}
      <nav className="sticky top-0 z-50 w-full bg-white text-black transition-all duration-300">
        <div className="max-w-7xl mx-auto h-24 px-6 flex items-center justify-between">
          
          {/* Main Brand Logo - Replaced with Adyverse as requested */}
          <Link 
            href="/" 
            className="text-2xl font-black tracking-widest uppercase text-black hover:opacity-80 transition-opacity cursor-pointer"
          >
            Adyverse
          </Link>

          {/* Desktop Links - Pure Black typography, minimal aesthetics */}
          <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest uppercase text-black/70">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="hover:text-black transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Login Button - Rounded clean minimalist style */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="relative inline-flex items-center justify-center px-7 py-3 text-xs font-black tracking-widest uppercase text-white bg-black rounded-full transition-all duration-200 hover:bg-neutral-800 active:scale-95"
            >
              Login
            </Link>
          </div>

          {/* Mobile Toggler Button - Icon upgraded for a sleeker look on phones */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-3xl p-2 text-black hover:opacity-70 transition-opacity focus:outline-none z-50 relative"
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiX className="scale-105" /> : <HiMenuAlt3 className="scale-105" />}
          </button>
        </div>
      </nav>

      {/* Backdrop Dim Overlay for Mobile Drawer */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Menu Panel - Pure White Dashboard Look with No Complex Borders */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-40 p-8 pt-28 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Items with Premium spacing for Mobile devices */}
        <div className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-5 text-base font-bold text-black/80 hover:text-black hover:bg-neutral-100 px-4 py-3.5 rounded-xl transition-all duration-200 group active:scale-98"
            >
              <span className="text-black/40 group-hover:text-black transition-colors">
                {item.icon}
              </span>
              <span className="tracking-wider uppercase text-sm font-black">{item.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Mobile Bottom Login Call */}
        <div className="flex flex-col gap-4 mb-4">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-3 w-full bg-black text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-800 transition-colors active:scale-95 shadow-lg shadow-black/10"
          >
            <FiLogIn className="text-lg" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </>
  );
}