'use client';
import { useState } from 'react';

export default function BillingPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert('Razorpay SDK load nahi ho paya. Internet check kar bhai!');
      setLoadingPlan(null);
      return;
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();

      if (!data.order || !data.order.id) {
        alert(data.error || 'Order ID nahi mili!');
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: 'rzp_live_TkI7GruXrk44Kl',
        amount: data.order.amount,
        currency: 'INR',
        name: 'Aman SaaS - Restaurant Growth',
        description: data.planName,
        order_id: data.order.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'verify',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await verifyRes.json();
          alert(result.message);
          setLoadingPlan(null);
        },
        prefill: {
          name: 'Restaurant Owner',
          email: 'owner@restaurant.com',
          contact: '9999999999',
        },
        theme: {
          color: '#DC2626', // Red theme color for Razorpay modal
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment fail ho gayi: ' + response.error.description);
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Kuch gadbad ho gayi payment process mein!');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Brand Header */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <span className="bg-red-600 text-white font-bold text-xl px-4 py-2 rounded-xl shadow-md">
            Aman SaaS
          </span>
          <span className="text-gray-500 text-sm font-semibold tracking-wide uppercase">
            Restaurant Growth Suite
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900">
          Apne Restaurant ko Digital Banao & <span className="text-red-600">Repeat Customers</span> Badhao
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Digital QR Menu, 5-Scratch Loyalty Cards (6th Visit Reward & Custom Owner Rewards), aur Automated Customer Reviews ka complete setup.
        </p>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 text-left">
          
          {/* Monthly Plan */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:border-red-600 transition">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Monthly Plan</h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">Standard</span>
              </div>
              <p className="mt-2 text-gray-500 text-sm">Perfect for local standalone restaurants.</p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight text-gray-900">₹999</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">✅ Digital QR Menu Setup</li>
                <li className="flex items-center gap-2">✅ 5-Scratch Loyalty Card System</li>
                <li className="flex items-center gap-2">✅ 6th Visit Special Rewards</li>
                <li className="flex items-center gap-2">✅ Customer Review Collector</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loadingPlan === 'monthly'}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer text-center shadow-md shadow-red-600/20"
            >
              {loadingPlan === 'monthly' ? 'Processing...' : 'Choose Monthly'}
            </button>
          </div>

          {/* 6 Months Plan (1 Month Free) */}
          <div className="bg-white border-2 border-red-600 rounded-2xl shadow-xl p-8 flex flex-col justify-between relative transform lg:-translate-y-2">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
              1 Month Free • Best Value
            </div>
            <div>
              <div className="flex justify-between items-center mt-2">
                <h3 className="text-xl font-semibold text-gray-900">6 Months Plan</h3>
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full font-medium">Popular</span>
              </div>
              <p className="mt-2 text-gray-500 text-sm">Pay for 5 months, get 1 month absolute free.</p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight text-gray-900">₹4,995</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/6 mos</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">✅ Everything in Monthly Plan</li>
                <li className="flex items-center gap-2">✅ Custom Owner Reward Configuration</li>
                <li className="flex items-center gap-2">✅ Repeat Customer Analytics</li>
                <li className="flex items-center gap-2">✅ Priority WhatsApp Support</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('half_yearly')}
              disabled={loadingPlan === 'half_yearly'}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer text-center shadow-lg shadow-red-600/30"
            >
              {loadingPlan === 'half_yearly' ? 'Processing...' : 'Choose 6 Months'}
            </button>
          </div>

          {/* 12 Months Plan (2 Months Free) */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col justify-between relative hover:border-red-600 transition">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
              2 Months Free • Mega Saver
            </div>
            <div>
              <div className="flex justify-between items-center mt-2">
                <h3 className="text-xl font-semibold text-gray-900">12 Months Plan</h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">Enterprise</span>
              </div>
              <p className="mt-2 text-gray-500 text-sm">Pay for 10 months, get 2 months absolute free.</p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight text-gray-900">₹9,990</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/year</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">✅ Everything in 6 Months Plan</li>
                <li className="flex items-center gap-2">✅ Advanced Multi-branch Support</li>
                <li className="flex items-center gap-2">✅ Custom Branding & Domain</li>
                <li className="flex items-center gap-2">✅ Dedicated Account Manager</li>
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={loadingPlan === 'yearly'}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer text-center shadow-md shadow-red-600/20"
            >
              {loadingPlan === 'yearly' ? 'Processing...' : 'Choose 12 Months'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}