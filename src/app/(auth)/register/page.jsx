"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiKey,
  FiLock,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function RegisterPage() {
  const router = useRouter();

  // Multi-step Navigation: 1 = Details, 2 = WhatsApp OTP, 3 = Password Setup
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("owner");

  // Form Fields
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Role-based Fields
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. STEP 1: Send OTP to WhatsApp Phone Number
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!phone || phone.replace(/[^0-9]/g, "").length < 10) {
      setMessage({ type: "error", text: "Valid 10-digit WhatsApp Phone Number daalein!" });
      return;
    }

    if (!email) {
      setMessage({ type: "error", text: "Gmail address zaroori hai!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/[^0-9]/g, "").slice(-10),
          email,
          role,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(2);
        setMessage({
          type: "success",
          text: "WhatsApp par 4-digit OTP bhej diya gaya hai!",
        });
      } else {
        setMessage({ type: "error", text: data.error || "OTP send nahi ho paya!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server Connection Failed!" });
    } finally {
      setLoading(false);
    }
  };

  // 2. STEP 2: Verify WhatsApp OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 4) {
      setMessage({ type: "error", text: "Kripya valid 4-digit OTP enter karein!" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/[^0-9]/g, "").slice(-10),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(3);
        setMessage({ type: "success", text: "OTP Verified! Create your password." });
      } else {
        setMessage({ type: "error", text: data.error || "Galat OTP!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "OTP Verification Failed!" });
    } finally {
      setLoading(false);
    }
  };

  // 3. STEP 3: Create Password & Register -> Redirect to Login
  const handleFinalRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Password aur Confirm Password match nahi ho rahe!",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password kam se kam 6 characters ka hona chahiye!",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
    const endpoint =
      role === "customer"
        ? "/api/auth/register-user"
        : "/api/auth/register-restaurant";

    const payload =
      role === "customer"
        ? { name, email, phone: cleanPhone, password, otp: otp.trim() }
        : {
            restaurantName,
            ownerName,
            email,
            phone: cleanPhone,
            location,
            password,
            otp: otp.trim(),
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "🎉 Registration Successful! Redirecting to Login...",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error during registration!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-black flex items-center justify-center pb-28 font-sans antialiased select-none px-4 relative overflow-hidden">
      <style jsx global>{`
        @keyframes isometric-3d-pop {
          0% {
            transform: scale(0.92) translateY(30px);
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

      {/* Main Registration Card Container */}
      <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 md:p-10 relative z-50 animate-3d-popup shadow-[0_20px_50px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] border border-neutral-100">
        
        {/* Floating Close Button */}
        <Link
          href="/"
          className="absolute top-6 right-6 w-8 h-8 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 hover:text-black hover:bg-neutral-100 transition-all active:scale-90"
        >
          <FiX className="text-sm" />
        </Link>

        {/* Header */}
        <div className="text-center space-y-1 mb-6 pt-2">
          <h1 className="text-3xl font-black tracking-widest text-black uppercase font-sans">
            {step === 1 && "REGISTER"}
            {step === 2 && "VERIFY OTP"}
            {step === 3 && "SET PASSWORD"}
          </h1>
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            WhatsApp Secured • Step {step} of 3
          </p>
        </div>

        {/* Status Alert Banner */}
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

        {/* STEP 1: DETAILS & PHONE FORM */}
        {step === 1 && (
          <div className="animate-3d-popup">
            {/* Dynamic Role Switch Tabs */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setRole("owner");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-[0.98] ${
                  role === "owner"
                    ? "bg-black text-white font-black shadow-md shadow-black/10"
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
                    ? "bg-black text-white font-black shadow-md shadow-black/10"
                    : "bg-neutral-50 text-neutral-400 font-bold hover:text-black hover:bg-neutral-100"
                }`}
              >
                <FiUser className="text-xs" />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  Customer
                </span>
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-3.5">
              {role === "customer" && (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                  />
                  <FiUser className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
                </div>
              )}

              {role === "owner" && (
                <>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="Restaurant Name"
                      className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                    />
                    <LuChefHat className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Owner Name"
                      className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                    />
                    <FiUser className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location / Address"
                      className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                    />
                    <FiMapPin className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
                  </div>
                </>
              )}

              {/* WhatsApp Mobile Number Field */}
              <div className="relative flex items-center">
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                />
                <FiPhone className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
              </div>

              {/* Gmail Address Field */}
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Gmail Address"
                  className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                />
                <FiMail className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md mt-6 hover:brightness-110 disabled:opacity-50"
                style={{
                  backgroundColor: "#FF9900",
                  boxShadow: "0 4px 14px rgba(255, 153, 0, 0.4)",
                }}
              >
                <span>{loading ? "SENDING WHATSAPP OTP..." : "SEND OTP CODE"}</span>
                <FiArrowRight className="text-sm" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: WHATSAPP OTP POPUP SCREEN */}
        {step === 2 && (
          <div className="animate-3d-popup space-y-4">
            <div className="text-center bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <FiShield className="mx-auto text-xl text-[#FF9900] mb-1" />
              <p className="text-xs font-bold text-neutral-700">
                OTP Sent to WhatsApp: <span className="text-black">{phone}</span>
              </p>
              <p className="text-[10px] text-neutral-400">
                Primary phone ke WhatsApp app me code check karein.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-Digit OTP"
                  className="w-full bg-[#F3F4F6] border border-black rounded-full py-4 pl-6 pr-12 text-sm font-black text-black tracking-[8px] placeholder-normal placeholder:tracking-normal placeholder-neutral-400 focus:outline-none focus:bg-white transition-all shadow-inner text-center"
                />
                <FiKey className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
              </div>

              <div className="flex items-center justify-between px-2 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-neutral-400 hover:text-black transition-colors"
                >
                  ← Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[#FF9900] hover:underline"
                >
                  Resend OTP ?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md mt-4 hover:brightness-110 disabled:opacity-50"
                style={{
                  backgroundColor: "#FF9900",
                  boxShadow: "0 4px 14px rgba(255, 153, 0, 0.4)",
                }}
              >
                <span>{loading ? "VERIFYING..." : "VERIFY OTP"}</span>
                <FiCheckCircle className="text-sm" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: CREATE & CONFIRM PASSWORD SCREEN */}
        {step === 3 && (
          <div className="animate-3d-popup space-y-4">
            <div className="text-center bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700">
                ✅ WhatsApp Verified! Create a strong password.
              </p>
            </div>

            <form onSubmit={handleFinalRegister} className="space-y-3.5">
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password (min 6 characters)"
                  className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                />
                <FiLock className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
              </div>

              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-[#F3F4F6] border border-neutral-200/40 rounded-full py-4 pl-6 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                />
                <FiLock className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-black text-xs uppercase tracking-widest py-4.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md mt-6 hover:brightness-110 disabled:opacity-50"
                style={{
                  backgroundColor: "#FF9900",
                  boxShadow: "0 4px 14px rgba(255, 153, 0, 0.4)",
                }}
              >
                <span>{loading ? "CREATING ACCOUNT..." : "FINALIZE REGISTRATION"}</span>
                <FiCheckCircle className="text-sm" />
              </button>
            </form>
          </div>
        )}

        {/* Footer Navigation Link */}
        <div className="text-center pt-6 mt-6 border-t border-neutral-100">
          <Link
            href="/login"
            className="text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            style={{ color: "#FF9900" }}
          >
            Already Have An Account? Login
          </Link>
        </div>
      </div>

      {/* Decorative Highlights */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-neutral-900/[0.02] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}