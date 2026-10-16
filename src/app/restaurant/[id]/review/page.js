"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaStar, FaCopy, FaExternalLinkAlt, FaMagic, FaInstagram, FaFacebook, FaCheck } from "react-icons/fa";

export default function CustomerReviewPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [review, setReview] = useState("Generating personalized 5-star AI review...");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch restaurant details
  useEffect(() => {
    async function loadRestaurant() {
      try {
        const res = await fetch(`/api/restaurant/${id}`);
        const data = await res.json();
        if (data.success) {
          setRestaurant(data.restaurant);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (id) loadRestaurant();
    fetchAIReview();
  }, [id]);

  const fetchAIReview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-review", { method: "POST" });
      const data = await res.json();
      setReview(data.review);
    } catch (err) {
      setReview("Amazing food, superb ambiance, and very friendly staff! 10/10 recommended!");
    } finally {
      setLoading(false);
    }
  };

  const handlePostReview = () => {
    navigator.clipboard.writeText(review);
    setCopied(true);

    const targetUrl = restaurant?.socialLinks?.googleReviewUrl || "https://maps.google.com";
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 800);
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
            {restaurant?.name || restaurant?.restaurantName || "Restaurant Partner"}
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
              Generating fresh AI Review...
            </span>
          ) : (
            `"${review}"`
          )}
        </div>

        {/* Regenerate Button */}
        <button
          onClick={fetchAIReview}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 mx-auto transition-all active:scale-95 bg-red-50 px-4 py-2 rounded-xl border border-red-100"
        >
          <FaMagic className="text-sm" /> Regenerate AI Review
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
              <FaCheck className="text-sm stroke-[3]" /> Copied! Opening Google Review...
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