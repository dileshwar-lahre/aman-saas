"use client";
import React, { useState, useEffect } from "react";
import { FiGift, FiCheck, FiRefreshCw, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

export default function LoyaltyConfigPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [offers, setOffers] = useState({
    stamp1: "",
    stamp2: "",
    stamp3: "",
    stamp4: "",
    stamp5: "",
    reward6th: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (data.success && data.restaurant) {
        setRestaurant(data.restaurant);
        if (data.restaurant.loyaltyOffers) {
          setOffers({
            stamp1: data.restaurant.loyaltyOffers.stamp1 || "",
            stamp2: data.restaurant.loyaltyOffers.stamp2 || "",
            stamp3: data.restaurant.loyaltyOffers.stamp3 || "",
            stamp4: data.restaurant.loyaltyOffers.stamp4 || "",
            stamp5: data.restaurant.loyaltyOffers.stamp5 || "",
            reward6th: data.restaurant.loyaltyOffers.reward6th || "",
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save / Update All Offers
  const handleSaveOffers = async (e) => {
    e.preventDefault();
    if (!restaurant?._id) return;

    setSaving(true);
    try {
      const res = await fetch("/api/restaurant/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant._id,
          loyaltyOffers: offers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Loyalty Card Offers Successfully Update Ho Gaye!");
      } else {
        alert(data.error || "Update me dikkat aayi!");
      }
    } catch (err) {
      alert("Server Error while updating offers");
    } finally {
      setSaving(false);
    }
  };

  const handleClearOffer = (key) => {
    if (confirm(`Kya aap ${key} ka offer remove/clear karna chahte hain?`)) {
      setOffers({ ...offers, [key]: "" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-600">
        Loading Loyalty Configurator...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 shadow-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/profile" className="flex items-center gap-2 text-xs font-black uppercase bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all">
            <FiArrowLeft /> Dashboard
          </Link>
          <h1 className="text-lg font-black">Update Loyalty Card Offers</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-8">
        <form onSubmit={handleSaveOffers} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FiGift className="text-red-600 text-xl" /> Edit Offers For Stamps 1 to 5 & 6th Reward
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Yahan jo bhi text likh kar save karoge, customer QR scan karke wahi scratch reward payega.
            </p>
          </div>

          {/* Stamp 1 to 5 Inputs */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((num) => {
              const key = `stamp${num}`;
              return (
                <div key={num} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-red-600 uppercase tracking-wider">
                      Stamp #{num} Offer
                    </label>
                    {offers[key] && (
                      <button
                        type="button"
                        onClick={() => handleClearOffer(key)}
                        className="text-slate-400 hover:text-red-500 text-xs font-bold flex items-center gap-1"
                      >
                        <FiTrash2 /> Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={`e.g. ${num === 1 ? "5% OFF on Main Course" : "Free Drink"}`}
                    value={offers[key]}
                    onChange={(e) => setOffers({ ...offers, [key]: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
                  />
                </div>
              );
            })}

            {/* 6th Reward Input */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-2xl border-2 border-red-200 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-red-700 uppercase tracking-wider flex items-center gap-1">
                  <FiGift /> 6th Stamp Final Reward
                </label>
                {offers.reward6th && (
                  <button
                    type="button"
                    onClick={() => handleClearOffer("reward6th")}
                    className="text-slate-400 hover:text-red-500 text-xs font-bold flex items-center gap-1"
                  >
                    <FiTrash2 /> Clear
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. 🎉 FREE Meal / 50% OFF Reward!"
                value={offers.reward6th}
                onChange={(e) => setOffers({ ...offers, reward6th: e.target.value })}
                className="w-full bg-white border border-red-300 p-3.5 rounded-xl text-xs font-black focus:outline-red-500 text-red-700"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-600/20 flex items-center justify-center gap-2"
            >
              {saving ? <FiRefreshCw className="animate-spin text-base" /> : <FiCheck className="text-base stroke-[3]" />}
              {saving ? "Updating..." : "Save Updated Offers"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}