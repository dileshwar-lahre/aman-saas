"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiCheckCircle, FiXCircle, FiGift, FiMenu, FiUserCheck } from "react-icons/fi";
import { HiQrcode } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RestaurantOwnerDashboard() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const hostUrl = typeof window !== "undefined" ? window.location.origin : "";

  const verifyPartnerAccess = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();

      // 🔒 STRICT SECURITY GUARD: Customer role Ko Block Karo
      if (data.success && data.restaurant) {
        if (data.restaurant.role === "customer" || data.role === "customer") {
          router.push("/dashboard/profile");
          return;
        }
        setRestaurant(data.restaurant);
        fetchPendingRequests(data.restaurant._id);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async (rid) => {
    try {
      const res = await fetch(`/api/loyalty/approve?restaurantId=${rid}`);
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.pendingRequests || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    verifyPartnerAccess();
    const interval = setInterval(() => {
      if (restaurant?._id) fetchPendingRequests(restaurant._id);
    }, 5000); // 5-second Live Poll
    return () => clearInterval(interval);
  }, [restaurant?._id]);

  const handleApproval = async (loyaltyId, action) => {
    try {
      const res = await fetch("/api/loyalty/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loyaltyId, action }),
      });

      const data = await res.json();
      if (data.success) {
        setPendingRequests(pendingRequests.filter((r) => r._id !== loyaltyId));
        alert(action === "approve" ? "✅ Stamp Claim Approved!" : "❌ Request Rejected!");
      }
    } catch (err) {
      alert("Error handling approval action");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-600">Authenticating Partner Access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Red Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-10 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Restaurant Partner Console
            </span>
            <h1 className="text-3xl font-black mt-2">{restaurant?.restaurantName || restaurant?.name}</h1>
            <p className="text-red-100 text-sm mt-1">{restaurant?.location} • Live Approval Console</p>
          </div>

          <div className="flex gap-2">
            <Link href="/profile/menu" className="bg-white text-red-600 px-4 py-3 rounded-2xl shadow-lg font-black text-xs uppercase flex items-center gap-2 hover:bg-slate-100">
              <FiMenu /> Manage Menu
            </Link>
            <Link href="/profile/loyalty-config" className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg font-black text-xs uppercase flex items-center gap-2 hover:bg-black">
              <FiGift className="text-red-400" /> Edit Loyalty Offers
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">

        {/* LIVE APPROVAL NOTIFICATIONS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FiUserCheck className="text-red-600 text-xl" /> Live Customer Stamp Claims ({pendingRequests.length})
            </h2>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          </div>

          {pendingRequests.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold text-center py-6">Abhi koi pending claim request nahi hai.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{req.customerName}</h4>
                    <p className="text-xs text-red-600 font-bold mt-0.5">Claiming Stamp #{req.currentStamp}: {req.currentOfferText}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(req._id, "approve")}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 hover:bg-emerald-600 shadow-md"
                    >
                      <FiCheckCircle /> Approve (Right)
                    </button>
                    <button
                      onClick={() => handleApproval(req._id, "reject")}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-200 flex items-center gap-1"
                    >
                      <FiXCircle /> Reject (Cut)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR CODES */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <HiQrcode className="text-red-600 text-xl" /> Standee QR Codes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase bg-slate-200 px-3 py-1 rounded-full mb-3">1. Menu QR</span>
              <QRCodeSVG value={`${hostUrl}/restaurant/${restaurant?._id}/menu`} size={120} />
              <p className="text-xs font-bold text-slate-700 mt-3">Digital Menu QR</p>
            </div>

            <div className="bg-red-50 p-5 rounded-2xl border border-red-200 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase bg-red-600 text-white px-3 py-1 rounded-full mb-3">2. Loyalty Pass QR</span>
              <QRCodeSVG value={`${hostUrl}/restaurant/${restaurant?._id}/loyalty`} size={120} />
              <p className="text-xs font-bold text-red-700 mt-3">5-Stamp Reward Card</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full mb-3">3. Review QR</span>
              <QRCodeSVG value={restaurant?.googleReviewUrl || `${hostUrl}`} size={120} />
              <p className="text-xs font-bold text-slate-700 mt-3">Google Review QR</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}