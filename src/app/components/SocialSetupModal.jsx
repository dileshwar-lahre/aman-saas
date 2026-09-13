"use client";
import { useState } from "react";
import { FaGoogle, FaInstagram, FaFacebook, FaSave, FaTimes } from "react-icons/fa";

export default function SocialSetupModal({ isOpen, onClose, restaurantId, initialLinks, onSaved }) {
  const [googleUrl, setGoogleUrl] = useState(initialLinks?.googleReviewUrl || "");
  const [instaUrl, setInstaUrl] = useState(initialLinks?.instagram || "");
  const [fbUrl, setFbUrl] = useState(initialLinks?.facebook || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/restaurant/update-socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          googleReviewUrl: googleUrl,
          instagram: instaUrl,
          facebook: fbUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onSaved) onSaved(data.data);
        onClose();
      } else {
        alert(data.message || "Error saving links");
      }
    } catch (err) {
      alert("Server error, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold text-red-500 mb-1 flex items-center gap-2">
          Setup Social & GMB Links 🚀
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Apna Google Review link add karein taaki customers direct 5-star review de sakein.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Google Review URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <FaGoogle className="text-red-500" /> Google Business Review Link / Place ID URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://g.page/r/.../review ya writereview?placeid=..."
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <FaInstagram className="text-pink-500" /> Instagram Profile Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/yourhandle"
              value={instaUrl}
              onChange={(e) => setInstaUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-2">
              <FaFacebook className="text-blue-500" /> Facebook Page Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={fbUrl}
              onChange={(e) => setFbUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30"
          >
            {loading ? "Saving Links..." : <><FaSave /> Save Links</>}
          </button>
        </form>
      </div>
    </div>
  );
}