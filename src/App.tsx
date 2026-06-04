import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import logo from "@/assets/lorpulse-logo.png";

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const BACKEND_URL = "http://127.0.0.1:8000";

export default function App() {
  const [modal, setModal] = useState<null | "core">(null);
  const [y, setY] = useState(0);
  const navigate = useNavigate();

  // ─── CREDIT SYSTEM STATES ─────────────────────────────────
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [creditsLeft, setCreditsLeft] = useState(0);
  
  // ─── ENGINE SCAN STATES ───────────────────────────────────
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [leadsFound, setLeadsFound] = useState(0);
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // 🛠️ 1. تحقق من إيميل المستخدم والـ Credits دياولو ف الداتا بيز
  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/credits?email=${encodeURIComponent(authEmail.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setCreditsLeft(data.credits_left);
        setVerifiedEmail(authEmail.trim());
      } else {
        // حساب جديد بـ 5,000 credit تلقائية بعد الدفع الأول
        setCreditsLeft(5000);
        setVerifiedEmail(authEmail.trim());
      }
      setShowSyncModal(false);
      setModal("core"); // فتح لوحة التحكم د الكراولر ديريكت مورا التاكيد
    } catch (err) {
      alert("🚨 Cannot link to the LorPulse core database layer. Ensure backend is active.");
    }
  };

  // ⚡ 2. إطلاق مصفوفة الكراولر (Launch Live Lead Scan)
  const handleLaunchScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creditsLeft <= 0) {
      alert("⚠️ Operational halt: Credit balance is empty. Top up your ledger package.");
      return;
    }

    setScanStatus("processing");
    setLeadsFound(0);

    try {
      const res = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_type: "Pulse Core Credits",
          niche: niche,
          city: city,
          email: verifiedEmail,
          target_leads: creditsLeft * 10 // تحويل الكريديت لعدد الـ Leads الأقصى (كل 1 كريديت بـ 10 حبات)
        }),
      });

      if (res.status === 202) {
        const data = await res.json();
        setCampaignId(data.campaign_id);
        startLivePolling(data.campaign_id);
      } else {
        setScanStatus("idle");
        alert("🚨 Extraction pipeline rejected by core engine routing.");
      }
    } catch (err) {
      setScanStatus("idle");
      alert("🚨 Connection failure with the asynchronous node runner.");
    }
  };

  // 📊 3. تتبع الـ Status والـ العداد لايف (Live Real-Time Polling)
  const startLivePolling = (id: number) => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/campaign/${id}/status`);
        if (res.ok) {
          const data = await res.json();
          setLeadsFound(data.leads_found);

          if (data.status === "waiting_for_payment" || data.status === "completed") {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setScanStatus("completed");
            
            // 📥 تحميل الـ CSV تلقائياً ف برواوزر د الكليان نيشان!
            window.location.href = `${BACKEND_URL}/api/campaign/${id}/download`;
            
            // خصم الكريديت ديريكت ف الـ UI (كل 10 داتا بـ 1 credit)
            const unitsBurned = Math.ceil(data.leads_found / 10);
            setCreditsLeft((prev) => Math.max(0, prev - unitsBurned));
          } else if (data.status === "failed") {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setScanStatus("idle");
            alert("Matrix complete: Zero records fetched for this specific target quadrant.");
          }
        }
      } catch (err) {
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    }, 3000);
  };

  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId || "", components: "buttons" }}>
      <SiteShell>

        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section className="relative px-5 pt-10 sm:pt-20 pb-32">
          <div className="mx-auto max-w-6xl text-center">
            <Reveal>
              <div
                className="mx-auto mb-8 h-24 w-24 sm:h-28 sm:w-28 will-change-transform"
                style={{ transform: `translateY(${y * 0.08}px) rotateX(${Math.min(y * 0.04, 18)}deg)` }}
              >
                <img src={logo} alt="LorPulse" className="h-full w-full animate-float drop-shadow-[0_0_60px_rgba(168,120,255,0.65)]" />
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" />
                B2B Intelligence · Custom AI Engineering
              </div>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
                We Build the Systems
                <br />
                <span className="bg-gradient-to-r from-[oklch(0.88_0.16_300)] via-[oklch(0.72_0.22_295)] to-[oklch(0.55_0.24_310)] bg-clip-text text-transparent text-glow">
                  That Close for You.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
                LorPulse is a B2B intelligence and automation engineering studio. We deliver niche-targeted lead datasets on demand — and we build the autonomous AI systems, scraping engines, and custom software that put your entire growth operation on autopilot.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a href="#pricing" className="halo-btn rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15">
                  See What We Deploy
                </a>
                <a href="#what-we-do" className="halo-btn rounded-xl px-6 py-3 text-sm font-medium glass">
                  How It Works →
                </a>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["98.4%", "Email deliverability"],
                  ["Asymmetric", "Credit Ledger Scan"], 
                  ["12k+", "Niches mapped"],
                  ["0/5000", "Initial Credit Allocations"], 
                ].map(([k, v]) => (
                  <div key={v} className="glass halo rounded-2xl px-5 py-5 text-left">
                    <div className="font-display text-2xl text-glow">{k}</div>
                    <div className="text-xs text-muted-foreground mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── WHAT WE DO ────────────────────────────────────────────── */}
        <section id="what-we-do" className="px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">What LorPulse Does</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Two engines. One mission.</h2>
                <p className="mt-4 text-muted-foreground">
                  Whether you need hyper-targeted B2B leads delivered today, or a fully custom AI system built around your business — LorPulse engineers it and ships it fast.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Reveal delay={0}>
                <div className="glass halo rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden min-h-[240px]">
                  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[oklch(0.50_0.25_300)] opacity-[0.15] blur-3xl" />
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.78_0.18_300)]">Engine 01 — Lead Intelligence</div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">Verified B2B leads.<br />Any niche, any country.</h3>
                  <p className="text-sm text-muted-foreground">Tell us your niche and country. Our pipeline scrapes, validates, enriches, and delivers decision-maker contacts in CSV — straight to your browser and inbox.</p>
                  <div className="mt-auto inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" />
                    Credit Managed · 1 Unit / 10 Verified Hits
                  </div>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="glass-strong halo rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden min-h-[240px] border-[oklch(0.55_0.24_305)]/30">
                  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[oklch(0.50_0.25_300)] opacity-[0.15] blur-3xl" />
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.78_0.18_300)]">Engine 02 — Custom AI Engineering</div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">Your automation stack,<br />built from scratch.</h3>
                  <p className="text-sm text-muted-foreground">SaaS platforms, autonomous AI agents, advanced scraping workflows, internal dashboards — we architect and ship production-grade systems tailored to your exact business logic.</p>
                  <div className="mt-auto inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" />
                    Custom scoped · Quote-based
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <Reveal className="col-span-12 md:col-span-7" delay={0}>
                <FeatureCard
                  tag="Intent-Driven Intelligence"
                  title="Buyers ready in the next 30 days"
                  body="Surface accounts triggering hiring spikes, funding signals, vendor switches, and product launches — scored 0–100 by our intent model."
                  stat="Asymmetric Global Credit Scan Framework Active"
                  tall
                />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-5" delay={60}>
                <FeatureCard
                  tag="Autonomous AI Agents"
                  title="Systems that work while you sleep"
                  body="We build multi-step AI agents that prospect, qualify, enrich, and route leads autonomously — no human bottleneck in the loop."
                  stat="Custom-engineered per business"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── PRICING ───────────────────────────────────────────────── */}
        <section id="pricing" className="px-5 py-24 relative">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">Deploy With Us</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Pick your mode of operation.</h2>
                <p className="mt-4 text-muted-foreground">
                  Need leads today? Launch the pipeline instantly using your token ledger balance. Need a full system built? Let's architect it together.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-5">
              <Reveal>
                <PricingCard
                  badge="Pulse Core — Lead Intelligence"
                  price="Credits" 
                  cadence="5,000 unit allocation"
                  headline="Execute Endless Deep Hunts."
                  subtitle="No rigid upfront per-batch limitations. Authenticate your vector email profile, spin up the multi-node crawler matrix, and extract clean business records directly against your master ledger."
                  features={[
                    "Unified Credit Balance Ledger (5,000 units initial)",
                    "Proportional metering: 1 token deducted per 10 verified leads discovered",
                    "Target any local city, industrial corridor, or global node",
                    "Universal AI Expansion Matrix automatically activated on shortfalls",
                    "Live crawled, deeply validated, and triple-filtered structure",
                    "Instant browser CSV injection unlock + secure email document delivery",
                  ]}
                  ctaLabel="LAUNCH LIVE LEAD SCAN"
                  onClick={() => {
                    if (verifiedEmail) setModal("core");
                    else setShowSyncModal(true);
                  }}
                />
              </Reveal>
              <Reveal delay={100}>
                <PricingCard
                  featured
                  badge="Custom AI & Automation Engineering"
                  price="Custom"
                  cadence="quoted per scope"
                  headline="We Build the System Around You."
                  subtitle="From autonomous agents to full SaaS products — we engineer exactly what your business needs to scale without hiring."
                  features={[
                    "Custom AI agents & multi-step automation flows",
                    "Full-stack SaaS platforms & internal dashboards",
                    "Advanced web scraping & data pipeline engineering",
                    "Business-logic-specific architecture & deployment",
                    "Dedicated senior dev support from scoping to ship",
                  ]}
                  ctaLabel="START YOUR BUILD"
                  onClick={() => navigate("/contact")}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── INTERACTIVE CREDIT ENGINE CONSOLE (MODAL OVERLAY) ─────── */}
        {modal === "core" && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden halo">
              
              {/* Top Credit Status Indicator */}
              <div className="absolute top-5 right-6 flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-indigo-300">
                  {Math.floor(leadsFound / 10)} / {creditsLeft} Credits Left
                </span>
              </div>

              {/* Console Branding Header */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-white tracking-wide">Onboarding Setup</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{verifiedEmail}</p>
              </div>

              {/* 🟢 MODE A: IDLE / FORM SUBMISSION */}
              {scanStatus === "idle" && (
                <form onSubmit={handleLaunchScan} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Target Niche / Industry Corridor</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Artificial Intelligence Startup" 
                      value={niche} 
                      onChange={(e) => setNiche(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Target City / Geo-Location</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. San Francisco" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition" 
                    />
                  </div>

                  {/* ⚠️ Dynamic Guardrail Disclaimer Text */}
                  <p className="text-[10px] text-amber-500/90 leading-relaxed bg-amber-950/30 border border-amber-900/40 rounded-xl p-3 mt-2">
                    ⚠️ <span className="font-bold">System Metric Warning:</span> Highly specific technical niches or locked geographic clusters may yield lower raw totals based on indexing transparency. Review your parameters carefully before deploying the query engine nodes.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition tracking-wider shadow-lg shadow-indigo-600/10">
                      Launch Live Lead Scan →
                    </button>
                    <button type="button" onClick={() => setModal(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 rounded-xl transition">
                      Close
                    </button>
                  </div>
                </form>
              )}

              {/* ⏳ MODE B: THE CORRECT, POLISHED PROCESSING/WAITING STACK */}
              {scanStatus === "processing" && (
                <div className="py-8 flex flex-col items-center justify-center space-y-5 animate-pulseFast">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-bold text-white tracking-wider">Executing Async Owner Extraction...</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Querying data layers and stripping verified emails...</p>
                  </div>
                  
                  {/* Real-time Dynamic Counters */}
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-center font-mono">
                    <span className="text-3xl font-black text-emerald-400 tracking-tight">{leadsFound}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mt-1">Verified B2B Leads Parsed</span>
                  </div>
                </div>
              )}

              {/* 🎉 MODE C: EXTRACTION OPERATION COMPLETE */}
              {scanStatus === "completed" && (
                <div className="py-6 text-center space-y-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-lg font-bold">✓</div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">Operation Asset Executed Successfully!</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Extracted <span className="text-emerald-400 font-bold font-mono">{leadsFound}</span> verified rows. Check your operating system downloads directory and email routing records.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setScanStatus("idle")} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition">
                      Run Next Sector Scan
                    </button>
                    <button onClick={() => setModal(null)} className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium px-4 rounded-xl transition">
                      Exit Console
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 🔐 ID PROMPT POPUP: Already Existing Operator Check? */}
        {showSyncModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative halo">
              <h3 className="text-sm font-bold text-white tracking-wide">Already Exist Profile?</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Input your registered deployment email to sync your secure credit balance directly into this session layer.</p>
              <form onSubmit={handleVerifyIdentity} className="space-y-3">
                <input 
                  type="email" 
                  required 
                  placeholder="operator@company.com" 
                  value={authEmail} 
                  onChange={(e) => setAuthEmail(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition" 
                />
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition tracking-wide">Sync Balance Profile</button>
                  <button type="button" onClick={() => { setVerifiedEmail(`guest_${Date.now()}@lorpulse.internal`); setCreditsLeft(5000); setShowSyncModal(false); setModal("core"); }} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 rounded-lg transition">New Instance</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </SiteShell>
    </PayPalScriptProvider>
  );
}

function FeatureCard({ tag, title, body, stat, tall = false }: {
  tag: string; title: string; body: string; stat: string; tall?: boolean;
}) {
  return (
    <div className={`glass halo rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between ${tall ? "min-h-[280px]" : "min-h-[220px]"} relative overflow-hidden`}>
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[oklch(0.50_0.25_300)] opacity-[0.18] blur-3xl" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.78_0.18_300)]">{tag}</div>
        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-semibold leading-tight">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground max-w-md">{body}</p>
      </div>
      <div className="mt-6 inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" />
        {stat}
      </div>
    </div>
  );
}

function PricingCard({ badge, price, cadence, headline, subtitle, features, ctaLabel, onClick, featured }: {
  badge: string; price: string; cadence: string; headline: string; subtitle: string;
  features: string[]; ctaLabel: string; onClick: () => void; featured?: boolean;
}) {
  return (
    <div className={`relative rounded-3xl p-8 halo h-full flex flex-col ${featured ? "glass-strong border-[oklch(0.55_0.24_305)]/40" : "glass"}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase bg-gradient-to-r from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15 whitespace-nowrap">
          Custom Engineering Tier
        </div>
      )}
      <div className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">{badge}</div>
      <div className="mt-4 flex items-baseline gap-1.5 flex-wrap">
        <span className="font-display text-5xl font-semibold text-glow tracking-tight">{price}</span>
        <span className="text-sm text-muted-foreground font-medium bg-white/5 px-2.5 py-1 rounded-md border border-white/5">{cadence}</span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold">{headline}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <ul className="mt-6 space-y-3 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.78_0.18_300)] shadow-[0_0_10px_rgba(168,120,255,0.8)]" />
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`mt-8 halo-btn rounded-xl py-3.5 text-sm font-semibold tracking-wide border transition-all ${featured ? "bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border-white/20 hover:opacity-90" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}