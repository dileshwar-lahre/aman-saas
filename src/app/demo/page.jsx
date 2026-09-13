'use client';

import { useState } from 'react';

export default function DemoPage() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // New state: Jab OTP verify ho jayega toh ye true ho jayega aur form hat jayega
  const [isVerified, setIsVerified] = useState(false);

  // 1. Send WhatsApp OTP
  const handleSend = async () => {
    if (!mobile || mobile.length < 10) return alert('Sahi mobile number enter karo!');
    setLoading(true);
    setResponseMsg('');
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setResponseMsg('WhatsApp par OTP bhej diya gaya hai!');
      } else {
        setIsSuccess(false);
        setResponseMsg(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setIsSuccess(false);
      setResponseMsg('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerify = async () => {
    if (!mobile || !otp) return alert('Mobile aur OTP dono enter karo!');
    setLoading(true);
    setResponseMsg('');
    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      
      // Fast2SMS success check (agar data.return true hai ya status ok hai)
      if (res.ok && data.data?.return) {
        setIsSuccess(true);
        setResponseMsg('OTP successfully verify ho gaya!');
        // Form hide karne ke liye ye true kar diya
        setIsVerified(true);
      } else {
        setIsSuccess(false);
        setResponseMsg(data.data?.message || 'Invalid OTP. Dobara try karo!');
      }
    } catch (err) {
      setIsSuccess(false);
      setResponseMsg('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP
  const handleResend = async () => {
    if (!mobile) return alert('Mobile number enter karo!');
    setLoading(true);
    setResponseMsg('');
    try {
      const res = await fetch('/api/whatsapp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setResponseMsg('Naya OTP dobara bhej diya gaya hai!');
      } else {
        setIsSuccess(false);
        setResponseMsg(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setIsSuccess(false);
      setResponseMsg('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-white tracking-wide">WhatsApp OTP Verification</h1>
          <p className="text-xs text-slate-400 mt-1">Next.js & Tailwind Integration</p>
        </div>

        {/* Agar OTP verify ho gaya toh form hide ho kar ye success message/screen dikhegi */}
        {isVerified ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-lg font-bold text-white">Verification Successful!</h2>
            <p className="text-xs text-slate-400">Aapka mobile number ({mobile}) successfully verify ho gaya hai.</p>
            <button
              onClick={() => {
                setIsVerified(false);
                setOtp('');
                setResponseMsg('');
              }}
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-xl text-xs transition border border-slate-700 cursor-pointer"
            >
              Verify Another Number
            </button>
          </div>
        ) : (
          /* Normal Form */
          <div className="space-y-4">
            {/* Mobile Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Mobile Number</label>
              <input
                type="text"
                placeholder="Enter 10-digit number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">OTP Code</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-2 rounded-xl text-xs transition disabled:opacity-50 shadow-md cursor-pointer"
              >
                Send
              </button>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-2 rounded-xl text-xs transition disabled:opacity-50 shadow-md cursor-pointer"
              >
                Verify
              </button>
              <button
                onClick={handleResend}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 px-2 rounded-xl text-xs transition disabled:opacity-50 shadow-md cursor-pointer"
              >
                Resend
              </button>
            </div>
          </div>
        )}

        {/* Response Message Box */}
        {responseMsg && !isVerified && (
          <div className={`mt-6 p-3.5 rounded-xl text-xs font-mono break-words border ${isSuccess ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'}`}>
            <span className="font-bold">{isSuccess ? 'Success: ' : 'Error: '}</span> {responseMsg}
          </div>
        )}

      </div>
    </div>
  );
}