"use client";
import React, { useState, useEffect, use } from "react";
import { FiBookOpen, FiMapPin, FiSearch } from "react-icons/fi";

export default function CustomerPublicMenu({ params }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id;

  const [restaurantName, setRestaurantName] = useState("Loading...");
  const [location, setLocation] = useState("");
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`/api/restaurant/menu?restaurantId=${restaurantId}`);
        const data = await res.json();

        if (data.success) {
          setRestaurantName(data.restaurantName);
          setLocation(data.location);
          setMenu(data.menu);
        } else {
          setRestaurantName("Restaurant Not Found");
        }
      } catch (err) {
        console.error("Menu Loading Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (restaurantId) fetchMenu();
  }, [restaurantId]);

  // Extract unique categories
  const categories = ["All", ...new Set(menu.map((item) => item.category))];

  // Filter menu items
  const filteredMenu = menu.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-600">
        Digital Menu Load Ho Raha Hai...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Red Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 shadow-lg rounded-b-3xl">
        <div className="max-w-2xl mx-auto">
          <span className="bg-white/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Digital QR Menu
          </span>
          <h1 className="text-2xl font-black mt-2">{restaurantName}</h1>
          <p className="text-red-100 text-xs flex items-center gap-1 mt-1">
            <FiMapPin /> {location || "Delicious Dining Experience"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-5">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Kahi Kuch Khaas Dhoondh Rahe Hain? (e.g. Paneer, Pizza)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold shadow-sm focus:outline-red-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes List */}
        <div className="space-y-3">
          {filteredMenu.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-slate-400 text-xs font-bold border border-slate-200">
              <FiBookOpen className="text-3xl mx-auto mb-2 text-slate-300" />
              Koi Dish Nahi Mili!
            </div>
          ) : (
            filteredMenu.map((dish) => (
              <div
                key={dish._id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition-all"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-wider bg-red-50 px-2 py-0.5 rounded-md">
                    {dish.category}
                  </span>
                  <h3 className="text-sm font-black text-slate-800 mt-1">
                    {dish.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900">
                    ₹{dish.price}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}