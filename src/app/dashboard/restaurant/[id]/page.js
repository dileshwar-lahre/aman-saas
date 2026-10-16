import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import { notFound } from "next/navigation";
import { FiMapPin, FiMenu, FiGift, FiInstagram, FiFacebook, FiStar } from "react-icons/fi";
import Link from "next/link";

// Server Component for Dynamic Restaurant View
export default async function CustomerRestaurantView({ params }) {
  const { id } = params;

  // Database connect karke restaurant ki ID se data fetch karo
  try {
    await connectToDatabase();
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-[#FFF5F5] text-slate-900 pb-20 font-sans antialiased">
        {/* Top Crimson Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-12 px-6 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-2">
            <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full backdrop-blur-md">
              Verified Dining Partner
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-wide">
              {restaurant.restaurantName}
            </h1>
            <p className="text-red-100 text-xs font-medium flex items-center justify-center gap-1">
              <FiMapPin className="text-red-300" /> {restaurant.location} • Owner: {restaurant.ownerName}
            </p>
          </div>
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6">

          {/* 🎟️ LOYALTY CARD & STAMPS SECTION */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <FiGift /> Digital Loyalty Pass
            </div>
            <h2 className="text-xl font-black text-neutral-900">Aapka Stamp & Reward Card</h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Restaurant par visit karne par apne stamps collect karein aur exciting free meals / discounts paayein!
            </p>

            {/* Stamp Grid Preview */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div 
                  key={num} 
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 ${
                    num === 6 
                      ? "bg-amber-50 border-amber-200 text-amber-700 col-span-3 md:col-span-1" 
                      : "bg-[#F9FAFB] border-neutral-200 text-neutral-400"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {num === 6 ? "Reward" : `Stamp ${num}`}
                  </span>
                  <span className="text-xs font-bold">
                    {num === 6 ? "🎁 Free" : `#${num}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 📋 RESTAURANT MENU SECTION */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <FiMenu className="text-red-600 text-lg" /> Special Menu & Pricing
            </h2>

            {!restaurant.menu || restaurant.menu.length === 0 ? (
              <div className="py-8 text-center bg-[#F9FAFB] rounded-2xl border border-neutral-100">
                <p className="text-xs text-neutral-400 font-bold uppercase">Menu items jald hi update honge.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurant.menu.map((item, idx) => (
                  <div key={idx} className="bg-[#F9FAFB] p-4 rounded-2xl border border-neutral-200/60 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-neutral-900 text-sm">{item.name}</h4>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.category}</span>
                    </div>
                    <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🌐 SOCIAL & GOOGLE REVIEW LINKS */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50 space-y-4">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-4">
              Connect & Review
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {restaurant.socialLinks?.googleReviewUrl && (
                <a 
                  href={restaurant.socialLinks.googleReviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 font-bold text-xs text-center hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                >
                  <FiStar className="text-amber-500" /> Rate on Google
                </a>
              )}
              {restaurant.socialLinks?.instagram && (
                <a 
                  href={restaurant.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 bg-pink-50 border border-pink-200 rounded-2xl text-pink-600 font-bold text-xs text-center hover:bg-pink-100 transition-all flex items-center justify-center gap-2"
                >
                  <FiInstagram /> Instagram
                </a>
              )}
              {restaurant.socialLinks?.facebook && (
                <a 
                  href={restaurant.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600 font-bold text-xs text-center hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  <FiFacebook /> Facebook
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}