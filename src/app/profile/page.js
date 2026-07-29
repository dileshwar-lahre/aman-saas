"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiShare2,
  FiDownload,
  FiExternalLink,
  FiCheck,
  FiLogOut,
  FiBookOpen,
  FiAward,
  FiPlus,
  FiTrash2,
  FiCopy,
} from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import { LuChefHat } from "react-icons/lu";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("qr"); // 'qr', 'menu', 'loyalty'

  // Digital Menu State
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Paneer Butter Masala", price: "240", category: "Main Course" },
    { id: 2, name: "Cold Coffee Shake", price: "120", category: "Beverages" },
  ]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Main Course" });

  // Loyalty Card State
  const [loyaltyConfig, setLoyaltyConfig] = useState({
    stampsRequired: 5,
    rewardTitle: "Free Dessert on 5th Order!",
  });

  // Fetch Logged-in Profile
  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Logout Handler
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("userSession");
    router.push("/login");
    router.refresh();
  };

  // Copy Link
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR Code as PNG Image
  const handleDownloadQR = () => {
    const svgElement = document.getElementById("restaurant-qr-code");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 100, 100, 800, 800);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${data?.profile?.restaurantName || "Restaurant"}_Stonenox_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Add Item to Digital Menu
  const handleAddMenuItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
    setNewItem({ name: "", price: "", category: "Main Course" });
  };

  // Delete Item
  const handleDeleteMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <p className="text-xs font-black tracking-widest text-neutral-400 uppercase animate-pulse">
          LOADING STONENOX DIGITAL HUB...
        </p>
      </div>
    );
  }

  const { role, profile } = data || {};
  const isRestaurant = role === "restaurant";

  const publicPageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/restaurant/${profile?._id}`
    : `https://stonenox.com/restaurant/${profile?._id}`;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-black py-10 px-4 font-sans antialiased select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 🌟 HEADER BANNER */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black text-white text-2xl md:text-3xl font-black flex items-center justify-center shadow-md shrink-0">
              {isRestaurant
                ? profile?.restaurantName?.charAt(0).toUpperCase()
                : profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-amber-500/10 text-[#FF9900] text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                {isRestaurant ? "Restaurant Partner" : "Customer Node"}
              </span>
              <h1 className="text-xl md:text-2xl font-black text-black uppercase tracking-wider">
                {isRestaurant ? profile?.restaurantName : profile?.name}
              </h1>
              <p className="text-xs text-neutral-400 font-mono flex items-center justify-center md:justify-start gap-1">
                <FiMail /> {profile?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-neutral-100 hover:bg-black hover:text-white text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all active:scale-95"
          >
            <FiLogOut className="text-sm" />
            <span>Logout</span>
          </button>
        </div>

        {/* RESTAURANT DIGITAL TOOLKIT */}
        {isRestaurant ? (
          <div className="space-y-6">
            
            {/* TABS CONTROL */}
            <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-2xl border border-neutral-100 shadow-sm">
              <button
                onClick={() => setActiveTab("qr")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${
                  activeTab === "qr"
                    ? "bg-black text-white shadow-md"
                    : "text-neutral-400 hover:text-black hover:bg-neutral-50"
                }`}
              >
                <IoQrCodeOutline className="text-sm" />
                <span className="hidden sm:inline">Table QR</span>
              </button>

              <button
                onClick={() => setActiveTab("menu")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${
                  activeTab === "menu"
                    ? "bg-black text-white shadow-md"
                    : "text-neutral-400 hover:text-black hover:bg-neutral-50"
                }`}
              >
                <FiBookOpen className="text-sm" />
                <span className="hidden sm:inline">Digital Menu</span>
              </button>

              <button
                onClick={() => setActiveTab("loyalty")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-wider ${
                  activeTab === "loyalty"
                    ? "bg-black text-white shadow-md"
                    : "text-neutral-400 hover:text-black hover:bg-neutral-50"
                }`}
              >
                <FiAward className="text-sm" />
                <span className="hidden sm:inline">Stamp Loyalty</span>
              </button>
            </div>

            {/* TAB 1: DOWNLOADABLE TABLE QR CODE */}
            {activeTab === "qr" && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-3d-popup">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-200/80 shadow-inner">
                    <QRCodeSVG
                      id="restaurant-qr-code"
                      value={publicPageUrl}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono uppercase">
                    HD Table Standee Print Ready
                  </p>
                </div>

                <div className="space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-wider text-black">
                      Table QR Standee
                    </h2>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Download this QR Code, print and laminate it for your restaurant tables. Customers can scan to access your <b>Digital Menu</b> and <b>Stamp Loyalty Card</b> instantly!
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleDownloadQR}
                      className="w-full flex items-center justify-center gap-2 text-white text-xs font-black uppercase py-4 rounded-full transition-all active:scale-95 shadow-lg hover:brightness-110"
                      style={{ backgroundColor: "#FF9900", boxShadow: "0 4px 14px rgba(255, 153, 0, 0.4)" }}
                    >
                      <FiDownload className="text-base" />
                      <span>Download PNG QR Code</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(publicPageUrl)}
                        className="flex-1 flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-black uppercase py-3.5 rounded-full transition-all active:scale-95"
                      >
                        {copied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                        <span>{copied ? "Copied!" : "Copy URL"}</span>
                      </button>

                      <Link
                        href={`/restaurant/${profile?._id}`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 bg-black text-white text-xs font-black uppercase py-3.5 px-6 rounded-full transition-all active:scale-95"
                      >
                        <FiExternalLink />
                        <span>Preview</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIGITAL MENU BUILDER */}
            {activeTab === "menu" && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 space-y-6 animate-3d-popup">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black uppercase tracking-wider text-black">
                    Digital Menu Manager
                  </h2>
                  <span className="text-xs font-mono text-neutral-400 uppercase">
                    {menuItems.length} Items Live
                  </span>
                </div>

                {/* Add New Item Form */}
                <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-[#F3F4F6] rounded-2xl">
                  <input
                    type="text"
                    required
                    placeholder="Dish Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="sm:col-span-2 bg-white border border-neutral-200 rounded-full py-3 px-5 text-xs font-bold text-black focus:outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Price (₹)"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="bg-white border border-neutral-200 rounded-full py-3 px-5 text-xs font-bold text-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1 text-white text-xs font-black uppercase py-3 rounded-full active:scale-95 transition-all shadow-md"
                    style={{ backgroundColor: "#FF9900" }}
                  >
                    <FiPlus className="text-sm" />
                    <span>Add Item</span>
                  </button>
                </form>

                {/* Items List */}
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-2xl hover:border-black/20 transition-all"
                    >
                      <div>
                        <p className="text-sm font-black text-black">{item.name}</p>
                        <p className="text-[10px] font-mono text-neutral-400 uppercase">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-emerald-600">₹{item.price}</span>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors"
                        >
                          <FiTrash2 className="text-base" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STAMP LOYALTY CARD BUILDER */}
            {activeTab === "loyalty" && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 space-y-6 animate-3d-popup">
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-wider text-black">
                    Stamp Loyalty Card Setup
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Reward repeat customers with digital stamps on every visit!
                  </p>
                </div>

                {/* Live Card Preview */}
                <div className="p-6 bg-gradient-to-br from-neutral-900 to-black text-white rounded-3xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-amber-400 uppercase tracking-widest">Digital Stamp Card</p>
                      <h3 className="text-lg font-black uppercase">{profile?.restaurantName}</h3>
                    </div>
                    <FiAward className="text-3xl text-[#FF9900]" />
                  </div>

                  {/* Stamp Boxes */}
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: loyaltyConfig.stampsRequired }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-12 rounded-xl border border-white/20 flex items-center justify-center font-black text-xs ${
                          i === loyaltyConfig.stampsRequired - 1
                            ? "bg-[#FF9900] text-white border-none shadow-md"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {i === loyaltyConfig.stampsRequired - 1 ? "🎁" : i + 1}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-center text-neutral-300">
                    {loyaltyConfig.rewardTitle}
                  </p>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* CUSTOMER PROFILE CARD */
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-black">Customer Node Details</h2>
            <div className="p-4 bg-[#F3F4F6] rounded-2xl flex items-center gap-4">
              <FiUser className="text-xl text-[#FF9900]" />
              <div>
                <p className="text-[10px] font-mono uppercase text-neutral-400">Full Name</p>
                <p className="text-sm font-black text-black">{profile?.name}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}