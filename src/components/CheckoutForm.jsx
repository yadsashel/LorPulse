import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    email: '',
    niche: '',
    city: '',
    subjectLine: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // تشيك واش العميل عمر كاع الخانات
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    
    const valid = updatedForm.email && updatedForm.niche && updatedForm.city && updatedForm.subjectLine;
    setIsFormValid(valid);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black text-white border border-zinc-800 rounded-xl">
      <h2 className="text-xl font-bold mb-2">Private Beta Onboarding</h2>
      <p className="text-zinc-400 text-sm mb-6">Pulse Core — Lead Request ($14 one-time)</p>

      {!success ? (
        <div className="space-y-4">
          {/* Inputs Fields */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Work Email</label>
            <input type="email" name="email" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-purple-500" placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Niche / Industry</label>
            <input type="text" name="niche" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-purple-500" placeholder="Real Estate, SaaS..." />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">City / Region</label>
            <input type="text" name="city" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-purple-500" placeholder="Marrakesh, London..." />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Email Subject Line</label>
            <input type="text" name="subjectLine" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-purple-500" placeholder="e.g., Quick question about your scaling..." />
          </div>

          {/* PayPal Button Container */}
          {isFormValid && (
            <div className="mt-6">
              <p className="text-xs text-yellow-500 mb-2 text-center">Form ready! Unlock via secure PayPal checkout:</p>
              <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID_HERE" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: "14.00" },
                        description: `LorPulse Core - 5000 Leads for ${formData.niche}`
                      }]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    setLoading(true);
                    const details = await actions.order.capture();
                    
                    // 🚀 صيفط الداتا والـ Payment Details للـ FastAPI Backend دقة واحدة
                    try {
                      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          plan_type: "core",
                          niche: formData.niche,
                          city: formData.city,
                          email: formData.email,
                          email_subject_line: formData.subjectLine,
                          paypal_order_id: details.id // باش تسجل عندك باللي مخلص ومطرق
                        })
                      });

                      if (response.ok) {
                        setSuccess(true);
                      }
                    } catch (error) {
                      console.error("Pipeline triggering failed:", error);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <span className="text-4xl">🎉</span>
          <h3 className="text-lg font-bold mt-4 text-green-400">Payment Verified!</h3>
          <p className="text-zinc-400 text-sm mt-2">Your AI pipeline has been initialized. Check your inbox at <b>{formData.email}</b> within minutes for your secure download link.</p>
        </div>
      )}

      {loading && (
        <div className="text-center text-xs text-purple-400 mt-4 animate-pulse">
          ⚡ Verifying payment & spinning up AI Lead Miner...
        </div>
      )}
    </div>
  );
}