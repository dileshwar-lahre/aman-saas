"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiDownload, FiTrash2, FiLink2 } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import QRCode from "qrcode";

export default function RealQRHub() {
  const [targetUrl, setTargetUrl] = useState("https://stonenox.com");
  const [tableName, setTableName] = useState("Stonenox Main Entry");
  const [qrType, setQrType] = useState("menu");
  const [qrList, setQrList] = useState([]);

  // Base Instance Setup on initial component mount
  useEffect(() => {
    generateRealQR("https://stonenox.com", "Stonenox Main Link", "menu");
  }, []);

  // Async routine generating real data-uri pixel strings via package core
  const generateRealQR = async (url, name, type) => {
    try {
      const computedDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });

      const newQrNode = {
        id: Date.now(),
        name: name || `Table Node ${qrList.length + 1}`,
        url: url,
        type: type,
        image: computedDataUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setQrList((prev) => [newQrNode, ...prev]);
    } catch (err) {
      console.error("QR Processing Engine Mismatch: ", err);
    }
  };

  const handleCreateQR = (e) => {
    e.preventDefault();
    if (!targetUrl) return;
    generateRealQR(targetUrl, tableName, qrType);
    
    // Clear states for next transaction line entries
    setTableName("");
    setTargetUrl("");
  };

  const handleDeleteNode = (id) => {
    setQrList(qrList.filter(item => item.id !== id));
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Real QR Generation Cluster</h1>
            <p className="text-xs text-neutral-500 mt-0.5">Generate production-ready scannable layout nodes instantly.</p>
          </div>
        </div>

        {/* Content Splitting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Configuration Input Box */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-white border-b border-neutral-900 pb-3">
              <LuQrCode className="text-lg text-neutral-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Deploy Scannable Matrix</h3>
            </div>

            <form onSubmit={handleCreateQR} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Table Target Label</label>
                <input
                  type="text"
                  required
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="e.g., Table 03 VIP Deck"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Destination Link Url</label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com/menu"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neutral-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Routing Mode</label>
                <div className="grid grid-cols-2 bg-black border border-neutral-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQrType("menu")}
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${qrType === "menu" ? "bg-neutral-900 text-white" : "text-neutral-500"}`}
                  >
                    Menu View
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrType("loyalty")}
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${qrType === "loyalty" ? "bg-neutral-900 text-white" : "text-neutral-500"}`}
                  >
                    Loyalty Card
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-extrabold py-3 rounded-xl text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md pt-2"
              >
                <FiPlus className="text-sm" />
                <span>Build Scannable Frame</span>
              </button>
            </form>
          </div>

          {/* Active Generated Queue Grids */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 px-1">Compiled Matrix Pools</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {qrList.map((node) => (
                <div 
                  key={node.id} 
                  className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-800 transition-all group relative"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 max-w-[65%]">
                      <span className="inline-block bg-white text-black px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider">
                        {node.type === "menu" ? "Menu Scan" : "Loyalty Mode"}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-tight truncate pt-1">{node.name}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <FiLink2 className="shrink-0" />
                        <p className="truncate font-mono">{node.url}</p>
                      </div>
                    </div>

                    {/* Real high-fidelity responsive QR code container image frame */}
                    {/* Phone se direct check scan kar sakte ho isko */}
                    <div className="w-20 h-20 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <img src={node.image} alt="Dynamic Live scannable matrix block" className="w-full h-full object-contain select-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-900 text-xs font-mono text-neutral-500">
                    <span>{node.timestamp}</span>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={node.image}
                        download={`${node.name.replace(/\s+/g, '_')}_QR.png`}
                        className="p-2 bg-neutral-900 border border-neutral-800 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Download High-Res Print File"
                      >
                        <FiDownload />
                      </a>
                      <button
                        onClick={() => handleDeleteNode(node.id)}
                        className="p-2 bg-neutral-900 border border-neutral-800 text-red-500/70 hover:text-red-400 rounded-lg transition-colors flex items-center justify-center"
                        title="Destroy Matrix Instance"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}