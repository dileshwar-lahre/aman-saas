"use client";
import React, { useState, useEffect, use } from "react";
import { FiCheck, FiGift, FiClock, FiMapPin, FiGlobe, FiInstagram, FiFacebook, FiBookOpen, FiArrowLeft, FiLock, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserInstagramStyleRestaurantPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;

  const [customerId, setCustomerId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [record, setRecord] = useState(null);
  const [isScratched, setIsScratched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [activeTab, setActiveTab] = useState("loyalty");

  useEffect(() => {
    checkUserAuthAndLoad();
  }, [restaurantId]);

  const checkUserAuthAndLoad = async () => {
    try {
      let cid = "";
      const resAuth = await fetch("/api/auth/me");
      if (resAuth.ok) {
        const authData = await resAuth.json();
        if (authData.success && authData.user) {
          setIsLoggedIn(true);
          cid = authData.user.id || authData.user._id;
          setCustomerId(cid);
        }
      }

      if (!cid) {
        let guestId = localStorage.getItem("ady_customer_id");
        if (!guestId) {
          guestId = "cust_" + Math.random().toString(36).substring(2, 9);
          localStorage.setItem("ady_customer_id", guestId);
        }
        cid = guestId;
        setCustomerId(cid);
      }

      const resMenu = await fetch(`/api/restaurant/menu?restaurantId=${restaurantId}`);
      const dataMenu = await resMenu.json();
      if (dataMenu.success) {
        setRestaurant(dataMenu.restaurant || dataMenu);
        setMenuItems(dataMenu.menu || []);
      }

      const resLoyalty = await fetch(`/api/loyalty/request?customerId=${cid}&restaurantId=${restaurantId}`);
      const dataLoyalty = await resLoyalty.json();
      if (dataLoyalty.success && dataLoyalty.record) {
        setRecord(dataLoyalty.record);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isLoggedIn) {
      alert("🔒 Stamp Claim karne ke liye pehle Customer Login karna zaroori hai!");
      router.push("/login");
      return;
    }

    setRequesting(true);
    try {
      const res = await fetch("/api/loyalty/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          restaurantId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecord(data.record);
        alert("🚀 Claim Request sent to Restaurant Owner! Approval ka wait karein.");
      } else {
        alert(data.error || "Request failed");
      }
    } catch (err) {
      alert("Error sending claim request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">
        Loading Restaurant Hub...
      </div>
    );
  }

  const currentStamp = record?.currentStamp || 1;
  const status = record?.approvalStatus || "none";
  const totalClaimsCount = status === "approved" ? currentStamp - 1 : currentStamp > 1 ? currentStamp - 1 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* 📸 INSTAGRAM PROFILE HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 p-6 rounded-b-3xl shadow-xl">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <Link
              href="/dashboard/profile"
              className="text-xs font-black uppercase bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl hover:bg-slate-700 flex items-center gap-1"
            >
              <FiArrowLeft /> Back
            </Link>

            <span className="text-[10px] font-black uppercase tracking-widest bg-red-600/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30">
              Verified Partner
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-20 h-20 bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-2xl font-black text-white uppercase border-2 border-slate-900">
                {(restaurant?.restaurantName || restaurant?.name || "A")[0]}
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-white">{restaurant?.restaurantName || restaurant?.name || "Restaurant Spot"}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <FiMapPin className="text-red-500" /> {restaurant?.location || "Delicious Hub"}
              </p>
              
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  <FiAward /> Total Stamps Claimed: {totalClaimsCount} / 5
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                {restaurant?.socialLinks?.instagram && (
                  <a href={restaurant.socialLinks.instagram} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-xl text-pink-400 hover:bg-slate-700">
                    <FiInstagram />
                  </a>
                )}
                {restaurant?.socialLinks?.facebook && (
                  <a href={restaurant.socialLinks.facebook} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-xl text-blue-400 hover:bg-slate-700">
                    <FiFacebook />
                  </a>
                )}
                <a href={restaurant?.socialLinks?.googleReviewUrl || restaurant?.googleReviewUrl || "https://google.com"} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-xl text-amber-400 hover:bg-slate-700">
                  <FiGlobe />
                </a>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 mt-4">
            <button
              onClick={() => setActiveTab("loyalty")}
              className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "loyalty" ? "bg-red-600 text-white shadow-md shadow-red-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <FiGift /> 5-Stamp Pass
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "menu" ? "bg-red-600 text-white shadow-md shadow-red-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <FiBookOpen /> Digital Menu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">

        {/* TAB 1: LOYALTY CARD & SEQUENTIAL STAMP UNLOCK */}
        {activeTab === "loyalty" && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">
                Sequential Stamp Unlock
              </span>
              <h2 className="text-xl font-black text-white">
                {currentStamp === 6 && status === "approved" ? "🎉 6th Reward Unlocked!" : `Stamp #${currentStamp} Of 6 Active`}
              </h2>
              <p className="text-slate-400 text-xs">Owner approval ke baad hi agla stamp tick hoga.</p>
            </div>

            {/* 🌟 STRICT SEQUENTIAL STAMPS GRID FIX */}
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                // Sirf tabhi green tick hoga jab status approved ho aur num < currentStamp ho
                const isDone = status === "approved" && num < currentStamp;
                // Current active stamp tabhi red highlight hoga jab status approved na ho (jaise pending ya none)
                const isCurrent = num === currentStamp && status !== "approved";
                // Agar status approved hai aur currentStamp aage badh gaya hai, toh current num green ho jayega

                const successfullyApprovedBefore = status === "approved" && num <= currentStamp - 1;

                return (
                  <div
                    key={num}
                    className={`h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                      successfullyApprovedBefore
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : isCurrent
                        ? "bg-red-600 text-white ring-2 ring-red-400 shadow-lg shadow-red-600/40"
                        : "bg-slate-800 text-slate-600 border border-slate-700"
                    }`}
                  >
                    {successfullyApprovedBefore ? (
                      <FiCheck className="text-base stroke-[3]" />
                    ) : num === 6 ? (
                      <FiGift />
                    ) : (
                      `#${num}`
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scratch Box */}
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

            {/* Auth Alert Box */}
            {!isLoggedIn && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                <FiLock /> Claim karne ke liye Customer Login required hai.
              </div>
            )}

            {/* Action State */}
            {status === "pending" ? (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
                <FiClock className="animate-spin text-base" /> Request Pending with Restaurant Owner...
              </div>
            ) : status === "approved" && currentStamp >= 6 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold text-center space-y-1">
                <p className="font-black text-sm">🎉 Congratulations!</p>
                <p>You have completed all stamps and unlocked your 6th reward!</p>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={!isScratched || requesting || status === "pending"}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  isScratched
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 active:scale-95"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {requesting ? "Sending..." : "Claim Today's Stamp Offer"}
              </button>
            )}
          </div>
        )}

        {/* TAB 2: DIGITAL MENU */}
        {activeTab === "menu" && (
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Digital Menu Items</h2>
            {(!menuItems || menuItems.length === 0) ? (
              <div className="bg-slate-900 p-8 rounded-2xl text-center text-slate-500 text-xs font-bold border border-slate-800">
                Menu list is currently empty.
              </div>
            ) : (
              menuItems.map((item) => (
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