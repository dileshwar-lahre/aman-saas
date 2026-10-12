"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiX,
  FiUser,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiKey,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function LoginPage() {
  const router = useRouter();

  // Role Control ('owner' ya 'customer')
  const [role, setRole] = useState("owner");

  // Form Fields
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Page Loading & Feedback States
  const [loading, setLoading] = useState(false);
  const [pageChecking, setPageChecking] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Forgot Password Modal States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Send OTP, 2 = Verify OTP, 3 = Reset Password
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ type: "", text: "" });

  // ------------------------------------------------------------------
  // ⚡ 1. AUTO-LOGIN CHECK
  // ------------------------------------------------------------------
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Role ke hisaab se auto-redirect
          const targetPath = data.user?.role === "restaurant" ? "/profile" : "/dashboard/profile";
          router.push(targetPath);
        } else {
          setPageChecking(false);
        }
      })
      .catch(() => setPageChecking(false));
  }, [router]);

  // ------------------------------------------------------------------
  // 🔐 2. LOGIN HANDLER (Mobile & Password)
  // ------------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    if (!cleanPhone || cleanPhone.length < 10 || !password) {
      setMessage({ type: "error", text: "Valid 10-digit Mobile Number aur Password zaroori hain!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          password,
          role: role === "owner" ? "restaurant" : "customer",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "🎉 Login Successful! Redirecting..." });
        setTimeout(() => {
          // ✅ FIX: Backend se aaye huye redirectPath par redirect karega
          router.push(data.redirectPath || (role === "owner" ? "/profile" : "/dashboard/profile"));
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.error || "Login Failed!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server Connection Error!" });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // 🔑 3. FORGOT PASSWORD - STEP 1: SEND OTP TO WHATSAPP
  // ------------------------------------------------------------------
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = forgotPhone.replace(/[^0-9]/g, "").slice(-10);

    if (!cleanPhone || cleanPhone.length < 10) {
      setForgotMsg({ type: "error", text: "Valid 10-digit WhatsApp Mobile Number daalein!" });
      return;
    }

    setForgotLoading(true);
    setForgotMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: cleanPhone,
          role: role === "owner" ? "restaurant" : "customer",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setForgotStep(2);
        setForgotMsg({ type: "success", text: "OTP sent to your WhatsApp!" });
      } else {
        setForgotMsg({ type: "error", text: data.error || "OTP send failed!" });
      }
    } catch (err) {
      setForgotMsg({ type: "error", text: "Server Connection Error!" });
    } finally {
      setForgotLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // 🔐 4. FORGOT PASSWORD - STEP 2: VERIFY OTP
  // ------------------------------------------------------------------
  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 4) {
      setForgotMsg({ type: "error", text: "Valid 4-Digit OTP enter karein!" });
      return;
    }

    setForgotLoading(true);
    setForgotMsg({ type: "", text: "" });

    const cleanPhone = forgotPhone.replace(/[^0-9]/g, "").slice(-10);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleanPhone, otp: forgotOtp.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setForgotStep(3);
        setForgotMsg({ type: "success", text: "OTP Verified! Set new password." });
      } else {
        setForgotMsg({ type: "error", text: data.error || "Galat OTP!" });
      }
    } catch (err) {
      setForgotMsg({ type: "error", text: "OTP Verification Error!" });
    } finally {
      setForgotLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // 🔄 5. FORGOT PASSWORD - STEP 3: RESET PASSWORD
  // ------------------------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setForgotMsg({ type: "error", text: "Passwords match nahi ho rahe!" });
      return;
    }

    if (newPassword.length < 6) {
      setForgotMsg({ type: "error", text: "Password min 6 characters ka ho!" });
      return;
    }

    setForgotLoading(true);
    setForgotMsg({ type: "", text: "" });

    const cleanPhone = forgotPhone.replace(/[^0-9]/g, "").slice(-10);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          password: newPassword,
          role: role === "owner" ? "restaurant" : "customer",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setForgotMsg({ type: "success", text: "Password successfully updated!" });
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotStep(1);
          setPhone(cleanPhone);
          setPassword(newPassword);
        }, 1500);
      } else {
        setForgotMsg({ type: "error", text: data.error || "Reset failed!" });
      }
    } catch (err) {
      setForgotMsg({ type: "error", text: "Server Error!" });
    } finally {
      setForgotLoading(false);
    }
  };

  if (pageChecking) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <p className="text-xs font-black tracking-widest text-red-600 uppercase animate-pulse">
          VERIFYING SESSION...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-black flex items-center justify-center pb-28 font-sans antialiased select-none px-4 relative overflow-hidden">
      <style jsx global>{`
        @keyframes isometric-3d-pop {
          0% {
            transform: scale(0.94) translateY(30px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0px);
            opacity: 1;
          }
        }
        .animate-3d-popup {
          animation: isometric-3d-pop 0.4s cubic-bezier(0.34, 1.6, 0.64, 1) forwards;
        }
      `}</style>

      {/* 🌟 PREMIUM 3D FLOATING CARD (Red Theme) */}
      <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] p-8 md:p-10 relative z-50 animate-3d-popup shadow-[0_20px_50px_rgba(220,38,38,0.1),0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] border border-red-50">
        
        {/* Close Button */}
        <Link
          href="/"
          className="absolute top-6 right-6 w-8 h-8 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
        >
          <FiX className="text-sm" />
        </Link>

        {/* Header */}
        <div className="text-center space-y-1 mb-8 pt-2">
          <h1 className="text-3xl font-black tracking-widest text-neutral-900 uppercase font-sans">
            LOGIN
          </h1>
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            WhatsApp Secured Node
          </p>
        </div>

        {/* Dynamic Dual Role Segment Tabs */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole("owner");
              setMessage({ type: "", text: "" });
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-[0.98] ${
              role === "owner"
                ? "bg-red-600 text-white font-black shadow-lg shadow-red-600/20"
                : "bg-neutral-50 text-neutral-400 font-bold hover:text-black hover:bg-neutral-100"
            }`}
          >
            <LuChefHat className="text-xs" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              Restaurant
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("customer");
              setMessage({ type: "", text: "" });
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-[0.98] ${
              role === "customer"
                ? "bg-red-600 text-white font-black shadow-lg shadow-red-600/20"
                : "bg-neutral-50 text-neutral-400 font-bold hover:text-black hover:bg-neutral-100"
            }`}
          >
            <FiUser className="text-xs" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              Customer
            </span>
          </button>
        </div>

        {/* Status Message Notification */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-2xl text-[11px] font-bold text-center transition-all ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 📋 LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* WhatsApp Mobile Number Input */}
          <div className="relative flex items-center">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp Mobile Number"
              className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
            />
            <FiPhone className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
          </div>

          {/* Password Input With Eye Toggle */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 text-neutral-400 hover:text-black transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <FiEyeOff className="text-sm" />
                ) : (
                  <FiEye className="text-sm" />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right pr-2">
              <button
                type="button"
                onClick={() => {
                  setForgotPhone(phone);
                  setForgotStep(1);
                  setForgotMsg({ type: "", text: "" });
                  setIsForgotOpen(true);
                }}
                className="text-[10px] font-bold text-neutral-400 hover:text-red-600 transition-colors"
              >
                Forget Your Password ?
              </button>
            </div>
          </div>

          {/* 💥 RED LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md mt-6 hover:brightness-110 disabled:opacity-50 bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)]"
          >
            <span>{loading ? "VERIFYING..." : "LOGIN"}</span>
            <FiArrowRight className="text-sm" />
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="text-center pt-6 mt-6 border-t border-neutral-100">
          <Link
            href="/register"
            className="text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all text-red-600"
          >
            Don't Have An Account? Sign Up
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🔑 FORGOT PASSWORD 3-STEP POPUP MODAL */}
      {/* ========================================================= */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-[2rem] p-6 md:p-8 relative animate-3d-popup shadow-2xl border border-neutral-100">
            
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 hover:text-red-600 transition-all"
            >
              <FiX className="text-sm" />
            </button>

            <div className="text-center space-y-1 mb-6">
              <h2 className="text-xl font-black tracking-wider text-black uppercase">
                RESET PASSWORD
              </h2>
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Step {forgotStep} of 3
              </p>
            </div>

            {forgotMsg.text && (
              <div
                className={`mb-4 p-2.5 rounded-xl text-[11px] font-bold text-center ${
                  forgotMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {forgotMsg.text}
              </div>
            )}

            {/* STEP 1: ENTER PHONE */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="WhatsApp Mobile Number"
                    className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-10 text-xs font-bold text-black focus:outline-none focus:bg-white focus:border-red-600"
                  />
                  <FiPhone className="absolute right-4 text-neutral-400 text-sm pointer-events-none" />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full text-white font-black text-xs uppercase py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)]"
                >
                  <span>{forgotLoading ? "SENDING..." : "SEND RESET OTP"}</span>
                  <FiArrowRight className="text-sm" />
                </button>
              </form>
            )}

            {/* STEP 2: VERIFY OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter 4-Digit OTP"
                    className="w-full bg-[#F9FAFB] border border-red-600 rounded-full py-3.5 pl-5 pr-10 text-xs font-black text-black tracking-[6px] text-center focus:outline-none focus:bg-white"
                  />
                  <FiKey className="absolute right-4 text-neutral-400 text-sm pointer-events-none" />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full text-white font-black text-xs uppercase py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)]"
                >
                  <span>{forgotLoading ? "VERIFYING..." : "VERIFY OTP"}</span>
                  <FiCheckCircle className="text-sm" />
                </button>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-10 text-xs font-bold text-black focus:outline-none focus:bg-white focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 text-neutral-400 hover:text-black"
                  >
                    {showNewPassword ? (
                      <FiEyeOff className="text-sm" />
                    ) : (
                      <FiEye className="text-sm" />
                    )}
                  </button>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-10 text-xs font-bold text-black focus:outline-none focus:bg-white focus:border-red-600"
                  />
                  <FiLock className="absolute right-4 text-neutral-400 text-sm pointer-events-none" />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full text-white font-black text-xs uppercase py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 mt-2 bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)]"
                >
                  <span>
                    {forgotLoading ? "RESETTING..." : "SAVE NEW PASSWORD"}
                  </span>
                  <FiCheckCircle className="text-sm" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Decorative Blur Highlights */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-900/[0.03] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}