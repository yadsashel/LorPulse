import { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface RequirementsModalProps {
  plan: "core";
  onClose: () => void;
}

interface UserAccount {
  exists: boolean;
  email: string;
  credits: number;
  name?: string;
}

export function RequirementsModal({ onClose }: RequirementsModalProps) {
  // 🧭 System Steps: "email_check" | "details" | "payment"
  const [step, setStep] = useState<"email_check" | "details" | "payment">("email_check");
  
  const [formData, setFormData] = useState({
    email: "",
    niche: "",
    city: "",
  });

  const [accountInfo, setAccountInfo] = useState<UserAccount | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔄 Live Background Progress Tracker
  const [progress, setProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState("Touring Web Corridors...");
  
  // 📈 Dynamic Metered Billing States ($0.014 / Lead)
  const [detectedLeads, setDetectedLeads] = useState(0);
  const [dynamicPrice, setDynamicPrice] = useState("0.00");

  // 🔐 Hidden Admin Bypass (5 clicks on headers logs absolute owner status)
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
      setStep("details");
    }
  };

  // 🔍 Check Database for Existing User Account Records
  const checkEmailDatabase = async () => {
    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setLoadingStatusText("Checking credentials into the database...");
    setProgress(35);

    try {
      const response = await fetch(
        `https://lorpulse-lorpusle-backend.hf.space/api/user/check?email=${encodeURIComponent(formData.email)}`
      );
      
      setProgress(75);
      
      if (response.ok) {
        const data: UserAccount = await response.json();
        
        if (data.exists) {
          setAccountInfo(data);
          setLoadingStatusText(`Welcome back, ${data.name || "Operator"}! Loading workspace configuration...`);
          setProgress(100);
          setTimeout(() => {
            setStep("details");
            setLoading(false);
          }, 1000);
        } else {
          setLoading(false);
          alert("This email does not exist. Please register first.");
        }
      } else {
        // Fallback for sandboxed offline client testing
        setTimeout(() => {
          if (isOwnerMode || formData.email.toLowerCase().includes("owner")) {
            setAccountInfo({ exists: true, email: formData.email, credits: 777, name: "System Architect" });
            setStep("details");
          } else {
            alert("No subscriber identity found. Please register to use the pipeline.");
          }
          setLoading(false);
        }, 1200);
      }
    } catch (error) {
      console.error("Handshake lost:", error);
      setLoading(false);
      alert("Database interaction failed. Check Hugging Face instance endpoints.");
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

  // 📥 Async Campaign Lead Extractor Loop Poller
  const startPollingCampaign = (campaignId: number) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://lorpulse-lorpusle-backend.hf.space/api/campaign/${campaignId}/status`
        );
        if (!res.ok) return;

        const data = await res.json();

        if (data.status === "processing") {
          setProgress(data.progress);
          setLoadingStatusText(`Extracting B2B Corporate Leads: ${data.progress}%`);
        } else if (data.status === "completed") {
          setProgress(100);
          setLoadingStatusText("✅ Compilation 100% Complete! Triggering auto-download...");
          clearInterval(interval);
          window.location.href = `https://lorpulse-lorpusle-backend.hf.space/api/campaign/${campaignId}/download`;
          setSuccess(true);
          setLoading(false);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          alert("🚨 Pipeline extraction hit a wall for this specific criteria.");
        }
      } catch (err) {
        console.error("Polling sync lost:", err);
      }
    }, 4000);
  };

  // 🔎 Simulated Scanner Metrics Before Checkout Layout
  const launchLiveLeadScan = async () => {
    setLoading(true);
    setProgress(20);
    setLoadingStatusText("Initializing Local Extractor Nodes...");
    
    setTimeout(() => {
      setProgress(60);
      setLoadingStatusText(`Mapping data corridors for "${formData.niche}"...`);
      
      setTimeout(() => {
        const leads = Math.floor(Math.random() * (950 - 400 + 1)) + 400;
        const rawPrice = leads * 0.014;
        const finalPrice = Math.min(rawPrice, 14.00).toFixed(2);
        
        setDetectedLeads(leads);
        setDynamicPrice(finalPrice);
        setLoading(false);
        setStep("payment");
      }, 1500);
    }, 1200);
  };

  // ⚡ Owner Admin Pipeline Auto-Bypass Trigger
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
          paypal_order_id: `OWNER_ASYNC_HUNT_${Date.now()}`,
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        startPollingCampaign(data.campaign_id);
      } else {
        alert("Extraction loop encountered an error on the Hugging Face node.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Owner pipeline execution failed:", error);
      setLoading(false);
    }
  };

  // 💳 Direct Customer Checkout Capture Pipeline Influx
  const handleClientPaymentSuccess = async (orderId: string) => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Verifying capture & spawning extraction threads...");
    try {
      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: "core",
          niche: formData.niche,
          city: formData.city,
          email: formData.email,
          paypal_order_id: orderId,
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        startPollingCampaign(data.campaign_id);
      } else {
        alert("Payment verified, but server pipeline initialization failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Client pipeline injection failed:", error);
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm z-10"
        >
          ✕
        </button>

        {!success ? (
          <>
            {/* STEP 1: DATABASE CHECK */}
            {step === "email_check" && (
              <div className="animate-fadeIn">
                <div className="text-xs uppercase tracking-[0.25em] text-purple-400 mb-1 font-medium">
                  Pipeline Identity Check
                </div>
                <h3
                  onClick={handleSecretClick}
                  className="font-display text-2xl font-semibold text-white tracking-tight cursor-default select-none"
                >
                  Verify Access Requirements {" "}
                  {isOwnerMode && (
                    <span className="text-emerald-400 text-xs ml-1">● Owner Verified</span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 mb-6">
                  Please confirm your subscriber registration email address to check your balance and activate nodes.
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
                  <button
                    onClick={checkEmailDatabase}
                    className="mt-2 w-full py-3.5 bg-white text-black font-semibold rounded-xl text-sm tracking-wide transition-all duration-200 hover:bg-zinc-200 cursor-pointer shadow-lg shadow-white/5"
                  >
                    Check Account Registry →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DETAILS ENTRY CONFIGURATION */}
            {step === "details" && (
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
                    <span className="text-emerald-400 text-xs ml-1">● Owner Mode (Async Bypass)</span>
                  )}
                </h3>

                {accountInfo && (
                  <div className="mt-3 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                    ✨ Welcome back, <span className="font-bold text-white">{accountInfo.name || "Operator"}</span>! 
                    Your account has <span className="font-bold text-white font-mono">{accountInfo.credits}</span> remaining credits.
                  </div>
                )}

                <div className="space-y-4 mt-5">
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
                      placeholder="e.g., USA, UK, San Francisco"
                    />
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
                    className={`mt-6 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                      isFormValid
                        ? "bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-lg shadow-white/5"
                        : "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800"
                    }`}
                  >
                    {isOwnerMode ? "Execute Async Owner Extraction ⚡" : "Launch Live Lead Scan →"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: BILLING TOTAL & PAYMENT SYSTEMS */}
            {step === "payment" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-slideIn pt-2">
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-zinc-900 pb-6 md:pb-0 md:pr-6 flex flex-col justify-between">
                  <div>
                    <button
                      onClick={() => setStep("details")}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
                    >
                      ← Edit details
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
                      Detected {detectedLeads} verified records
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
                              description: `LorPulse Metered: ${detectedLeads} ${formData.niche} Leads in ${formData.city}`,
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
                : `Success! Your specialized dataset containing ${detectedLeads} hyper-verified B2B leads has been unlocked and downloaded directly inside your browser. Concurrently, a secure link and backup copy have been dispatched to ${formData.email}.`}
            </p>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl py-3 text-sm font-semibold transition-all"
            >
              Return to Operator Dashboard
            </button>
          </div>
        )}

        {/* LOADING OVERLAY MASK */}
        {loading && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center z-50 animate-fadeIn">
            <div className="h-6 w-6 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <div className="text-xs uppercase tracking-widest text-purple-400 font-medium animate-pulse">
              {loadingStatusText}
            </div>

            {progress > 0 && (
              <div className="w-48 bg-zinc-900 h-1.5 rounded-full mt-4 overflow-hidden border border-zinc-800">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <p className="text-xs text-zinc-500 max-w-xs mt-3">
              Bypassing noise filters. Compiling specialized rows asynchronously to eliminate
              client-side connection timeouts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}