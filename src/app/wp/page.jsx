"use client";

import React, { useState } from "react";

export default function WhatsAppOtpPage() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input");
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setStatusNote("");

    if (!mobile || mobile.length < 10) {
      alert("10-digit mobile number enter karein");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.warning) {
          setStatusNote(data.warning);
        }
        setStep("verify");
      } else {
        alert(data.error || "OTP send failed!");
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("OTP daalna zaroori hai");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await res.json();

      if (data.success) {
        setStep("done");
      } else {
        alert(data.error || "Galat OTP!");
      }
    } catch (err) {
      alert("Verification Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mb-1">
            Fast2SMS / WhatsApp Gateway
          </div>
          <h1 className="text-xl font-bold tracking-tight">OTP Verification</h1>
        </div>

        {statusNote && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs text-center font-medium">
            Note: {statusNote}
          </div>
        )}

        {step === "input" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-400 block mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-neutral-400 text-center">
              OTP sent to <span className="text-white font-bold">{mobile}</span>
            </p>

            <div>
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("input");
                setStatusNote("");
              }}
              className="w-full text-xs text-neutral-500 hover:text-neutral-400 py-1"
            >
              Change Mobile Number
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto">
              ✓
            </div>
            <h2 className="text-lg font-bold">Verified Successfully!</h2>
            <button
              onClick={() => {
                setStep("input");
                setOtp("");
                setStatusNote("");
              }}
              className="text-xs text-emerald-400 underline font-bold"
            >
              Test Another Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}