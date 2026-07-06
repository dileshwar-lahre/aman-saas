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
      {/* Standard Header Navbar Layout */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 text-white">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          
          {/* Main Brand Logo */}
          <Link 
            href="/" 
            className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent uppercase"
          >
            Adyverse
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-neutral-400">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="hover:text-white transition-all duration-300 relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-black bg-white rounded-full transition-all duration-300 hover:bg-neutral-200 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            >
              Login
            </Link>
          </div>

          {/* Mobile Toggler Button (Right aligned - exact place toggles between Menu and Cut) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-2xl p-2 text-neutral-300 hover:text-white transition-all duration-300 focus:outline-none z-50 relative"
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiX className="scale-110 rotate-90" /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Backdrop Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Menu Panel - Slides from Left, Pure Black Background */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-black border-r border-white/10 z-40 p-6 pt-24 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Items with Icons */}
        <div className="flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all duration-200 group active:scale-98"
            >
              <span className="text-neutral-500 group-hover:text-white transition-colors">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Bottom Login Button */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="h-[1px] bg-white/10 w-full" />
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-3 w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-neutral-200 transition-colors active:scale-95 shadow-md"
          >
            <FiLogIn className="text-lg" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </>
  );
}