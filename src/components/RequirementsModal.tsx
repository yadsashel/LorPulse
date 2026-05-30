import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface RequirementsModalProps {
  plan: "core" | "horizon";
  onClose: () => void;
}

export function RequirementsModal({ plan, onClose }: RequirementsModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    niche: "",
    city: "",
    subjectLine: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // جلب الـ Client ID الآمن من البيئة (Vite Environment)
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const valid =
      updatedForm.email.includes("@") &&
      updatedForm.niche.trim() !== "" &&
      updatedForm.city.trim() !== "" &&
      updatedForm.subjectLine.trim() !== "";
    setIsFormValid(valid);
  };

  if (plan === "horizon") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-md glass-strong border border-white/10 p-8 rounded-3xl text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm">✕</button>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs text-[oklch(0.78_0.18_300)] mb-4">Pulse Horizon</div>
          <h3 className="font-display text-2xl font-semibold">Horizon Extraction Loop</h3>
          <p className="mt-3 text-sm text-muted-foreground">The recurring live data extraction dashboard and AI loop automation is currently in private deployment.</p>
          <div className="mt-6 bg-white/5 border border-white/15 p-4 rounded-xl text-xs text-yellow-500">🚀 Setting up infrastructure. Access expands next week!</div>
          <button onClick={onClose} className="mt-6 w-full halo-btn rounded-xl py-3 text-sm font-semibold bg-white/10 border border-white/10">Close Window</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-strong border border-white/10 p-6 sm:p-8 rounded-3xl text-left overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm">✕</button>

        {!success ? (
          <>
            <div className="text-xs uppercase tracking-[0.25em] text-[oklch(0.78_0.18_300)] mb-1">Onboarding Setup</div>
            <h3 className="font-display text-2xl font-semibold">Configure Your Pipeline</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-6">Pulse Core Plan — One-time activation fee of $14.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Your Delivery Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm text-foreground focus:outline-none focus:border-[oklch(0.78_0.18_300)] transition-colors" placeholder="operator@agency.com" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Target Niche / Industry Corridor</label>
                <input type="text" name="niche" value={formData.niche} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm text-foreground focus:outline-none focus:border-[oklch(0.78_0.18_300)] transition-colors" placeholder="e.g., Series-A SaaS, Dubai Luxury Real Estate" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Target City / Geo-Location</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm text-foreground focus:outline-none focus:border-[oklch(0.78_0.18_300)] transition-colors" placeholder="e.g., San Francisco, London, Global" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Cold Email Subject Line Reference</label>
                <input type="text" name="subjectLine" value={formData.subjectLine} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm text-foreground focus:outline-none focus:border-[oklch(0.78_0.18_300)] transition-colors" placeholder="e.g., Quick question regarding your scaling..." />
              </div>

              {isFormValid && paypalClientId ? (
                <div className="mt-6 pt-4 border-t border-white/5 animate-fadeIn">
                  <p className="text-[11px] text-zinc-400 text-center mb-3">Secure deployment via PayPal Core Layer</p>
                  <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                      createOrder={(_, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: { value: "14.00" },
                            description: `LorPulse Core: 5,000 ${formData.niche} Leads for ${formData.email}`
                          }]
                        });
                      }}
                      onApprove={async (_, actions) => {
                        if (!actions.order) return;
                        setLoading(true);
                        const details = await actions.order.capture();

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
                              paypal_order_id: details.id
                            })
                          });

                          if (response.ok) {
                            setSuccess(true);
                          }
                        } catch (error) {
                          console.error("Failed to securely deploy pipeline boundaries:", error);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <div className="mt-6 text-center text-xs text-muted-foreground bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  Fill all required vectors above to initialize secure checkout.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-6 animate-fadeIn">
            <span className="text-5xl text-glow">⚡</span>
            <h3 className="font-display text-2xl font-semibold mt-4 text-purple-400">Pipeline Deployed!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Payment verified successfully. LorPulse AI Core has queued extraction loops for <b>{formData.niche}</b>. 
              The verified CSV dataset will land at <b>{formData.email}</b> within 24 hours.
            </p>
            <button onClick={onClose} className="mt-8 w-full halo-btn rounded-xl py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15">
              Return to Operator Dashboard
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="h-8 w-8 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <div className="text-xs uppercase tracking-widest text-[oklch(0.78_0.18_300)] animate-pulse">Initializing Agentic Miner...</div>
            <p className="text-xs text-muted-foreground max-w-xs mt-2">Securing data routing layer and executing background thread triggers on Hugging Face.</p>
          </div>
        )}
      </div>
    </div>
  );
}