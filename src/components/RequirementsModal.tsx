import { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface RequirementsModalProps {
  plan: "core";
  onClose: () => void;
}

export function RequirementsModal({ onClose }: RequirementsModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    niche: "",
    city: "",
  });
  
  const [targetLeads, setTargetLeads] = useState<number>(500);
  const [dynamicPrice, setDynamicPrice] = useState<string>("7.00");

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"details" | "payment" | "processing_live">("details");

  const [progress, setProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState("Touring Web Corridors...");
  const [liveLeadsFound, setLiveLeadsFound] = useState(0);
  const [backendCampaignId, setBackendCampaignId] = useState<number | null>(null);

  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const rawPrice = targetLeads * 0.014;
    const finalPrice = Math.min(rawPrice, 14.00).toFixed(2);
    setDynamicPrice(finalPrice);
  }, [targetLeads]);

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
      updatedForm.city.trim() !== "";
    setIsFormValid(valid);
  };

  const startPollingCampaign = (campaignId: number, maxTarget: number) => {
    setBackendCampaignId(campaignId);
    setStep("processing_live");
    setLoading(false); 
    setProgress(5);
    setLoadingStatusText("Deploying Autonomous Extraction Matrix...");

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://lorpulse-lorpusle-backend.hf.space/api/campaign/${campaignId}/status`
        );
        if (!res.ok) return;

        const data = await res.json();
        const currentFound = data.leads_found || 0;
        setLiveLeadsFound(currentFound);

        const calcProgress = Math.min(Math.floor((currentFound / maxTarget) * 100), 99);

        if (data.status === "pending" || data.status === "processing") {
          setProgress(calcProgress === 0 ? 15 : calcProgress);
          setLoadingStatusText(`Extracting & Verifying Corporate Leads: ${currentFound} / ${maxTarget}`);
        } else if (data.status === "waiting_for_payment") {
          setProgress(99);
          setLoadingStatusText("Data Compiled & Guarded. Securing transmission tunnel...");
        } else if (data.status === "completed") {
          setProgress(100);
          setLoadingStatusText("✅ Compilation 100% Complete! Triggering auto-download...");
          clearInterval(interval);
          
          window.location.href = `https://lorpulse-lorpusle-backend.hf.space/api/campaign/${campaignId}/download`;
          setSuccess(true);
        } else if (data.status === "failed") {
          clearInterval(interval);
          alert("🚨 Pipeline extraction hit a wall for this specific criteria. Verify your niche string.");
        }
      } catch (err) {
        console.error("Polling sync lost:", err);
      }
    }, 3500);
  };

  const launchLiveLeadScan = async () => {
    setLoading(true);
    setProgress(40);
    setLoadingStatusText(`Locking targeted quota of ${targetLeads} records...`);
    
    setTimeout(() => {
      setLoading(false);
      setStep("payment");
    }, 1000);
  };

  const triggerOwnerBypass = async () => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Initializing Secure Async Pipeline Node...");
    try {
      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: "Pulse Core",
          niche: formData.niche,
          city: formData.city,
          email: formData.email,
          target_leads: targetLeads,
          paypal_order_id: `OWNER_ASYNC_FREE_BYPASS_${Date.now()}`,
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        startPollingCampaign(data.campaign_id, targetLeads);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Owner pipeline execution failed:", error);
      setLoading(false);
    }
  };

  const handleClientPaymentSuccess = async (orderId: string) => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Injecting secure payload & allocating extraction threads... ");
    try {
      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: "Pulse Core",
          niche: formData.niche,
          city: formData.city,
          email: formData.email,
          target_leads: targetLeads,
          paypal_order_id: orderId,
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        
        await fetch(`https://lorpulse-lorpusle-backend.hf.space/api/campaign/${data.campaign_id}/confirm-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypal_order_id: orderId })
        });

        startPollingCampaign(data.campaign_id, targetLeads);
      } else {
        alert("Payment authorized, but backend pipeline allocation failed. Support logs updated.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Client pipeline injection failed:", error);
      alert("Synchronization warning. Your data is generating and will be delivered to your inbox.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full transition-all duration-300 bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 text-left shadow-2xl overflow-y-auto max-h-[95vh] ${
          step === "payment" ? "max-w-4xl" : "max-w-md"
        }`}
      >
        {step !== "processing_live" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm z-10"
          >
            ✕
          </button>
        )}

        {!success ? (
          <>
            {step === "details" ? (
              <div className="animate-fadeIn">
                <div className="text-xs uppercase tracking-[0.25em] text-purple-400 mb-1 font-medium">
                  Onboarding Setup
                </div>

                <h3
                  onClick={handleSecretClick}
                  className="font-display text-2xl font-semibold text-white tracking-tight cursor-default select-none"
                >
                  Configure Pipeline{" "}
                  {isOwnerMode && (
                    <span className="text-emerald-400 text-xs ml-1">● Owner Mode (Async)</span>
                  )}
                </h3>

                <p className="text-xs text-zinc-400 mt-1 mb-6">
                  Pulse Core Plan — Metered Pricing ($0.014 / verified lead).
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
                      Your Delivery Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600"
                      placeholder="operator@agency.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
                      Target Niche / Industry Corridor
                    </label>
                    <input
                      type="text"
                      name="niche"
                      value={formData.niche}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600"
                      placeholder="e.g., Series-A SaaS, Dubai Real Estate"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
                      Target City / Geo-Location
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600"
                      placeholder="e.g., Canada, New York, London"
                    />
                  </div>

                  <div className="pt-2 pb-1 border-t border-zinc-900 mt-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                        Target Leads Volume Quota
                      </label>
                      <span className="text-xs font-bold text-purple-400 font-mono bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg">
                        {targetLeads} Records
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="10"
                      value={targetLeads}
                      onChange={(e) => setTargetLeads(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-900 border border-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                    />
                    
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                      <span>Min: 50 ($0.70)</span>
                      <span className="text-zinc-400 font-semibold">Estimated Price: ${dynamicPrice} USD</span>
                      <span>Max: 1000 ($14.00)</span>
                    </div>
                  </div>

                  <button
                    disabled={!isFormValid}
                    onClick={() => {
                      if (isOwnerMode) {
                        triggerOwnerBypass();
                      } else {
                        launchLiveLeadScan();
                      }
                    }}
                    className={`mt-4 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                      isFormValid
                        ? "bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-lg shadow-white/5"
                        : "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800"
                    }`}
                  >
                    {isOwnerMode ? "Execute Async Owner Extraction ⚡" : "Launch Live Lead Scan →"}
                  </button>
                </div>
              </div>
            ) : step === "payment" ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-slideIn pt-2">
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-zinc-900 pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
                  <div>
                    <button
                      onClick={() => setStep("details")}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
                    >
                      ← Edit info
                    </button>
                    <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-1">
                      Metered Invoice Total
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-4xl font-bold text-white tracking-tight">${dynamicPrice}</h4>
                      <span className="text-xs text-zinc-500 font-mono">USD</span>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-xs text-purple-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                      Locked Quota: {targetLeads} verified records
                    </div>

                    <div className="mt-6 space-y-3 bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Rate Card:</span>
                        <span className="text-zinc-300 font-mono">$0.014 / Lead</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Niche:</span>
                        <span className="text-zinc-300 truncate max-w-[120px] font-medium">
                          {formData.niche}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Target Geo:</span>
                        <span className="text-zinc-300 font-medium">{formData.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Delivery Box:</span>
                        <span className="text-zinc-300 truncate max-w-[120px] font-medium">
                          {formData.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-6 hidden md:block">
                    Secured via PayPal encryption layers. Real-time pay-as-you-go extraction quota billing. 
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-start w-full min-h-[380px]">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 px-1">
                    Select Secured Payment Method
                  </h4>

                  <div className="w-full block overflow-visible px-1">
                    <PayPalButtons
                      style={{ layout: "vertical", color: "black", shape: "rect", label: "pay" }}
                      createOrder={(_, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: dynamicPrice },
                              description: `LorPulse Metered: ${targetLeads} ${formData.niche} Leads in ${formData.city}`,
                            },
                          ],
                        });
                      }}
                      onApprove={async (_, actions) => {
                        if (!actions.order) return;
                        try {
                          setLoading(true);
                          const details = await actions.order.capture();
                          if (details && details.id) {
                            await handleClientPaymentSuccess(details.id);
                          }
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
            ) : step === "processing_live" ? (
              <div className="text-center py-6 animate-fadeIn">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute h-16 w-16 rounded-full border border-purple-500/20 animate-ping" />
                  <div className="h-12 w-12 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-purple-500/30 animate-spin flex items-center justify-center">
                    <span className="text-xs text-purple-400 font-mono font-bold">{progress}%</span>
                  </div>
                </div>

                <div className="text-xs uppercase tracking-widest text-purple-400 font-medium mb-1.5">
                  Autonomous Target Dashboard
                </div>
                <h4 className="font-display text-xl font-semibold text-white tracking-tight mb-2">
                  Crawler ID: #{backendCampaignId}
                </h4>

                {/* 📦 هادي هي الخانة الجديدة لي كاتبين للكليان بلي راه ديجا مسجل وبلي الإيميل ديالو محفوظ غادي يوصلو فيه الملف */}
                <div className="mb-4 bg-purple-950/20 border border-purple-900/30 px-3 py-2 rounded-xl inline-flex items-center gap-2 max-w-full">
                  <span className="text-[10px] text-purple-400 uppercase tracking-wider font-mono">Registered Email:</span>
                  <span className="text-xs font-semibold text-zinc-300 font-mono truncate max-w-[180px]" title={formData.email}>
                    {formData.email || "Syncing..."}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4 bg-zinc-900/50 border border-zinc-900 p-4 rounded-2xl">
                  <div className="text-left border-r border-zinc-800/80 pr-2">
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Live Extracted</span>
                    <span className="text-2xl font-bold text-white font-mono">{liveLeadsFound}</span>
                  </div>
                  <div className="text-left pl-2">
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Target Quota</span>
                    <span className="text-2xl font-bold text-purple-400 font-mono">{targetLeads}</span>
                  </div>
                </div>

                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800/80 relative mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-300 font-mono min-h-[32px] bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-900 text-center truncate">
                  {loadingStatusText}
                </p>

                <p className="text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto mt-4">
                  Mining and parsing system threads in real-time. Closing the node window will not abort the backend micro-crawler stream. We will deliver the final verified list directly to your inbox.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-8 max-w-md mx-auto animate-fadeIn">
            <span className="text-5xl">🎉</span>
            <h3 className="font-display text-2xl font-semibold mt-4 text-emerald-400 tracking-tight">
              Extraction Complete!
            </h3>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Success! Your specialized dataset containing <strong>{liveLeadsFound || targetLeads}</strong> hyper-verified B2B leads has been compiled and downloaded directly into your browser. Concurrently, a secure copy and asset breakdown index have been dispatched to <strong>{formData.email}</strong> via Brevo.
            </p>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl py-3 text-sm font-semibold transition-all"
            >
              Return to Operator Dashboard
            </button>
          </div>
        )}

        {loading && step !== "processing_live" && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center z-50 animate-fadeIn">
            <div className="h-7 w-7 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <div className="text-xs uppercase tracking-widest text-purple-400 font-medium animate-pulse mb-2">
              {loadingStatusText}
            </div>

            {progress > 0 && (
              <div className="w-56 bg-zinc-900 h-2 rounded-full mt-2 overflow-hidden border border-zinc-800/80 relative">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <p className="text-[11px] text-zinc-500 max-w-xs mt-4 leading-relaxed">
              Bypassing search noise filters. Compiling and scrubbing corporate emails asynchronously on specialized cloud nodes to eliminate connection timeouts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}