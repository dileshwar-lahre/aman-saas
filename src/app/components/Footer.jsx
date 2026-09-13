"use client";

import Link from "next/link";
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin, 
  FiArrowUpRight,
  FiPhone,
  FiMail
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#121212] border-t border-neutral-800 text-neutral-300 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-12 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="text-3xl sm:text-4xl font-black tracking-wider uppercase text-white group-hover:text-[#E23744] transition-colors">
                ADYVERSE<span className="text-[#E23744]">.</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm font-normal">
              Smart QR digital menus and automated 5-stamp loyalty systems helping cafés and restaurants turn one-time diners into regular repeat customers.
            </p>

            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-neutral-300 pt-1">
              <a 
                href="tel:8446791696" 
                className="flex items-center gap-2 hover:text-[#E23744] transition-colors"
              >
                <FiPhone className="text-[#E23744]" /> 8446791696
              </a>
              <a 
                href="mailto:support@adyverse.com" 
                className="flex items-center gap-2 hover:text-[#E23744] transition-colors"
              >
                <FiMail className="text-[#E23744]" /> support@adyverse.com
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#E23744] transition-colors">
                  Restaurant Owner
                </Link>
              </li>
              <li>
                <Link href="/login-user" className="hover:text-[#E23744] transition-colors">
                  Customer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Follow Us
            </h4>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E23744] hover:bg-[#E23744] transition-all"
                aria-label="Facebook"
              >
                <FiFacebook className="text-xs" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E23744] hover:bg-[#E23744] transition-all"
                aria-label="Twitter"
              >
                <FiTwitter className="text-xs" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E23744] hover:bg-[#E23744] transition-all"
                aria-label="Instagram"
              >
                <FiInstagram className="text-xs" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E23744] hover:bg-[#E23744] transition-all"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="text-xs" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] bg-neutral-800/80 w-full" />

        {/* Bottom Strip: Left Side Copyright, Right Side Stonenox.com */}
        <div className="flex flex-row items-center justify-between text-[11px] text-neutral-400">
          <div>
            &copy; {currentYear} <span className="text-neutral-300 font-semibold">ADYVERSE</span>. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1 font-medium">
            <span>Powered by</span>
            <a 
              href="https://stonenox.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#E23744] hover:text-red-400 font-semibold inline-flex items-center gap-0.5 group transition-colors"
            >
              Stonenox.com
              <FiArrowUpRight className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}