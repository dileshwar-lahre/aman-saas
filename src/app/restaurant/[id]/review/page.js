"use client";
import React, { useState, useEffect, use } from "react";
import { FaStar, FaCopy, FaExternalLinkAlt, FaMagic, FaInstagram, FaFacebook, FaCheck } from "react-icons/fa";

export default function CustomerReviewPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [restaurant, setRestaurant] = useState(null);
  const [review, setReview] = useState("Generating personalized 5-star AI review...");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch restaurant details and generate fresh AI review on page load
  useEffect(() => {
    async function loadRestaurant() {
      try {
        const res = await fetch(`/api/restaurant/public?restaurantId=${id}`);
        const data = await res.json();
        if (data.success && data.restaurant) {
          setRestaurant(data.restaurant);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (id) {
      loadRestaurant();
      fetchAIReview();
    }
  }, [id]);

  const fetchAIReview = async () => {
    setLoading(true);
    setCopied(false); // Reset copy state on new generation
    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: restaurant?.restaurantName || restaurant?.name
        })
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReview(data.review);
      }
    } catch (err) {
      setReview("Amazing food, superb ambiance, and very friendly staff! 10/10 recommended! ⭐⭐⭐⭐⭐");
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ Mobile & HTTP Safe Clipboard Copy Fallback
  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(review).then(() => {
        setCopied(true);
      }).catch(() => {
        fallbackCopy(review);
      });
    } else {
      fallbackCopy(review);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
    } catch (err) {
      alert("Copy failed. Please select text manually.");
    }
    document.body.removeChild(textArea);
  };

  // 🛑 AB YEH PEHLE TEXT COPY KAREGA, USKE BAAD USER KO OPTION DEGA YA 1.2 SEC BAAD GOOGLE LINK KHULEGA
  const handlePostReview = () => {
    handleCopy();
    
    // Restaurant dwara dala gaya exact Google Review link (ya fallback)
    const targetUrl = restaurant?.socialLinks?.googleReviewUrl || restaurant?.googleReviewUrl || "https://google.com";
    
    setTimeout(() => {
      window.open(targetUrl, "_blank"); // New tab me kholega taaki user ka page safe rahe
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-slate-900 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(220,38,38,0.08)] border border-red-50 text-center space-y-6">
        
        {/* Badge */}
        <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
          <FaStar className="text-amber-500" /> Google Review Portal
        </span>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-neutral-900">
            {restaurant?.restaurantName || restaurant?.name || "Restaurant Partner"}
          </h1>
          <p className="text-xs text-red-600 font-bold">Share your 5-Star Experience ⭐</p>
        </div>

        {/* Dynamic 5-Stars */}
        <div className="flex justify-center gap-2 py-1">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-amber-400 text-2xl hover:scale-125 transition-transform cursor-pointer drop-shadow-sm" />
          ))}
        </div>

        {/* AI Review Text Box */}
        <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-neutral-200/80 text-neutral-800 text-xs font-bold leading-relaxed min-h-[100px] flex items-center justify-center relative shadow-inner">
          {loading ? (
            <span className="text-neutral-400 animate-pulse uppercase tracking-wider text-[10px] font-black">
              Generating fresh unique AI Review...
            </span>
          ) : (
            `"${review}"`
          )}
        </div>

        {/* Regenerate Button - Har baar bilkul naya review layega */}
        <button
          onClick={fetchAIReview}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 mx-auto transition-all active:scale-95 bg-red-50 px-4 py-2 rounded-xl border border-red-100"
        >
          <FaMagic className="text-sm" /> Regenerate Fresh AI Review
        </button>

        {/* Main CTA Button */}
        <button
          onClick={handlePostReview}
          className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
            copied
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
          }`}
        >
          {copied ? (
            <>
              <FaCheck className="text-sm stroke-[3]" /> Copied! Opening Google Link...
            </>
          ) : (
            <>
              <FaCopy /> Copy & Post on Google <FaExternalLinkAlt className="text-xs" />
            </>
          )}
        </button>

        {/* Social Follow Links */}
        {(restaurant?.socialLinks?.instagram || restaurant?.socialLinks?.facebook) && (
          <div className="pt-4 border-t border-neutral-100 flex justify-center items-center gap-4">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Follow Us:</span>
            {restaurant?.socialLinks?.instagram && (
              <a href={restaurant.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 bg-pink-50 text-pink-600 border border-pink-100 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                <FaInstagram className="text-base" />
              </a>
            )}
            {restaurant?.socialLinks?.facebook && (
              <a href={restaurant.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                <FaFacebook className="text-base" />
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
}