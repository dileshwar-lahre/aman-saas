"use client";

import Link from "next/link";
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiArrowUpRight 
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-neutral-900 text-white font-sans w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Main Links Grid - Smooth columns on desktop, clean single column stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand/About Section */}
          <div className="space-y-3">
            <Link 
              href="/" 
              className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent"
            >
              Adyverse
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Building next-generation digital ecosystems. Elevating ideas into scalable web and mobile architectures.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>

          {/* Product/Explore Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="/features" className="hover:text-white transition-colors duration-200">Features</Link></li>
              <li><Link href="/plan" className="hover:text-white transition-colors duration-200">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Social Platforms - Clean row layout */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Connect With Us</h4>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-95">
                <FiFacebook className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-95">
                <FiTwitter className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-95">
                <FiInstagram className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-95">
                <FiLinkedin className="text-lg" />
              </a>
            </div>
          </div>

        </div>

        {/* Crisp Border Divider */}
        <div className="h-[1px] bg-neutral-900 w-full my-8" />

        {/* Bottom Bar: Perfect Mobile Responsive Polish */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 text-sm text-neutral-400">
          
          {/* Rights Reserved - Left side on desktop, center/bottom on mobile */}
          <div className="text-center md:text-left tracking-wide">
            &copy; {currentYear} <span className="text-white font-bold">ADYVERSE</span>. All rights reserved.
          </div>
          
          {/* Powered by STONENOX.COM with Direct Blue Link & Arrow */}
          <div className="flex items-center gap-1.5 font-medium text-neutral-400">
            <span>Powered by</span>
            <a 
              href="https://stonenox.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:text-blue-400 font-extrabold tracking-wider transition-colors inline-flex items-center gap-0.5 group"
            >
              STONENOX.COM
              <FiArrowUpRight className="text-base transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}