"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiCheckCircle, FiXCircle, FiGift, FiMenu, FiUserCheck, FiInstagram, FiFacebook, FiEdit3, FiUsers, FiDownload, FiX } from "react-icons/fi";
import { HiQrcode } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RestaurantOwnerDashboard() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const hostUrl = typeof window !== "undefined" ? window.location.origin : "";

  const verifyPartnerAccess = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();

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
    }, 5000);
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

  const downloadQRCode = (svgId, fileName) => {
    const svgElement = document.getElementById(svgId);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width || 300;
      canvas.height = img.height || 300;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${fileName}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <p className="text-xs font-black tracking-widest text-red-600 uppercase animate-pulse">
          AUTHENTICATING PARTNER ACCESS...
        </p>
      </div>
    );
  }

  const reviewPortalUrl = restaurant?._id ? `${hostUrl}/restaurant/${restaurant._id}/review` : hostUrl;
  const hasSocialLinks = restaurant?.socialLinks?.instagram || restaurant?.socialLinks?.facebook;

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-slate-900 pb-20 font-sans antialiased relative">
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-12 px-6 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div>
            <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full backdrop-blur-md">
              Restaurant Partner Console
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-3 tracking-wide">{restaurant?.restaurantName || restaurant?.name}</h1>
            <p className="text-red-100 text-xs font-medium mt-1">{restaurant?.location} • Live Approval & Loyalty Node</p>
          </div>

          <div>
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-white text-red-600 px-6 py-3.5 rounded-2xl shadow-lg font-black text-xs uppercase flex items-center gap-2.5 hover:bg-slate-50 transition-all active:scale-95"
            >
              <FiMenu className="text-base" /> Quick Actions Menu
            </button>
          </div>
        </div>
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-red-100 relative space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Restaurant Management
              </h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <FiX className="text-base" />
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/profile/menu"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3.5 p-4 bg-neutral-50 hover:bg-red-50 rounded-2xl text-xs font-black text-neutral-800 hover:text-red-600 transition-all"
              >
                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-600">
                  <FiMenu />
                </div>
                Manage Menu Items
              </Link>

              <Link
                href="/profile/loyalty-config"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3.5 p-4 bg-neutral-50 hover:bg-red-50 rounded-2xl text-xs font-black text-neutral-800 hover:text-red-600 transition-all"
              >
                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-600">
                  <FiGift />
                </div>
                Edit Loyalty Offers
              </Link>

              <Link
                href="/profile/customer-visits"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3.5 p-4 bg-emerald-50/60 hover:bg-emerald-100 rounded-2xl text-xs font-black text-emerald-800 transition-all"
              >
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-xl shadow-sm flex items-center justify-center">
                  <FiUsers />
                </div>
                Customer Logs & Numbers
              </Link>

              <Link
                href="/update-social"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3.5 p-4 bg-amber-50/60 hover:bg-amber-100 rounded-2xl text-xs font-black text-amber-900 transition-all"
              >
                <div className="w-8 h-8 bg-amber-500 text-white rounded-xl shadow-sm flex items-center justify-center">
                  <FiEdit3 />
                </div>
                Update Social & Links
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="w-full py-3.5 bg-neutral-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md mt-2"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        {hasSocialLinks && (
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50">
            <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">
              Active Social Channels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant?.socialLinks?.instagram && (
                <a href={restaurant.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-4 bg-pink-50/60 border border-pink-100 rounded-2xl text-pink-600 font-bold text-xs hover:bg-pink-100/80 transition-all group">
                  <div className="w-9 h-9 bg-pink-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                    <FiInstagram className="text-base" />
                  </div>
                  <div>
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Instagram</p>
                    <span className="text-xs text-neutral-800 font-black">Visit Profile / Follow</span>
                  </div>
                </a>
              )}

              {restaurant?.socialLinks?.facebook && (
                <a href={restaurant.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-blue-600 font-bold text-xs hover:bg-blue-100/80 transition-all group">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                    <FiFacebook className="text-base" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Facebook</p>
                    <span className="text-xs text-neutral-800 font-black">Visit Page / Follow</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2.5">
              <FiUserCheck className="text-red-600 text-lg" /> Live Customer Stamp Claims ({pendingRequests.length})
            </h2>
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-10 text-center bg-[#F9FAFB] rounded-2xl border border-neutral-100">
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Abhi koi pending claim request nahi hai.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req._id} className="bg-[#F9FAFB] p-4.5 rounded-2xl border border-neutral-200/60 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-neutral-900 text-sm">{req.customerName}</h4>
                    <p className="text-xs text-red-600 font-bold mt-0.5">Claiming Stamp #{req.currentStamp}: {req.currentOfferText}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(req._id, "approve")}
                      className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 hover:bg-emerald-600 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleApproval(req._id, "reject")}
                      className="bg-rose-50 text-rose-600 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 active:scale-95 transition-all border border-rose-200"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50">
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-6 flex items-center gap-2.5">
            <HiQrcode className="text-red-600 text-xl" /> Standee QR Codes & Downloads
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-neutral-200/60 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full mb-4">1. Menu QR</span>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100">
                <QRCodeSVG id="menu-qr-svg" value={`${hostUrl}/restaurant/${restaurant?._id}/menu`} size={130} />
              </div>
              <p className="text-xs font-black text-neutral-800 mt-4">Digital Menu QR</p>
              <button
                onClick={() => downloadQRCode("menu-qr-svg", `${restaurant?.restaurantName || "restaurant"}-menu-qr`)}
                className="mt-4 w-full bg-neutral-900 text-white py-2.5 px-4 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-95"
              >
                <FiDownload /> Download QR
              </button>
            </div>

            <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase bg-red-600 text-white px-3 py-1 rounded-full mb-4 shadow-md shadow-red-600/20">2. Loyalty Pass QR</span>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-red-100">
                <QRCodeSVG id="loyalty-qr-svg" value={`${hostUrl}/restaurant/${restaurant?._id}/loyalty`} size={130} />
              </div>
              <p className="text-xs font-black text-red-700 mt-4">5-Stamp Reward Card</p>
              <button
                onClick={() => downloadQRCode("loyalty-qr-svg", `${restaurant?.restaurantName || "restaurant"}-loyalty-qr`)}
                className="mt-4 w-full bg-red-600 text-white py-2.5 px-4 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-md shadow-red-600/20 active:scale-95"
              >
                <FiDownload /> Download QR
              </button>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-3 py-1 rounded-full mb-4 shadow-md shadow-amber-500/20">3. Review Portal QR</span>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-amber-100">
                <QRCodeSVG id="review-qr-svg" value={reviewPortalUrl} size={130} />
              </div>
              <p className="text-xs font-black text-neutral-800 mt-4">AI Review Portal QR</p>
              <button
                onClick={() => downloadQRCode("review-qr-svg", `${restaurant?.restaurantName || "restaurant"}-google-review-qr`)}
                className="mt-4 w-full bg-amber-500 text-white py-2.5 px-4 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <FiDownload /> Download QR
              </button>
              {!restaurant?.socialLinks?.googleReviewUrl && (
                <Link href="/update-social" className="text-[10px] text-red-600 font-bold underline mt-2 hover:text-red-700">
                  Add Google Review Link in Settings
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}