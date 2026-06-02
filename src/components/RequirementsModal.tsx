import { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

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
  const [step, setStep] = useState<"details" | "payment">("details");
  
  // 🔄 تتبع حالة الـ Background Crawler والتقدم لايف
  const [progress, setProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState("Touring Web Corridors...");

  // 🔐 ساروت الأدمن السري (Unlimited Free Owner Access)
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("lorpulse_owner_access") === "true") {
      setIsOwnerMode(true);
    }
  }, []);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      localStorage.setItem("lorpulse_owner_access", "true");
      setIsOwnerMode(true);
      alert("⚡ Owner Privilege Engaged. Background async tracking activated.");
    }
  };

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

  // 📥 الفانكشن السحرية د الـ Polling: كتعرف السيرفر فين وصل وكتنزّل الـ CSV غير يسالي
  const startPollingCampaign = (campaignId: number) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://lorpulse-lorpusle-backend.hf.space/api/campaign/${campaignId}/status`);
        if (!res.ok) return;

        const data = await res.json();

        if (data.status === "processing") {
          setProgress(data.progress);
          setLoadingStatusText(`Extracting B2B Corporate Leads: ${data.progress}%`);
        } 
        
        else if (data.status === "completed") {
          setProgress(100);
          setLoadingStatusText("✅ Compilation 100% Complete! Triggering auto-download...");
          clearInterval(interval);
          
          // تنزيل تلقائي ف الحين من رابط السيرفر المباشر
          window.location.href = `https://lorpulse-lorpusle-backend.hf.space/api/campaign/${campaignId}/download`;
          
          setSuccess(true);
          setLoading(false);
        } 
        
        else if (data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          alert("🚨 Pipeline extraction hit a wall for this specific criteria. Verify your niche string.");
        }
      } catch (err) {
        console.error("Polling sync lost:", err);
      }
    }, 4000); // كيسول الباكيند كل 4 ثواني
  };

  // 🚀 تشغيل الـ Pipeline للأدمن فابور (بالـ Background Task الجديدة)
  const triggerOwnerBypass = async () => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Initializing Secure Async Pipeline Node...");
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
          paypal_order_id: `OWNER_ASYNC_HUNT_${Date.now()}`
        })
      });

      if (response.status === 202) {
        const data = await response.json();
        // البدء ف مراقبة السيرفر لايف حيت الخدمة بدات ف الخلفية
        startPollingCampaign(data.campaign_id);
      } else {
        alert("Extraction loop encountered an error on the Hugging Face node.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Owner pipeline execution failed:", error);
      alert("Network connection error. Check Hugging Face instance logs.");
      setLoading(false);
    }
  };

  // 💳 معالجة الدفع الحقيقي للكليان وتفعيل الـ Tracking لايف
  const handleClientPaymentSuccess = async (orderId: string) => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Verifying capture & spawning extraction threads...");
    try {
      const hollywoodEmailTemplate = `
Subject: Hand-extracted B2B data pipeline for ${formData.niche} (50 free verified records inside)

Hi Founder/CEO,

Most people send cold emails looking for a meeting. I’m sending you this because I’ve already done a part of your team's job today.

I ran your ecosystem through our autonomous intelligence pipeline, LorPulse. Based on your core focus in ${formData.niche}, our system bypassed the standard internet noise to map out high-intent prospects ready to buy in the next 30 days.

Instead of telling you how good our data is, here are your first 50 verified decision-maker leads for free—hand-enriched with 14 unique data points (including exact tech stack, company headcount, and verified corporate structure):

👉 [YOUR CUSTOM 50 FREE LEADS GOOGLE SHEET LINK DISPATCHED]

Why should you trust this data?
- Triple-Validated: SMTP and catch-all filtering guarantee a 98.4% deliverability rate.
- Intent-Driven: Scored 0–100 based on active hiring spikes and funding signals.

Our pipeline currently holds the remaining 4,950 highly specialized leads matching this exact quality blueprint, ready for instant download.

We are currently onboarding operators into our Private Beta. You can unlock the full dataset of 5,000 leads right now for a one-time activation of just $14 (No subscriptions, no hidden fees).

Check the 50 free contacts first. If they match your standards, grab the remaining 4,950 here:
🔗 lorpulse.vercel.app

To your next close,
LorPulse Operator Core
      `;

      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: "core",
          niche: formData.niche,
          city: formData.city,
          email: formData.email,
          email_subject_line: formData.subjectLine,
          paypal_order_id: orderId,
          hollywood_template: hollywoodEmailTemplate
        })
      });

      if (response.status === 202) {
        const data = await response.json();
        // ربط المتصفح مع السيرفر لايف حيت الدفع داز والـ Task بدات
        startPollingCampaign(data.campaign_id);
      } else {
        alert("Payment verified, but server pipeline initialization failed. Support notified.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Client pipeline injection failed:", error);
      alert("Network error synchronization. The server will deliver via Brevo email backup.");
      setLoading(false);
    }
  };

  if (plan === "horizon") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 rounded-3xl text-center shadow-2xl animate-fadeIn">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400 mb-4">Pulse Horizon</div>
          <h3 className="font-display text-2xl font-semibold text-white">Horizon Extraction Loop</h3>
          <p className="mt-3 text-sm text-zinc-400">The recurring live data extraction dashboard and AI loop automation is currently in private deployment.</p>
          <div className="mt-6 bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs text-yellow-500">🚀 Setting up infrastructure. Access expands next week!</div>
          <button onClick={onClose} className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl py-3 text-sm font-semibold transition-all">Close Window</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className={`relative w-full transition-all duration-300 bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 text-left shadow-2xl overflow-y-auto max-h-[95vh] ${step === "payment" ? "max-w-4xl" : "max-w-md"}`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm z-10">✕</button>

        {!success ? (
          <>
            {step === "details" ? (
              <div className="animate-fadeIn">
                <div className="text-xs uppercase tracking-[0.25em] text-purple-400 mb-1 font-medium">Onboarding Setup</div>
                
                <h3 onClick={handleSecretClick} className="font-display text-2xl font-semibold text-white tracking-tight cursor-default select-none">
                  Configure Your Pipeline {isOwnerMode && <span className="text-emerald-400 text-xs ml-1">● Owner Mode (Async)</span>}
                </h3>
                
                <p className="text-xs text-zinc-400 mt-1 mb-6">Pulse Core Plan — One-time activation fee of $14.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">Your Delivery Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600" placeholder="operator@agency.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">Target Niche / Industry Corridor</label>
                    <input type="text" name="niche" value={formData.niche} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600" placeholder="e.g., Series-A SaaS, Dubai Real Estate" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">Target City / Geo-Location</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600" placeholder="e.g., San Francisco, London" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">Cold Email Subject Line Reference</label>
                    <input type="text" name="subjectLine" value={formData.subjectLine} onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600" placeholder="e.g., Quick question regarding your scaling..." />
                  </div>

                  <button
                    disabled={!isFormValid}
                    onClick={() => {
                      if (isOwnerMode) {
                        triggerOwnerBypass();
                      } else {
                        setStep("payment");
                      }
                    }}
                    className={`mt-6 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${isFormValid ? "bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-lg shadow-white/5" : "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800"}`}
                  >
                    {isOwnerMode ? "Execute Async Owner Extraction ⚡" : "Proceed to Secure Checkout"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-slideIn pt-2">
                <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-zinc-900 pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
                  <div>
                    <button onClick={() => setStep("details")} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-6 transition-colors">
                      ← Edit info
                    </button>
                    <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-1">Pay LorPulse</div>
                    <h4 className="text-3xl font-bold text-white tracking-tight">$14.00</h4>
                    
                    <div className="mt-6 space-y-3 bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl text-xs">
                      <div className="flex justify-between"><span className="text-zinc-500">Pipeline:</span> <span className="text-zinc-300 font-medium">Pulse Core</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Niche:</span> <span className="text-zinc-300 truncate max-w-[100px] font-medium">{formData.niche}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Target:</span> <span className="text-zinc-300 font-medium">{formData.city}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Delivery:</span> <span className="text-zinc-300 truncate max-w-[100px] font-medium">{formData.email}</span></div>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-6 hidden md:block">
                    Secured by PayPal encryption layer. Authorized B2B lead generation node execution.
                  </div>
                </div>

                <div className="md:col-span-8 flex flex-col justify-start w-full min-h-[400px]">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 px-1">Select Payment Method</h4>
                  
                  <div className="w-full block overflow-visible px-1">
                    <PayPalButtons
                      style={{ layout: "vertical", color: "black", shape: "rect", label: "pay" }}
                      createOrder={(_, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            amount: { value: "14.00" },
                            description: `LorPulse Core: 5,000 ${formData.niche} Leads`
                          }]
                        });
                      }}
                      onApprove={async (_, actions) => {
                        if (!actions.order) return;
                        try {
                          setLoading(true);
                          const details = await actions.order.capture();
                          await handleClientPaymentSuccess(details.id);
                        } catch (error) {
                          console.error("PayPal Capture Error:", error);
                          alert("Transaction execution failed during network sync. Please retry.");
                          setLoading(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 max-w-md mx-auto animate-fadeIn">
            <span className="text-5xl">⚡</span>
            <h3 className="font-display text-2xl font-semibold mt-4 text-purple-400 tracking-tight">
              {isOwnerMode ? "Extraction Complete!" : "Pipeline Dispatched Instantly!"}
            </h3>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              {isOwnerMode 
                ? `The compiled CSV dataset for ${formData.niche} has been automatically downloaded to your local drive.`
                : `Success! Your 5,000 hyper-verified B2B leads file has been downloaded directly inside your browser. Concurrently, the structured confirmation and fallback download link have been dispatched to your email at ${formData.email} via Brevo.`
              }
            </p>
            <button onClick={onClose} className="mt-8 w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl py-3 text-sm font-semibold transition-all">
              Return to Operator Dashboard
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center z-50 animate-fadeIn">
            <div className="h-6 w-6 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <div className="text-xs uppercase tracking-widest text-purple-400 font-medium animate-pulse">
              {loadingStatusText}
            </div>
            
            {/* 📊 بار متحرك وجميل يعبر عن الـ Progress الحقيقي اللي جاي من السيرفر */}
            {progress > 0 && (
              <div className="w-48 bg-zinc-900 h-1.5 rounded-full mt-4 overflow-hidden border border-zinc-850">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            
            <p className="text-xs text-zinc-500 max-w-xs mt-3">
              Bypassing noise filters. Compiling specialized rows asynchronously to eliminate client-side connection timeouts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}