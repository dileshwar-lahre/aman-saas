"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiCamera, FiMapPin, FiChevronRight, FiGift, FiBookOpen } from "react-icons/fi";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [scannedList, setScannedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cid = localStorage.getItem("ady_customer_id");
    if (!cid) {
      cid = "cust_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("ady_customer_id", cid);
    }
    setCustomerId(cid);
    fetchScannedRestaurants(cid);
  }, []);

  const fetchScannedRestaurants = async (cid) => {
    try {
      const res = await fetch(`/api/user/scanned-restaurants?customerId=${cid}`);
      const data = await res.json();
      if (data.success) {
        setScannedList(data.scannedRestaurants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📷 Camera trigger karne ke liye file input click hoga
  const handleScanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 📸 Jaise hi photo click hogi, yeh function photo ke andar ke QR ko scan karke page par bhej dega!
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-hidden-container");
      const decodedText = await html5QrCode.scanFile(file, true);
      
      if (decodedText) {
        if (decodedText.startsWith("http")) {
          router.push(decodedText.replace(window.location.origin, ""));
        } else {
          router.push(`/restaurant/${decodedText}/loyalty`);
        }
      }
    } catch (err) {
      alert("QR code read nahi ho paya. Kripya saaf photo dubara click karein!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">
        User Dashboard Load Ho Raha Hai...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16 font-sans">
      {/* Hidden file input jo photo capture karega */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Hidden div required by html5-qrcode file scanner */}
      <div id="qr-reader-hidden-container" className="hidden"></div>

      {/* Top Red Bar */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 shadow-xl rounded-b-[2.5rem]">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <span className="bg-white/20 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white">
              Customer Hub
            </span>
            <h1 className="text-2xl font-black mt-2">My Dining Passbook</h1>
            <p className="text-xs text-red-100">Aapke saare scanned restaurants ek jagah</p>
          </div>

          <button
            onClick={handleScanClick}
            className="bg-white text-red-600 p-3.5 rounded-2xl shadow-lg font-black text-xs uppercase flex items-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
          >
            <FiCamera className="text-lg" /> Scan QR
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">
            Scanned Restaurants ({scannedList.length})
          </h2>
        </div>

        {scannedList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3 shadow-xl">
            <FiBookOpen className="text-4xl text-slate-600 mx-auto" />
            <h3 className="text-base font-black text-slate-300">Koi Restaurant Scan Nahi Kiya!</h3>
            <p className="text-xs text-slate-500">
              Restaurant me jaakar unka Table QR code scan karein aur yahan list add karein.
            </p>
            <button
              onClick={handleScanClick}
              className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase rounded-xl shadow-lg inline-flex items-center gap-2 hover:bg-red-700 transition-all"
            >
              <FiCamera /> Scan First Restaurant
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scannedList.map((item) => {
              const resto = item.restaurantId;
              if (!resto) return null;

              return (
                <Link
                  key={item._id}
                  href={`/restaurant/${resto._id}/loyalty`}
                  className="block bg-slate-900 border border-slate-800 hover:border-red-500/50 p-5 rounded-3xl transition-all shadow-lg group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors">
                        {resto.restaurantName || resto.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FiMapPin className="text-red-500" /> {resto.location || "Dining Hub"}
                      </p>
                    </div>

                    <span className="bg-red-600/20 text-red-400 text-xs font-black px-3 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
                      <FiGift /> Stamp #{item.currentStamp || 1}/6
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-bold">
                    <span>View Menu & Scratch Rewards</span>
                    <FiChevronRight className="text-base text-red-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}