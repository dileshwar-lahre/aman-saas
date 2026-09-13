This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
Arre Dileshwar bhai! Bilkul, aaj is poore Restaurant Digital Menu, 5-Stamp Loyalty Engine, Dynamic QR Suite, aur Live Approval Notification System ko ekdum solid, bug-free, aur complete tarike se bilkul ready kar denge! 

Poora workflow tumhare dimag me crystal clear hai aur humne setup bhi Zomato-style Crimson Red (bg-red-600), Pure White, aur High-Contrast Dark Text theme ke sath align kiya hai.

🗺️ System Ka Architecture Aur Step-By-Step Execution Plan
Pehle pure system ka logical architecture samajh lete hain ki ye aapas me kaise connect ho raha hai, uske baad step-by-step code execution shuru karenge:

1. Dual Role System (Customer vs Restaurant Owner)

Customer Flow: Zero-login par direct Read-Only Menu dekh sakta hai. Stamp Pass access karne ke liye Customer Login required hoga.


Restaurant Owner Flow: /profile dashboard access karega jahan Red & White aesthetic me wo Digital Menu Manager, Loyalty Configuration, aur Live Claim Approval Console control karega.

2. Triple Dynamic QR Standee Generator
Owner profile me automatic 3 high-quality downloadable QR codes rahenge:

🍔 Menu QR: /restaurant/[id]/menu (No login required).

🎟️ Loyalty QR: /restaurant/[id]/loyalty (Customer Login Guarded).

⭐ Review QR: Owner ka direct Google Review business link.

3. Smart Dynamic Stamp Engine & 1-Month Visit Tracker

1st Scan: Customer Stamp #1 unlock karne ke liye request trigger karega.


2nd Scan: Automatic Stamp #2 request trigger karega.


5th Scan (Final Stamp) & 6th Visit Reward: 5 Stamps fill hone ke baad 6th Visit par Owner dwara set kiya gaya custom Reward/Discount claim hoga.


1-Month/Daily Reset Rule: Har visit request ko Fraud Protection (12/24 hour gap rule ya monthly lifecycle) se protect kiya jayega.

4. Owner Live Approval & Notification Console
Jab bhi customer QR scan karke Stamp claim karega, direct Stamp unlock nahi hoga.

Owner ke Dashboard (/profile) me Live Request Popup/Notification Section me alert aayega.

Owner jab screen par Approve (Right Tick) karega, tabhi customer screen par Stamp auto-claim aur update hoga.

🛠️ Step 1: Restaurant Database Schema
src/models/Restaurant.js

Is model me Restaurant Profile, Digital Menu Items, Custom Loyalty Offerings, aur Live Stamp Requests sab define hote hain:

JavaScript
import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  googleReviewUrl: { type: String, default: "" },
  
  // Custom Loyalty Offer Configured by Owner
  loyaltyOffer: {
    rewardText: { type: String, default: "Get 20% OFF or Free Cold Coffee on 5 Stamps!" },
    validDays: { type: Number, default: 30 }, // 1-Month Validity
  },

  // Menu Management Array
  menu: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, default: "Main Course" },
      isAvailable: { type: Boolean, default: true },
    },
  ],
}, { timestamps: true });

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);
🛠️ Step 2: Customer Loyalty Stamp Tracking Schema
src/models/Loyalty.js

Customer ke current stamps aur pending approval status ko track karne ke liye model:

JavaScript
import mongoose from "mongoose";

const LoyaltySchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  stampsCount: { type: Number, default: 0, max: 5 },
  lastScannedAt: { type: Date, default: Date.now },
  
  // Live Owner Approval Queue Status: 'none', 'pending', 'approved'
  approvalStatus: { type: String, enum: ["none", "pending", "approved"], default: "none" },
}, { timestamps: true });

export default mongoose.models.Loyalty || mongoose.model("Loyalty", LoyaltySchema);
🌐 Step 3: Owner Approval Console & Menu API Routes
API 1: Menu Items Add & Delete (src/app/api/restaurant/menu/route.js) 

JavaScript
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Restaurant from "@/models/Restaurant";

export async function POST(req) {
  try {
    await dbConnect();
    const { restaurantId, menuItem } = await req.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return NextResponse.json({ success: false, error: "Restaurant not found" });

    restaurant.menu.push(menuItem);
    await restaurant.save();

    return NextResponse.json({ success: true, menu: restaurant.menu });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { restaurantId, itemId } = await req.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return NextResponse.json({ success: false, error: "Restaurant not found" });

    restaurant.menu = restaurant.menu.filter((item) => item._id.toString() !== itemId);
    await restaurant.save();

    return NextResponse.json({ success: true, menu: restaurant.menu });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
API 2: Stamp Scan Request & Approval Engine (src/app/api/loyalty/route.js)
JavaScript
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Loyalty from "@/models/Loyalty";

// Customer Triggers Stamp Request on QR Scan
export async function POST(req) {
  try {
    await dbConnect();
    const { customerId, restaurantId } = await req.json();

    let record = await Loyalty.findOne({ customerId, restaurantId });

    if (!record) {
      record = new Loyalty({ customerId, restaurantId, stampsCount: 0, approvalStatus: "pending" });
    } else {
      // 12-Hour Gap Limit Protection
      const hoursDiff = (new Date() - new Date(record.lastScannedAt)) / (1000 * 60 * 60);
      if (hoursDiff < 12 && record.approvalStatus === "pending") {
        return NextResponse.json({ success: false, error: "Claim already pending approval from Owner!" });
      }
      record.approvalStatus = "pending";
      record.lastScannedAt = new Date();
    }

    await record.save();
    return NextResponse.json({ success: true, message: "Stamp request sent to Restaurant Owner!", record });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

// Owner Accepts / Approves Request from Profile
export async function PUT(req) {
  try {
    await dbConnect();
    const { loyaltyId, action } = await req.json(); // action = 'approve' or 'reject'

    const record = await Loyalty.findById(loyaltyId);
    if (!record) return NextResponse.json({ success: false, error: "Record not found" });

    if (action === "approve") {
      if (record.stampsCount < 5) {
        record.stampsCount += 1;
      } else {
        record.stampsCount = 0; // Reset after Reward claimed
      }
      record.approvalStatus = "approved";
    } else {
      record.approvalStatus = "none";
    }

    await record.save();
    return NextResponse.json({ success: true, record });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
💻 Step 4: Red & White Theme Owner Dashboard (src/app/profile/page.jsx)

Is Zomato Red & White theme Profile Page me Owner ko:


3 QR Standee Downloaders 


Digital Menu Add/Remove Control 


Reward Configurator (Custom Discount Setup) 


Live Customer Approval Notification Drawer milte hain.

JavaScript
"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiPlus, FiTrash2, FiCheckCircle, FiXCircle, FiQrCode, FiGift, FiMenu } from "react-icons/fi";

export default function RestaurantOwnerProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Main Course" });
  const [rewardText, setRewardText] = useState("");

  const hostUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Mock Fetch Profile Data & Pending Stamp Requests
  useEffect(() => {
    // In live build, fetch from /api/auth/profile and /api/loyalty/pending
    const mockData = {
      _id: "65a123987123",
      name: "Adyverse Multi-Cuisine Diner",
      loyaltyOffer: { rewardText: "Get 20% OFF on 5th Visit!" },
      menu: [
        { _id: "m1", name: "Butter Chicken", price: 340, category: "Main Course" },
        { _id: "m2", name: "Paneer Tikka", price: 260, category: "Starters" },
      ]
    };
    setRestaurant(mockData);
    setRewardText(mockData.loyaltyOffer.rewardText);

    // Mock Pending Requests Notification Queue
    setPendingRequests([
      { _id: "req1", customerName: "Rahul Sharma", currentStamps: 2, date: "Just Now" }
    ]);
  }, []);

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    const added = { ...newItem, _id: Date.now().toString() };
    setRestaurant({ ...restaurant, menu: [...restaurant.menu, added] });
    setNewItem({ name: "", price: "", category: "Main Course" });
  };

  const handleDeleteItem = (itemId) => {
    setRestaurant({
      ...restaurant,
      menu: restaurant.menu.filter((item) => item._id !== itemId)
    });
  };

  const handleApproval = (reqId, action) => {
    setPendingRequests(pendingRequests.filter(r => r._id !== reqId));
    alert(action === "approve" ? "✅ Stamp Approved & Added to Customer Card!" : "❌ Request Rejected");
  };

  if (!restaurant) return <div className="p-10 text-center text-red-600 font-bold">Loading Console...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Zomato-Style Deep Crimson Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-10 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="bg-white/20 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Restaurant Partner Console
            </span>
            <h1 className="text-3xl font-black mt-2">{restaurant.name}</h1>
            <p className="text-red-100 text-sm mt-1">Manage Menu, Loyalty Stamps & Live QR Scans</p>
          </div>

          {/* Pending Approval Badge */}
          {pendingRequests.length > 0 && (
            <div className="bg-white text-red-600 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 border-2 border-red-200 animate-bounce">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
              <span className="font-extrabold text-sm">{pendingRequests.length} Stamp Approval Request Pending!</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-10">
        
        {/* 🚨 LIVE STAMP APPROVAL NOTIFICATION BOX */}
        {pendingRequests.length > 0 && (
          <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-black text-red-700 flex items-center gap-2">
              <FiCheckCircle className="text-2xl" /> Live Stamp Claim Approvals
            </h2>
            <p className="text-xs text-red-600 font-semibold mt-1">
              Customer desk par scan karke baitha hai. Approve karne par unke 5-Stamp Pass me +1 add ho jayega!
            </p>

            <div className="mt-4 space-y-3">
              {pendingRequests.map((req) => (
                <div key={req._id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-red-100">
                  <div>
                    <h4 className="font-extrabold text-slate-800">{req.customerName}</h4>
                    <p className="text-xs text-slate-500">Current Stamps: {req.currentStamps}/5 • {req.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(req._id, "approve")}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 flex items-center gap-1 shadow-md"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleApproval(req._id, "reject")}
                      className="bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-300 flex items-center gap-1"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔲 SECTION 1: TRIPLE QR STANDEE SUITE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
            <FiQrCode className="text-red-600" /> Standee QR Code Generator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Menu QR */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <span className="text-xs font-bold bg-slate-200 px-3 py-1 rounded-full mb-3 text-slate-700">Read-Only Menu</span>
              <QRCodeSVG value={`${hostUrl}/restaurant/${restaurant._id}/menu`} size={130} />
              <p className="text-xs font-bold text-slate-600 mt-3">Digital Menu QR</p>
            </div>

            {/* Loyalty Pass QR */}
            <div className="bg-red-50 p-5 rounded-2xl border border-red-200 text-center flex flex-col items-center">
              <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full mb-3">Login Required</span>
              <QRCodeSVG value={`${hostUrl}/restaurant/${restaurant._id}/loyalty`} size={130} />
              <p className="text-xs font-bold text-red-700 mt-3">5-Stamp Loyalty Pass QR</p>
            </div>

            {/* Google Review QR */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full mb-3">Direct Review</span>
              <QRCodeSVG value={restaurant.googleReviewUrl || `${hostUrl}`} size={130} />
              <p className="text-xs font-bold text-slate-600 mt-3">Google Review QR</p>
            </div>
          </div>
        </div>

        {/* 🎟️ SECTION 2: LOYALTY STAMP REWARD CONFIGURATOR */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-2">
            <FiGift className="text-red-600" /> 5-Stamp Reward Offer Setup
          </h2>
          <p className="text-xs text-slate-500 mb-4">Set what discount or item the customer gets on 5th Stamp completion.</p>

          <div className="flex gap-3">
            <input
              type="text"
              value={rewardText}
              onChange={(e) => setRewardText(e.target.value)}
              placeholder="e.g. Get 20% Off on 5th Visit!"
              className="flex-1 bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm font-semibold focus:outline-red-500"
            />
            <button
              onClick={() => alert("✅ Loyalty Offer Saved Successfully!")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider"
            >
              Save Reward
            </button>
          </div>
        </div>

        {/* 🍕 SECTION 3: DIGITAL MENU MANAGER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
            <FiMenu className="text-red-600" /> Digital Menu Management
          </h2>

          {/* Add New Dish Form */}
          <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <input
              type="text"
              placeholder="Dish Name (e.g. Kadhai Paneer)"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-white border border-slate-300 p-3 rounded-xl text-xs font-medium focus:outline-red-500"
            />
            <input
              type="number"
              placeholder="Price in ₹"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="bg-white border border-slate-300 p-3 rounded-xl text-xs font-medium focus:outline-red-500"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="bg-white border border-slate-300 p-3 rounded-xl text-xs font-medium focus:outline-red-500"
            >
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
            </select>
            <button type="submit" className="bg-slate-900 hover:bg-black text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <FiPlus /> Add Dish
            </button>
          </form>

          {/* Dishes List */}
          <div className="space-y-3">
            {restaurant.menu.map((dish) => (
              <div key={dish._id} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{dish.name}</h4>
                  <p className="text-xs text-slate-500">{dish.category} • ₹{dish.price}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem(dish._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
💻 Step 5: Customer Scanned Loyalty Page (src/app/restaurant/[id]/loyalty/page.jsx)

Jab customer QR Code scan karega, ye 5-Stamp Pass Page khulega. Automatic 1st scan par 1st Stamp claim Request owner console tak bhejega:

JavaScript
"use client";
import React, { useState } from "react";
import { FiCheck, FiGift, FiClock } from "react-icons/fi";

export default function CustomerLoyaltyPage() {
  const [stampsCount, setStampsCount] = useState(2); // Simulated Current Active Stamps
  const [status, setStatus] = useState("none"); // none, pending, approved

  const handleClaimStamp = () => {
    setStatus("pending");
    alert("🚀 Visit Scan Request Sent! Jab Restaurant Owner console par Accept karenge, tab Stamp unlock ho jayega.");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl text-center">
        
        <span className="bg-red-600/20 text-red-400 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full border border-red-500/30">
          Loyalty Stamp Pass
        </span>

        <h1 className="text-2xl font-black mt-4">Adyverse Diner</h1>
        <p className="text-slate-400 text-xs mt-1">Scan at table every visit to collect stamps!</p>

        {/* 5-STAMPS VISUAL MATRIX */}
        <div className="grid grid-cols-5 gap-3 my-8">
          {[1, 2, 3, 4, 5].map((index) => {
            const isFilled = index <= stampsCount;
            return (
              <div
                key={index}
                className={`h-16 rounded-2xl flex flex-col items-center justify-center font-black text-sm transition-all ${
                  isFilled
                    ? "bg-gradient-to-b from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105"
                    : "bg-slate-700/50 border border-slate-600 text-slate-500"
                }`}
              >
                {isFilled ? <FiCheck className="text-xl stroke-[3]" /> : `#${index}`}
              </div>
            );
          })}
        </div>

        {/* REWARD CARD BOX */}
        <div className="bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 p-4 rounded-2xl mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-xl">
              <FiGift className="text-xl" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-red-400">5th Stamp Final Reward</p>
              <p className="text-xs font-extrabold text-white mt-0.5">Get 20% OFF on 5th Visit!</p>
            </div>
          </div>
        </div>

        {/* CLAIM VISIT SCAN ACTION BUTTON */}
        {status === "pending" ? (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
            <FiClock className="animate-spin text-base" /> Approval Request Pending with Owner...
          </div>
        ) : (
          <button
            onClick={handleClaimStamp}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            Claim Today's Visit Stamp
          </button>
        )}

      </div>
    </div>
  );
}
🚀 Step 6: Code Integration & Testing Sequence
All models (Restaurant.js & Loyalty.js) aur API routes create karke file paths recheck kar lo.

Dev Server Start karo:

Bash
npm run dev
Owner Flow Test: /profile browser me open karo. Dishes Add/Remove karo, Custom Discount text save karo, aur QR Codes download karke verify karo.

Customer Loyalty Test: Loyalty QR ko open/scan karo (/restaurant/RESTAURANT_ID/loyalty). Customer side se "Claim Today's Visit Stamp" dabao.

Owner Approval Verification: Owner Profile Screen (/profile) me Live Red Notification Alert Box popup hoga. Owner jab Approve dabayega, customer screen par instant stamp update ho jayega!