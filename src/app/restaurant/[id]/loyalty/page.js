"use client";
import React, { useState, useEffect, use } from "react";
import { FiCheck, FiGift, FiClock, FiAlertCircle, FiSparkles } from "react-icons/fi";

export default function CustomerLoyaltyPage({ params }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;

  const [customerId, setCustomerId] = useState("");
  const [record, setRecord] = useState(null);
  const [isScratched, setIsScratched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    // Generate or fetch client persistent ID
    let existingId = localStorage.getItem("ady_customer_id");
    if (!existingId) {
      existingId = "cust_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("ady_customer_id", existingId);
    }
    setCustomerId(existingId);

    fetchStatus(existingId);
  }, [restaurantId]);

  const fetchStatus = async (cid) => {
    try {
      const res = await fetch(`/api/loyalty/request?customerId=${cid}&restaurantId=${restaurantId}`);
      const data = await res.json();
      if (data.success && data.record) {
        setRecord(data.record);
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
        alert("🚀 Request sent to Owner Console! Please wait for approval.");
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
        Loading Loyalty Pass...
      </div>
    );
  }

  const currentStamp = record?.currentStamp || 1;
  const status = record?.approvalStatus || "none";

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl text-center space-y-6">
        
        <span className="bg-red-600/20 text-red-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-red-500/30">
          Digital Loyalty Card
        </span>

        <div>
          <h1 className="text-2xl font-black text-white">Stamp #{currentStamp} Of 6</h1>
          <p className="text-slate-400 text-xs mt-1">1 Month Validity Cycle • Table Scan Required</p>
        </div>

        {/* 6 STAMPS PROGRESS GRID */}
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

        {/* INTERACTIVE SCRATCH CARD BOX */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 text-center relative overflow-hidden">
          {!isScratched ? (
            <button
              onClick={() => setIsScratched(true)}
              className="w-full py-8 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <FiSparkles className="text-lg" /> Scratch To Reveal Offer
            </button>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                {currentStamp === 6 ? "🎉 Final Reward Offer" : `Stamp #${currentStamp} Offer`}
              </span>
              <p className="text-base font-black text-white">
                {record?.currentOfferText || "Special Visit Discount"}
              </p>
            </div>
          )}
        </div>

        {/* CLAIM BUTTON / STATUS STATES */}
        {status === "pending" ? (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
            <FiClock className="animate-spin text-base" /> Owner Approval Pending...
          </div>
        ) : status === "approved" ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
            <FiCheck className="text-lg stroke-[3]" /> Stamp Approved! Next Stamp Unlocked.
          </div>
        ) : status === "rejected" ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
            <FiAlertCircle className="text-lg" /> Request Rejected By Restaurant.
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
    </div>
  );
}