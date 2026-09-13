"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

  // Fetch Current Session
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

  // Logout Handler with Confirmation
  const handleLogout = async () => {
    const isConfirmed = window.confirm("Kya aap sach me logout karna chahte hain?");
    if (!isConfirmed) return;

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

  // Avatar First Letter Generator
  const getAvatarLetter = () => {
    if (!user) return "?";

    if (user.role === "restaurant" && user.restaurantName) {
      return user.restaurantName.charAt(0).toUpperCase();
    }

    const nameToUse = user.name || user.ownerName;
    if (nameToUse) {
      return nameToUse.charAt(0).toUpperCase();
    }

    return "U";
  };

  const profileUrl = user?.role === "customer" ? "/dashboard/profile" : "/profile";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white text-black transition-all duration-300">
        {/* Navbar Height Expanded for Extra Massive Logo Presence */}
        <div className="max-w-7xl mx-auto h-36 md:h-44 px-6 flex items-center justify-between">
          
          {/* 🖼️ BRAND LOGO - MAXIMUM ULTRA SIZE */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity cursor-pointer py-1">
            <Image
              src="/images/ady.png"
              alt="Adyverse Logo"
              width={650}
              height={260}
              priority
              className="h-32 sm:h-36 md:h-40 w-auto object-contain scale-125 origin-left"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest uppercase text-neutral-600">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-[#E23744] transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
            ) : (
              <>
                {user ? (
                  <>
                    <Link
                      href={profileUrl}
                      title="Open Dashboard Profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-red-50/60 border border-red-100 hover:border-[#E23744] transition-all group active:scale-95"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#E23744] text-white font-black text-xs flex items-center justify-center shadow-sm">
                        {getAvatarLetter()}
                      </div>
                      <span className="text-xs font-black uppercase text-neutral-800 group-hover:text-[#E23744] transition-colors max-w-[120px] truncate">
                        {user.restaurantName || user.name || "Profile"}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-black tracking-widest uppercase text-white bg-[#E23744] rounded-full transition-all duration-200 hover:bg-red-700 active:scale-95 shadow-md shadow-red-500/20"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      title="Guest User"
                      className="w-11 h-11 rounded-full bg-neutral-100 text-neutral-400 font-black text-sm flex items-center justify-center border border-neutral-200 select-none"
                    >
                      ?
                    </div>

                    <Link
                      href="/login"
                      className="relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-black tracking-widest uppercase text-white bg-[#E23744] rounded-full transition-all duration-200 hover:bg-red-700 active:scale-95 shadow-md shadow-red-500/20"
                    >
                      Login
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            {user ? (
              <Link
                href={profileUrl}
                title="View Profile"
                className="w-10 h-10 rounded-full bg-[#E23744] text-white font-black text-xs flex items-center justify-center transition-transform active:scale-90 shadow-sm"
              >
                {getAvatarLetter()}
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 font-black text-xs flex items-center justify-center border border-neutral-200">
                ?
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-3xl p-2 text-black hover:text-[#E23744] transition-colors focus:outline-none z-50 relative"
              aria-label="Toggle Menu"
            >
              {isOpen ? <HiX className="scale-105" /> : <HiMenuAlt3 className="scale-105" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Backdrop Dim Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer Panel (Top offset adjusted for large navbar) */}
      <div
        className={`fixed top-36 md:top-44 right-0 bottom-0 w-[85%] max-w-[320px] bg-white z-40 p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl border-t border-neutral-100 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 overflow-y-auto">
          {user && (
            <Link
              href={profileUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 bg-red-50/60 rounded-2xl mb-2 hover:bg-red-50 transition-colors border border-red-100/50"
            >
              <div className="w-10 h-10 rounded-full bg-[#E23744] text-white font-black text-sm flex items-center justify-center shrink-0">
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

          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-sm font-bold text-neutral-700 hover:text-[#E23744] hover:bg-red-50/50 px-4 py-3 rounded-xl transition-all duration-200 group active:scale-98"
            >
              <span className="text-neutral-400 group-hover:text-[#E23744] transition-colors">
                {item.icon}
              </span>
              <span className="tracking-wider uppercase text-xs font-black">
                {item.name}
              </span>
            </Link>
          ))}

          {user && (
            <Link
              href={profileUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-sm font-bold text-neutral-700 hover:text-[#E23744] hover:bg-red-50/50 px-4 py-3 rounded-xl transition-all duration-200 active:scale-98"
            >
              <FiUser className="text-lg text-neutral-400" />
              <span className="tracking-wider uppercase text-xs font-black">Dashboard Profile</span>
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-3 w-full bg-[#E23744] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-red-700 transition-colors active:scale-95 shadow-md shadow-red-500/20"
            >
              <FiLogOut className="text-base" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3 w-full bg-[#E23744] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-red-700 transition-colors active:scale-95 shadow-md shadow-red-500/20"
            >
              <FiLogIn className="text-base" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}