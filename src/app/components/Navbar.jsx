"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FiHome,
  FiLayers,
  FiCompass,
  FiInfo,
  FiPhone,
  FiLogIn,
  FiLogOut,
  FiGrid,
  FiUser,
} from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Auth User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: "Home", href: "/", icon: <FiHome className="text-xl" /> },
    { name: "Features", href: "/features", icon: <FiLayers className="text-xl" /> },
    { name: "Plan", href: "/plan", icon: <FiCompass className="text-xl" /> },
    { name: "About", href: "/about", icon: <FiInfo className="text-xl" /> },
    { name: "Contact", href: "/contact", icon: <FiPhone className="text-xl" /> },
  ];

  // 1. Fetch User Session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // 2. Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("userSession");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Avatar First Letter / Question Mark Generator
  const getAvatarLetter = () => {
    if (!user) return "?"; // Logged out default

    if (user.role === "restaurant" && user.restaurantName) {
      return user.restaurantName.charAt(0).toUpperCase();
    }

    const nameToUse = user.name || user.ownerName;
    if (nameToUse) {
      return nameToUse.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <>
      {/* 🌟 PREMIUM BORDERLESS LIGHT NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white text-black transition-all duration-300">
        <div className="max-w-7xl mx-auto h-24 px-6 flex items-center justify-between">
          
          {/* Main Brand Logo */}
          <Link
            href="/"
            className="text-2xl font-black tracking-widest uppercase text-black hover:opacity-80 transition-opacity cursor-pointer"
          >
            Adyverse
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* ========================================================= */}
          {/* 💻 DESKTOP CONTROLS (BLACK AVATAR -> /profile) */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
            ) : (
              <>
                {/* Pure Black Profile Avatar Badge -> Direct Route To /profile */}
                <Link
                  href="/profile"
                  title="View Profile"
                  className="w-10 h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center transition-all duration-200 hover:bg-neutral-800 active:scale-90 shadow-sm"
                >
                  {getAvatarLetter()}
                </Link>

                {/* Login / Logout Action Button */}
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-black tracking-widest uppercase text-white bg-black rounded-full transition-all duration-200 hover:bg-neutral-800 active:scale-95 shadow-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-black tracking-widest uppercase text-white bg-black rounded-full transition-all duration-200 hover:bg-neutral-800 active:scale-95 shadow-sm"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* ========================================================= */}
          {/* 📱 MOBILE CONTROLS (BLACK AVATAR LEFT -> /profile) */}
          {/* ========================================================= */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Pure Black Profile Badge -> Direct Route To /profile */}
            <Link
              href="/profile"
              title="View Profile"
              className="w-9 h-9 rounded-full bg-black text-white font-black text-xs flex items-center justify-center transition-transform active:scale-90 shadow-sm"
            >
              {getAvatarLetter()}
            </Link>

            {/* Mobile Menu Toggler */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-3xl p-1.5 text-black hover:opacity-70 transition-opacity focus:outline-none z-50 relative"
              aria-label="Toggle Menu"
            >
              {isOpen ? <HiX className="scale-105" /> : <HiMenuAlt3 className="scale-105" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Backdrop Dim Overlay for Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Menu Panel for Mobile */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-40 p-8 pt-28 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* User Info Card in Drawer -> Click Opens /profile */}
          {user && (
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl mb-2 hover:bg-neutral-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center shrink-0">
                {getAvatarLetter()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-black uppercase truncate">
                  {user.restaurantName || user.name || "User"}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>
            </Link>
          )}

          {/* Navigation Links */}
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
              <span className="tracking-wider uppercase text-sm font-black">
                {item.name}
              </span>
            </Link>
          ))}

          {/* Profile Direct Link in Mobile Drawer */}
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-5 text-base font-bold text-black hover:bg-neutral-100 px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-98"
          >
            <FiUser className="text-xl text-black/40" />
            <span className="tracking-wider uppercase text-sm font-black">My Profile</span>
          </Link>
        </div>

        {/* Mobile Drawer Bottom Button */}
        <div className="flex flex-col gap-4 mb-4">
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-3 w-full bg-black text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-800 transition-colors active:scale-95 shadow-lg shadow-black/10"
            >
              <FiLogOut className="text-lg" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3 w-full bg-black text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-800 transition-colors active:scale-95 shadow-lg shadow-black/10"
            >
              <FiLogIn className="text-lg" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}