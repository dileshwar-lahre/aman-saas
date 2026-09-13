"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaStar, FaCopy, FaExternalLinkAlt, FaMagic, FaInstagram, FaFacebook } from "react-icons/fa";

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
    // Clipboard me copy karo
    navigator.clipboard.writeText(review);
    setCopied(true);

    // Google Maps Review URL par redirect
    const targetUrl = restaurant?.socialLinks?.googleReviewUrl || "https://maps.google.com";
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl text-center">
        
        <h1 className="text-xl font-bold text-white mb-1">
          {restaurant?.name || "Restaurant"}
        </h1>
        <p className="text-red-500 text-sm font-medium mb-4">Share your 5-Star Experience ⭐</p>

        {/* Dynamic 5-Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-amber-400 text-2xl hover:scale-125 transition-transform cursor-pointer" />
          ))}
        </div>

        {/* AI Review Text Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 text-sm mb-3 min-h-[90px] flex items-center justify-center">
          {loading ? "Generating fresh AI Review..." : `"${review}"`}
        </div>

        {/* Regenerate Button */}
        <button
          onClick={fetchAIReview}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 mb-6 mx-auto transition"
        >
          <FaMagic /> Regenerate AI Review
        </button>

        {/* Main CTA Button */}
        <button
          onClick={handlePostReview}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-600/30 mb-6"
        >
          {copied ? "Copied! Opening Google Review..." : (
            <>
              <FaCopy /> Copy & Post on Google <FaExternalLinkAlt className="text-xs" />
            </>
          )}
        </button>

        {/* Social Follow Links */}
        {(restaurant?.socialLinks?.instagram || restaurant?.socialLinks?.facebook) && (
          <div className="pt-4 border-t border-slate-800 flex justify-center items-center gap-4">
            <span className="text-xs text-slate-400">Follow Us:</span>
            {restaurant?.socialLinks?.instagram && (
              <a href={restaurant.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-pink-500 hover:scale-110 transition">
                <FaInstagram className="text-xl" />
              </a>
            )}
            {restaurant?.socialLinks?.facebook && (
              <a href={restaurant.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-blue-500 hover:scale-110 transition">
                <FaFacebook className="text-xl" />
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
}