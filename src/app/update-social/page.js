"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiX, FiCheckCircle, FiInstagram, FiFacebook, FiMapPin, FiUser } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

export default function UpdateSocialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    location: "",
    googleReviewUrl: "",
    instagram: "",
    facebook: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Pehle se saved restaurant data fetch karna
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setFormData({
            restaurantName: data.user.restaurantName || data.user.name || "",
            ownerName: data.user.ownerName || "",
            location: data.user.location || "",
            googleReviewUrl: data.user.socialLinks?.googleReviewUrl || "",
            instagram: data.user.socialLinks?.instagram || "",
            facebook: data.user.socialLinks?.facebook || "",
          });
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/restaurant/update-social", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          location: formData.location,
          socialLinks: {
            googleReviewUrl: formData.googleReviewUrl,
            instagram: formData.instagram,
            facebook: formData.facebook,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "🎉 Details successfully update ho gayi bhai!" });
        setTimeout(() => {
          router.push("/profile");
        }, 1200);
      } else {
        setMessage({ type: "error", text: data.error || "Update fail ho gaya!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server Connection Error!" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <p className="text-xs font-black tracking-widest text-red-600 uppercase animate-pulse">
          LOADING PROFILE...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-black flex items-center justify-center py-12 px-4 relative overflow-hidden font-sans antialiased">
      <style jsx global>{`
        @keyframes isometric-3d-pop {
          0% { transform: scale(0.94) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .animate-3d-popup {
          animation: isometric-3d-pop 0.4s cubic-bezier(0.34, 1.6, 0.64, 1) forwards;
        }
      `}</style>

      <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] p-8 md:p-10 relative z-50 animate-3d-popup shadow-[0_20px_50px_rgba(220,38,38,0.1),0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] border border-red-50">
        
        {/* Close / Back Button */}
        <Link
          href="/profile"
          className="absolute top-6 right-6 w-8 h-8 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
        >
          <FiX className="text-sm" />
        </Link>

        {/* Header */}
        <div className="text-center space-y-1 mb-6 pt-2">
          <h1 className="text-2xl font-black tracking-widest text-neutral-900 uppercase">
            Update Social & Details
          </h1>
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            Restaurant Management Node
          </p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-2xl text-[11px] font-bold text-center transition-all ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1 block">
              Restaurant Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Restaurant Name"
                className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
              />
              <LuChefHat className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1 block">
                Owner Name
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Owner Name"
                  className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-4 pr-10 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
                />
                <FiUser className="absolute right-4 text-neutral-400 text-xs pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1 block">
                Location
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-4 pr-10 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
                />
                <FiMapPin className="absolute right-4 text-neutral-400 text-xs pointer-events-none" />
              </div>
            </div>
          </div>

          <hr className="my-2 border-neutral-100" />

          <div>
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1 block">
              Google Business Review Link
            </label>
            <input
              type="url"
              name="googleReviewUrl"
              value={formData.googleReviewUrl}
              onChange={handleChange}
              placeholder="https://g.page/r/your-review-link"
              className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-5 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1 block">
              Instagram Profile Link
            </label>
            <div className="relative flex items-center">
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/your-restaurant"
                className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
              />
              <FiInstagram className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-1 block">
              Facebook Page Link
            </label>
            <div className="relative flex items-center">
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/your-restaurant"
                className="w-full bg-[#F9FAFB] border border-neutral-200/60 rounded-full py-3.5 pl-5 pr-12 text-xs font-bold text-black placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-red-600 transition-all shadow-inner"
              />
              <FiFacebook className="absolute right-5 text-neutral-400 text-sm pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-black text-xs uppercase tracking-widest py-4 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md mt-6 hover:brightness-110 disabled:opacity-50 bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)]"
          >
            <span>{loading ? "SAVING..." : "SAVE & UPDATE DETAILS"}</span>
            <FiCheckCircle className="text-sm" />
          </button>
        </form>
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-900/[0.03] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}