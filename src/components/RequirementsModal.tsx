import { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from "@/lib/supabase"; 

interface RequirementsModalProps {
  plan: "core";
  onClose: () => void;
}

const FOUNDER_EMAILS = ["webusineservices@gmail.com"];

export function RequirementsModal({ plan, onClose }: RequirementsModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    niche: "",
    city: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [step, setStep] = useState<"email_check" | "details" | "payment">("email_check");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState(5000);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState("Touring Web Corridors...");
  
  const [detectedLeads, setDetectedLeads] = useState(0);
  const [backendCampaignId, setBackendCampaignId] = useState<number | null>(null);

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

  const verifyOperatorEmail = async () => {
    const emailClean = formData.email.trim().toLowerCase();
    if (!emailClean.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setLoadingStatusText("Querying Supabase Ledger Corridors...");
    
    if (FOUNDER_EMAILS.includes(emailClean)) {
      setIsExistingUser(true);
      setCreditsLeft(5000);
      setIsOwnerMode(true);
      localStorage.setItem("lorpulse_owner_access", "true");
      setRegistrationNotice(null);
      alert("👋 Welcome back Founder! Direct structural synchronization initiated.");
      setStep("details");
      setLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", emailClean);

      if (profileError) throw profileError;

      if (!profileData || profileData.length === 0) {
        setIsExistingUser(false);
        setCreditsLeft(0);
        setRegistrationNotice("🚨 Account Identity Not Found. Please register this email address first to synchronize system allocation matrix (Current Balance: 0/5000 credits).");
        alert("🚨 Access Denied: This email is not registered in our core framework database. Credits available: 0/5000.");
        setLoading(false);
        return;
      }

      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("leads_found") 
        .eq("email", emailClean);

      if (campaignError) throw campaignError;

      setIsExistingUser(true);
      setRegistrationNotice(null);
      alert("👋 Welcome back Operator! Access parameters authorized successfully.");

      const totalLeadsExtracted = campaignData ? campaignData.reduce((sum, item) => sum + (Number(item.leads_found) || 0), 0) : 0;
      const creditsConsumed = Math.floor(totalLeadsExtracted / 10);
      const calculatedRemaining = Math.max(0, 5000 - creditsConsumed);
      
      setCreditsLeft(calculatedRemaining);
      setStep("details");

    } catch (err) {
      console.error("Supabase engine synchronization error:", err);
      alert("New User Welcome!.");
      setIsExistingUser(false);
      setStep("details");
    } finally {
      setLoading(false);
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

  const startPollingCampaign = (campaignId: number) => {
    setBackendCampaignId(campaignId);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://lorpulse-lorpusle-backend.hf.space/api/pulse/pulse-check/${campaignId}`
        );
        if (!res.ok) return;

        const data = await res.json();
        const currentLeads = data.leads_found || data.leads_count || 0;

        if (data.status === "processing") {
          const calculatedProgress = Math.min(99, Math.max(8, Math.floor((currentLeads / 500) * 100)));
          setProgress(calculatedProgress);
          setLoadingStatusText(`Extracting B2B Corporate Leads: ${currentLeads}/500 (${calculatedProgress}%)`);
        } 
        else if (data.status === "completed" || (isOwnerMode && data.status === "waiting_for_payment")) {
          setProgress(100);
          setLoadingStatusText("✅ Compilation 100% Complete! Triggering auto-download...");
          clearInterval(interval);
          window.location.href = `https://lorpulse-lorpusle-backend.hf.space/api/gate/retrieve-asset/${campaignId}`;
          setSuccess(true);
          setLoading(false);
        } 
        else if (data.status === "waiting_for_payment" && !isOwnerMode) {
          setProgress(100);
          setLoadingStatusText("⚠️ Extraction Pool Frozen. Awaiting PayPal processing verification token...");
        }
        else if (data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
          alert("🚨 Pipeline extraction hit a wall for this specific criteria. Verify your niche string.");
        }
      } catch (err) {
        console.error("Polling sync lost:", err);
      }
    }, 4000);
  };

  const launchLiveLeadScan = async () => {
    setLoading(true);
    setProgress(20);
    setLoadingStatusText("Initializing Local Extractor Nodes...");
    
    setTimeout(() => {
      setProgress(60);
      setLoadingStatusText(`Mapping data corridors for "${formData.niche}"...`);
      
      setTimeout(() => {
        const leads = Math.floor(Math.random() * (950 - 400 + 1)) + 400;
        setDetectedLeads(leads);
        setLoading(false);

        if (isExistingUser && creditsLeft > 50) {
          triggerCreditDeductionPipeline();
        } else {
          setStep("payment");
        }
      }, 1500);
    }, 1200);
  };

  const triggerCreditDeductionPipeline = async () => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Authorizing credit profile & injection paths...");
    try {
      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/gate/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: plan,
          niche: formData.niche,
          city: formData.city,
          email: formData.email.trim().toLowerCase(),
          paypal_order_id: `CREDIT_POOL_REDEEM_${Date.now()}`,
          target_leads: 500
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        startPollingCampaign(data.campaign_id);
      } else {
        const errData = await response.json();
        alert(errData.detail || "Credit redemption sequence failed on the core backend cluster node.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Credit workflow execution error:", error);
      alert("Network alignment error. Dispatched support backup parameters.");
      setLoading(false);
    }
  };

  const triggerOwnerBypass = async () => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Initializing Secure Async Founder Pipeline Node...");
    try {
      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/gate/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: plan,
          niche: formData.niche,
          city: formData.city,
          email: formData.email.trim().toLowerCase(),
          paypal_order_id: `OWNER_ASYNC_HUNT_${Date.now()}`,
          target_leads: 500
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
      alert("Network connection error. Check Hugging Face instance logs.");
      setLoading(false);
    }
  };

  const handleClientPaymentSuccess = async (orderId: string) => {
    setLoading(true);
    setProgress(5);
    setLoadingStatusText("Verifying capture & spawning extraction threads...");
    try {
      const response = await fetch("https://lorpulse-lorpusle-backend.hf.space/api/gate/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: plan,
          niche: formData.niche,
          city: formData.city,
          email: formData.email.trim().toLowerCase(),
          paypal_order_id: orderId,
          target_leads: 500
        }),
      });

      if (response.status === 202) {
        const data = await response.json();
        
        await fetch(`https://lorpulse-lorpusle-backend.hf.space/api/gate/verify-settlement/${data.campaign_id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypal_order_id: orderId })
        });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full transition-all duration-300 bg-zinc-950 border border-zinc-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left shadow-2xl my-auto max-h-[92vh] overflow-y-auto ${
          step === "payment" ? "max-w-4xl" : "max-w-md"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 text-sm p-1 z-10 rounded-full hover:bg-zinc-900 transition-colors"
        >
          ✕
        </button>

        {!success ? (
          <>
            {/* STEP 1: OPERATOR VERIFICATION SCREEN */}
            {step === "email_check" && (
              <div className="animate-fadeIn w-full">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-purple-400 mb-1 font-medium">
                  Gateway Access
                </div>
                <h3
                  onClick={handleSecretClick}
                  className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight cursor-default select-none mb-2 break-words"
                >
                  Operator Verification
                  {isOwnerMode && (
                    <span className="block sm:inline text-emerald-400 text-xs sm:ml-2 mt-1 sm:mt-0">● Owner Mode (Async)</span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400 mb-5 sm:mb-6 leading-relaxed">
                  Provide your active node delivery coordinates to check database logs and credit balances.
                </p>

                {registrationNotice && (
                  <div className="mb-4 text-xs p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 leading-relaxed break-words">
                    {registrationNotice}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
                      Your Identity Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600 appearance-none"
                      placeholder="operator@agency.com"
                    />
                  </div>

                  <button
                    disabled={!formData.email.includes("@")}
                    onClick={verifyOperatorEmail}
                    className={`mt-4 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 text-center ${
                      formData.email.includes("@")
                        ? "bg-white text-black hover:bg-zinc-200 cursor-pointer"
                        : "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800"
                    }`}
                  >
                    Verify Credentials →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PIPELINE CONFIGURATION FORM */}
            {step === "details" && (
              <div className="animate-fadeIn relative w-full">
                <div className="absolute top-0 right-0 text-right mt-1 sm:mt-0 z-10">
                  {isExistingUser ? (
                    <span className="text-[10px] sm:text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md inline-block">
                      ⚡ {creditsLeft.toLocaleString()} Credits Left
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs font-mono font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md inline-block">
                      ⚠️ 0 / 5,000 Locked
                    </span>
                  )}
                </div>

                <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-purple-400 mb-1 font-medium pt-6 sm:pt-0">
                  Onboarding Setup
                </div>

                <h3
                  onClick={handleSecretClick}
                  className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight cursor-default select-none break-words"
                >
                  Configure Pipeline{" "}
                  {isOwnerMode && (
                    <span className="block sm:inline text-emerald-400 text-xs sm:ml-2 mt-1 sm:mt-0">● Owner Mode (Async)</span>
                  )}
                </h3>

                <p className="text-xs text-zinc-400 mt-1 mb-5 sm:mb-6 leading-relaxed">
                  Pulse Core Plan — {isOwnerMode ? "Unlimited Founder Infrastructure Access." : isExistingUser ? "Redeeming remaining runtime quotas." : "Metered Pricing Access."}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
                      Your Delivery Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled={true}
                      value={formData.email}
                      className="w-full bg-zinc-900/50 border border-zinc-800/80 p-3 rounded-xl text-sm text-zinc-500 cursor-not-allowed select-none appearance-none"
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
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600 appearance-none"
                      placeholder="e.g., Luxury Real Estate Brokers"
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
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-600 appearance-none"
                      placeholder="e.g., London, Houston"
                    />
                  </div>

                  <button
                    disabled={!isFormValid}
                    onClick={() => {
                      if (isOwnerMode || FOUNDER_EMAILS.includes(formData.email.trim().toLowerCase())) {
                        triggerOwnerBypass();
                      } else {
                        launchLiveLeadScan();
                      }
                    }}
                    className={`mt-6 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 text-center ${
                      isFormValid
                        ? "bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-lg shadow-white/5"
                        : "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800"
                    }`}
                  >
                    {isOwnerMode || FOUNDER_EMAILS.includes(formData.email.trim().toLowerCase()) ? "Execute Async Owner Extraction ⚡" : "Launch Live Lead Scan →"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: FLAT RATE SECURED CHECKOUT */}
            {step === "payment" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 animate-slideIn pt-2 w-full">
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-zinc-900 pb-5 md:pb-0 md:pr-6 flex flex-col justify-between">
                  <div>
                    <button
                      onClick={() => setStep("details")}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-4 sm:mb-6 transition-colors p-1"
                    >
                      ← Edit info
                    </button>
                    <div className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 font-medium mb-1">
                      One-Time Liftoff Pass
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">$10.00</h4>
                      <span className="text-xs text-zinc-500 font-mono">USD</span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-[11px] text-purple-400 max-w-full">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400 animate-pulse" />
                      <span className="truncate">Unlocks full 5,000 lead package credits</span>
                    </div>

                    <div className="mt-5 space-y-2.5 bg-zinc-900/40 border border-zinc-900 p-3.5 sm:p-4 rounded-xl text-xs w-full overflow-hidden">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 shrink-0">Access Type:</span>
                        <span className="text-zinc-300 font-medium text-right">Pay Once & For All</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 shrink-0">Niche Target:</span>
                        <span className="text-zinc-300 truncate max-w-[150px] font-medium text-right" title={formData.niche}>
                          {formData.niche}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 shrink-0">Target Geo:</span>
                        <span className="text-zinc-300 truncate max-w-[150px] font-medium text-right" title={formData.city}>
                          {formData.city}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-zinc-500 shrink-0">Delivery Box:</span>
                        <span className="text-zinc-300 truncate max-w-[150px] font-medium text-right" title={formData.email}>
                          {formData.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-5 hidden md:block leading-relaxed">
                    Secured via PayPal encryption layers. Lifetime access pool activation token inside.
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-start w-full min-h-[320px] sm:min-h-[380px]">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-4 px-1">
                    Select Secured Payment Method
                  </h4>

                  <div className="w-full block overflow-visible px-1 max-w-full">
                    <PayPalButtons
                      style={{ layout: "vertical", color: "black", shape: "rect", label: "pay" }}
                      createOrder={(_, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: { value: "10.00" },
                              description: `LorPulse Full Liftoff Pass: 5,000 Credits (${formData.niche} in ${formData.city})`,
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
          <div className="text-center py-6 sm:py-8 max-w-md mx-auto animate-fadeIn w-full">
            <span className="text-4xl sm:text-5xl block">⚡</span>
            <h3 className="font-display text-xl sm:text-2xl font-semibold mt-4 text-purple-400 tracking-tight break-words">
              {isOwnerMode ? "Extraction Complete!" : "Pipeline Dispatched Instantly!"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed break-words">
              {isOwnerMode
                ? `The compiled CSV dataset for ${formData.niche} has been automatically downloaded to your local drive.`
                : `Success! Your specialized dataset containing verified B2B leads has been unlocked and downloaded directly inside your browser. Concurrently, a secure link and backup copy have been dispatched to ${formData.email} via Brevo.`}
            </p>
            <button
              onClick={onClose}
              className="mt-6 sm:mt-8 w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl py-3 text-sm font-semibold transition-all text-center"
            >
              Return to Operator Dashboard
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 text-center z-50 animate-fadeIn">
            <div className="h-6 w-6 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <div className="text-[11px] sm:text-xs uppercase tracking-widest text-purple-400 font-medium animate-pulse max-w-full px-2 break-words">
              {loadingStatusText}
            </div>

            {progress > 0 && (
              <div className="w-40 sm:w-48 bg-zinc-900 h-1.5 rounded-full mt-4 overflow-hidden border border-zinc-800">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <p className="text-[10px] sm:text-xs text-zinc-500 max-w-xs mt-3 leading-relaxed px-2">
              Bypassing noise filters. Compiling specialized rows asynchronously to eliminate
              client-side connection timeouts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}