"use client";
import React, { useState, useEffect, use } from "react";
import { FiCheck, FiGift, FiClock, FiMapPin, FiGlobe, FiInstagram, FiFacebook, FiBookOpen, FiArrowLeft } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";

export default function UserRestaurantDetailPage({ params }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;

  const [customerId, setCustomerId] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [record, setRecord] = useState(null);
  const [isScratched, setIsScratched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [activeTab, setActiveTab] = useState("loyalty"); // loyalty, menu

  useEffect(() => {
    let cid = localStorage.getItem("ady_customer_id");
    if (!cid) {
      cid = "cust_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("ady_customer_id", cid);
    }
    setCustomerId(cid);

    if (restaurantId) {
      loadData(cid);
    }
  }, [restaurantId]);

  const loadData = async (cid) => {
    try {
      // 1. Fetch Menu & Restaurant Info
      const resMenu = await fetch(`/api/restaurant/menu?restaurantId=${restaurantId}`);
      const dataMenu = await resMenu.json();
      if (dataMenu.success) {
        setRestaurant(dataMenu);
      }

      // 2. Fetch Customer Loyalty Record
      const resLoyalty = await fetch(`/api/loyalty/request?customerId=${cid}&restaurantId=${restaurantId}`);
      const dataLoyalty = await resLoyalty.json();
      if (dataLoyalty.success && dataLoyalty.record) {
        setRecord(dataLoyalty.record);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    setRequesting(true);
    try {
      const res = await fetch("/api/loyalty/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          customerName: "Table Guest",
          restaurantId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecord(data.record);
        alert("🚀 Claim Request sent to Owner! Approval hone par stamp update ho jayega.");
      } else {
        alert(data.error || "Request failed");
      }
    } catch (err) {
      alert("Error sending request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">
        Loading Restaurant Details...
      </div>
    );
  }

  const currentStamp = record?.currentStamp || 1;
  const status = record?.approvalStatus || "none";

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 shadow-xl rounded-b-3xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-xs font-black uppercase bg-white/20 px-3 py-1.5 rounded-xl hover:bg-white/30 text-white"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl font-black">{restaurant?.restaurantName || "Restaurant Hub"}</h1>
            <p className="text-xs text-red-100 flex items-center gap-1 mt-1">
              <FiMapPin /> {restaurant?.location || "Dining Spot"}
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/20">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-all">
              <FiInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-all">
              <FiFacebook />
            </a>
            <a href={restaurant?.googleReviewUrl || "https://google.com"} target="_blank" rel="noreferrer" className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-all">
              <FiGlobe />
            </a>
          </div>

          {/* Action Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 mt-4">
            <button
              onClick={() => setActiveTab("loyalty")}
              className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "loyalty" ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <FiGift /> Loyalty Card
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "menu" ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <FiBookOpen /> Digital Menu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">

        {/* TAB 1: LOYALTY SCRATCH CARD */}
        {activeTab === "loyalty" && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center space-y-6 shadow-xl">
            <span className="bg-red-600/20 text-red-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-red-500/30">
              Active Stamp #{currentStamp} Of 6
            </span>

            {/* 6 Stamps Progress Grid */}
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const isDone = num < currentStamp;
                const isCurrent = num === currentStamp;
                return (
                  <div
                    key={num}
                    className={`h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-red-600 text-white ring-2 ring-red-400 shadow-lg shadow-red-600/40"
                        : "bg-slate-800 text-slate-600 border border-slate-700"
                    }`}
                  >
                    {isDone ? <FiCheck className="text-base stroke-[3]" /> : num === 6 ? <FiGift /> : `#${num}`}
                  </div>
                );
              })}
            </div>

            {/* Interactive Scratch Box */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center relative overflow-hidden">
              {!isScratched ? (
                <button
                  onClick={() => setIsScratched(true)}
                  className="w-full py-8 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <HiSparkles className="text-lg" /> Touch / Scratch To Reveal Offer
                </button>
              ) : (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                    {currentStamp === 6 ? "🎉 6th Mega Reward Offer" : `Stamp #${currentStamp} Offer`}
                  </span>
                  <p className="text-base font-black text-white">
                    {record?.currentOfferText || "Special Discount On Today's Visit!"}
                  </p>
                </div>
              )}
            </div>

            {/* Claim Action Button / Pending Alert */}
            {status === "pending" ? (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
                <FiClock className="animate-spin text-base" /> Approval Request Pending with Restaurant Owner...
              </div>
            ) : status === "approved" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                <FiCheck className="text-lg stroke-[3]" /> Stamp Approved! Next Stamp Unlocked.
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={!isScratched || requesting}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  isScratched
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {requesting ? "Sending..." : "Claim Offer Now"}
              </button>
            )}
          </div>
        )}

        {/* TAB 2: DIGITAL MENU */}
        {activeTab === "menu" && (
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Digital Menu Items</h2>
            {(!restaurant?.menu || restaurant.menu.length === 0) ? (
              <div className="bg-slate-900 p-8 rounded-2xl text-center text-slate-500 text-xs font-bold border border-slate-800">
                Menu Empty hai!
              </div>
            ) : (
              restaurant.menu.map((item) => (
                <div key={item._id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-black uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1">{item.name}</h3>
                  </div>
                  <span className="text-base font-black text-white">₹{item.price}</span>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}