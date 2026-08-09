"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit3, FiX, FiCheck, FiArrowLeft, FiSearch } from "react-icons/fi";
import Link from "next/link";

export default function OwnerMenuManager() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Main Course" });
  const [editingItem, setEditingItem] = useState(null); // Active Edit Item
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      if (data.success && data.restaurant) {
        setRestaurant(data.restaurant);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Add Dish
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !restaurant) return;

    try {
      const res = await fetch("/api/restaurant/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant._id,
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRestaurant({ ...restaurant, menu: data.menu });
        setNewItem({ name: "", price: "", category: "Main Course" });
      }
    } catch (err) {
      alert("Error adding dish");
    }
  };

  // Live Update / Edit Dish
  const handleUpdateDish = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch("/api/restaurant/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant._id,
          itemId: editingItem._id,
          name: editingItem.name,
          price: editingItem.price,
          category: editingItem.category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRestaurant({ ...restaurant, menu: data.menu });
        setEditingItem(null); // Close Edit Modal
        alert("✅ Dish details updated successfully!");
      }
    } catch (err) {
      alert("Error updating dish");
    }
  };

  // Delete Dish
  const handleDeleteDish = async (itemId) => {
    if (!confirm("Kya aap is dish ko menu se hatana chahte hain?")) return;

    try {
      const res = await fetch("/api/restaurant/menu", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant._id,
          itemId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRestaurant({ ...restaurant, menu: data.menu });
      }
    } catch (err) {
      alert("Error deleting dish");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-600">
        Loading Menu Control...
      </div>
    );
  }

  const filteredMenu = (restaurant?.menu || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/profile" className="flex items-center gap-2 text-xs font-black uppercase bg-white/20 px-3 py-2 rounded-xl hover:bg-white/30 transition-all">
            <FiArrowLeft /> Dashboard
          </Link>
          <h1 className="text-lg font-black">{restaurant?.restaurantName || restaurant?.name} - Menu Control</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        
        {/* ADD DISH */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <FiPlus className="text-red-600" /> Add New Item To Menu
          </h2>

          <form onSubmit={handleAddDish} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Dish Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-slate-50 border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
            />
            <input
              type="number"
              placeholder="Price in ₹"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="bg-slate-50 border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="bg-slate-50 border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
            >
              <option value="Starters">Starters</option>
              <option value="Main Course">Main Course</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
            </select>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              Save Dish
            </button>
          </form>
        </div>

        {/* LIST & EDIT DISHES */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-base font-black text-slate-800">Menu Items ({filteredMenu.length})</h2>
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-3.5 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-red-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredMenu.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold text-center py-8">Menu list is empty!</p>
            ) : (
              filteredMenu.map((dish) => (
                <div key={dish._id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                      {dish.category}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm mt-1">{dish.name}</h3>
                    <p className="text-xs font-black text-slate-900 mt-0.5">₹{dish.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => setEditingItem(dish)}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 p-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      <FiEdit3 /> Edit
                    </button>
                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDeleteDish(dish._id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 p-2.5 rounded-xl text-xs font-bold transition-all"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* EDIT DISH POPUP MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-900">Edit Dish Details</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUpdateDish} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-xs font-bold focus:outline-red-500"
                >
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="w-full py-3 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md"
                >
                  <FiCheck /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}