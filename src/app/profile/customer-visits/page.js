"use client";
import React, { useState, useEffect } from "react";
import { FiUsers, FiPhone, FiCalendar, FiArrowLeft, FiAward, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerVisitsPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/restaurant/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.customers || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center">
        <p className="text-xs font-black tracking-widest text-red-600 uppercase animate-pulse">
          LOADING CUSTOMER VISIT LOGS...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-slate-900 pb-20 font-sans antialiased">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white py-12 px-6 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-100 hover:text-white mb-3 transition-colors active:scale-95"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-wide">
            Customer Visit Logs & Scan Count
          </h1>
          <p className="text-red-100 text-xs mt-1 font-medium">
            Aapke restaurant par visit karne wale sabhi approved customers ke numbers, total visits aur direct WhatsApp/Call actions.
          </p>
        </div>
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-6">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_10px_30px_rgba(220,38,38,0.06)] border border-red-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2.5">
              <FiUsers className="text-red-600 text-lg" /> Visited Customers Database ({customers.length})
            </h2>
          </div>

          {customers.length === 0 ? (
            <div className="py-16 text-center bg-[#F9FAFB] rounded-2xl border border-neutral-100">
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                Abhi tak koi customer visit record nahi hai bhai.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 text-[11px] font-black uppercase text-neutral-400 tracking-wider">
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Mobile Number</th>
                    <th className="py-3.5 px-4">Total Visits / Stamps</th>
                    <th className="py-3.5 px-4">Last Visit</th>
                    <th className="py-3.5 px-4 text-right">Direct Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs font-bold text-neutral-700">
                  {customers.map((item) => {
                    // Fix: Check both customerPhone direct field and populated customerId phone
                    const phoneNum = item.customerPhone || item.customerId?.phone || "";
                    const cleanPhone = phoneNum.replace(/\D/g, "");
                    const customerName = item.customerName || item.customerId?.name || "Valued Customer";
                    
                    // Total visits/stamps count
                    const totalVisits = item.currentStamp || 1;

                    return (
                      <tr key={item._id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-4 px-4 font-black text-neutral-900">
                          {customerName}
                        </td>
                        <td className="py-4 px-4 font-mono text-neutral-800 font-bold">
                          {phoneNum ? `+91 ${phoneNum}` : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black border border-red-100 inline-flex items-center gap-1">
                            <FiAward /> {totalVisits} Visits (Stamp #{totalVisits})
                          </span>
                        </td>
                        <td className="py-4 px-4 text-neutral-400 text-[11px] font-medium">
                          <div className="flex items-center gap-1">
                            <FiCalendar /> {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
                          <span className="text-[10px] text-neutral-300">
                            {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Call Button */}
                            {phoneNum ? (
                              <a
                                href={`tel:${phoneNum}`}
                                title="Call Customer"
                                className="w-9 h-9 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                              >
                                <FiPhone className="text-sm" />
                              </a>
                            ) : null}

                            {/* WhatsApp Message Button */}
                            {phoneNum ? (
                              <a
                                href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(customerName)},%20thank%20you%20for%20visiting%20our%20restaurant!%20Aapka%20visit%20record%20aur%20stamp%20successfully%20update%20ho%20gaya%20hain.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Send WhatsApp Message"
                                className="px-3.5 py-2 bg-emerald-500 text-white rounded-xl text-[11px] font-black flex items-center gap-1.5 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                              >
                                <FiMessageSquare className="text-sm" /> WhatsApp
                              </a>
                            ) : (
                              <span className="text-[10px] text-neutral-400">No Number</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}