"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiCamera, FiMapPin, FiChevronRight, FiGift, FiBookOpen, FiX, FiInstagram, FiFacebook, FiGlobe, FiAward } from "react-icons/fi";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [scannedList, setScannedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    let cid = localStorage.getItem("ady_customer_id");
    if (!cid) {
      cid = "cust_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("ady_customer_id", cid);
    }
    setCustomerId(cid);
    fetchScannedRestaurants(cid);

    return () => {
      stopScanner();
    };
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

  // 🔴 Live Camera QR Scanner Start karo
  const startScanner = async () => {
    setScannerOpen(true);
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("reader-container");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            scanner.stop().then(() => {
              setScannerOpen(false);
              if (decodedText.startsWith("http")) {
                router.push(decodedText.replace(window.location.origin, ""));
              } else {
                router.push(`/restaurant/${decodedText}/loyalty`);
              }
            }).catch((err) => console.error(err));
          },
          (errorMessage) => {
            // Scanning in progress errors ignore karo
          }
        );
      } catch (err) {
        console.error("Camera start error:", err);
        alert("Camera start nahi ho paya. Kripya browser ki camera permission check karein!");
        setScannerOpen(false);
      }
    }, 200);
  };

  // ❌ Scanner Stop karo
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
      }).catch((err) => {
        // already stopped
      });
    }
    setScannerOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">
        User Dashboard Load Ho Raha Hai...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16 font-sans relative">
      
      {/* 🔴 LIVE QR SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-6 border border-slate-800 shadow-2xl space-y-4 text-center relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Live QR Scanner
              </h3>
              <button
                onClick={stopScanner}
                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
              >
                <FiX className="text-base" />
              </button>
            </div>

            <div id="reader-container" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"></div>

            <p className="text-[11px] text-slate-400 font-medium">
              Restaurant ka QR code camera ke saamne rakhein, turant scan ho jayega.
            </p>
          </div>
        </div>
      )}

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
            onClick={startScanner}
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
              onClick={startScanner}
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

              const currentStamps = item.currentStamp || 1;
              const claimedCount = item.approvalStatus === "approved" ? currentStamps - 1 : currentStamps > 1 ? currentStamps - 1 : 0;

              return (
                <div
                  key={item._id}
                  className="bg-slate-900 border border-slate-800 hover:border-red-500/50 p-5 rounded-3xl transition-all shadow-lg space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/restaurant/${resto._id}`} className="group">
                        <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors">
                          {resto.restaurantName || resto.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FiMapPin className="text-red-500" /> {resto.location || "Dining Hub"}
                      </p>

                      {/* Real Claimed Stamps Badge */}
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                          <FiAward /> Stamps Claimed: {claimedCount} / 5
                        </span>
                      </div>
                    </div>

                    <span className="bg-red-600/20 text-red-400 text-xs font-black px-3 py-1 rounded-full border border-red-500/30 flex items-center gap-1">
                      <FiGift /> Stamp #{currentStamps}/6
                    </span>
                  </div>

                  {/* 🌟 Restaurant Social Links & Passbook Link Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="flex gap-2">
                      {resto.socialLinks?.instagram && (
                        <a href={resto.socialLinks.instagram} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-xl text-pink-400 hover:bg-slate-700 text-xs">
                          <FiInstagram />
                        </a>
                      )}
                      {resto.socialLinks?.facebook && (
                        <a href={resto.socialLinks.facebook} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-xl text-blue-400 hover:bg-slate-700 text-xs">
                          <FiFacebook />
                        </a>
                      )}
                      {(resto.socialLinks?.googleReviewUrl || resto.googleReviewUrl) && (
                        <a href={resto.socialLinks?.googleReviewUrl || resto.googleReviewUrl} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-xl text-amber-400 hover:bg-slate-700 text-xs">
                          <FiGlobe />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/restaurant/${resto._id}`}
                      className="inline-flex items-center gap-1 text-xs text-red-400 font-bold hover:underline"
                    >
                      <span>Open Passbook</span>
                      <FiChevronRight className="text-base text-red-500" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}