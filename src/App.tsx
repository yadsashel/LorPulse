import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 زدنا useNavigate هنا
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { RequirementsModal } from "@/components/RequirementsModal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import logo from "@/assets/lorpulse-logo.png";

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function App() {
  const [modal, setModal] = useState<null | "core">(null); // 👈 حيدنا horizon من الـ state
  const [y, setY] = useState(0);
  const navigate = useNavigate(); // 👈 هوك ديال النافيغاسيون ديريكت

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId || "", components: "buttons" }}>
      <SiteShell>
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
                Autonomous B2B Lead Intelligence
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
                Dominate B2B Acquisition,
                <br />
                <span className="bg-gradient-to-r from-[oklch(0.88_0.16_300)] via-[oklch(0.72_0.22_295)] to-[oklch(0.55_0.24_310)] bg-clip-text text-transparent text-glow">
                  Autonomously.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
                The specialized AI leads pipeline that outperforms the noise. Niche-targeted, intent-driven, hand-enriched datasets delivered straight to your inbox — built for operators who close.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a href="#pricing" className="halo-btn rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15">
                  Launch the Pipeline
                </a>
                <a href="#features" className="halo-btn rounded-xl px-6 py-3 text-sm font-medium glass">
                  See Capabilities →
                </a>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["98.4%", "Email deliverability"],
                  ["12k+", "Niches mapped"],
                  ["500", "Leads per batch"],
                  ["<24h", "Dataset turnaround"],
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

        <section id="features" className="px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">Why LorPulse</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">A pipeline, not a list.</h2>
                <p className="mt-4 text-muted-foreground">Every record is intent-scored, role-validated, and enriched with the context your sequences actually need.</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <Reveal className="col-span-12 md:col-span-7" delay={0}>
                <FeatureCard tag="Intent-Driven" title="Buyers ready in the next 30 days" body="Surface accounts triggering hiring spikes, funding signals, vendor switches, and product launches — scored 0–100 by our intent model." stat="500 Verified Tech Leads · San Francisco" tall />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-5" delay={60}>
                <FeatureCard tag="Niche-Specific Scraping" title="Hand-mapped industry corridors" body="From Series-B AI infra to Dubai luxury brokers — we maintain dedicated scrapers per vertical." stat="Weekly Dubai Real Estate Data Feed" />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-4" delay={120}>
                <FeatureCard tag="Automated Enrichment" title="14 data points per contact" body="Tech stack, headcount, recent posts, decision-maker hierarchy — all pre-joined." stat="14 enrichment vectors / record" />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-4" delay={160}>
                <FeatureCard tag="Verified Emails" title="SMTP + catch-all filtering" body="Triple-validated deliverability under 2% bounce." stat="98.4% deliverability rate" />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-4" delay={200}>
                <FeatureCard tag="AI Personalization Loop" title="{First_Name} that actually lands" body="Drop a template, we render contextual openers per contact, ready for your sender." stat="Avg. 4.2× reply lift" />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="pricing" className="px-5 py-24 relative">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">Pricing</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Two ways to ignite the pipeline.</h2>
                <p className="mt-4 text-muted-foreground">Specialized datasets on demand, or custom autonomous engineering.</p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-5">
              <Reveal>
                <PricingCard 
                  badge="Pulse Core" 
                  price="$7" 
                  cadence="one-time" 
                  headline="500 Verified Leads, Guaranteed." 
                  subtitle="Target any niche across any country or region worldwide. No empty files, zero dead rows." 
                  features={[
                    "Exactly 500 Verified B2B Emails",
                    "Target Any Niche + Country/Region",
                    "Smart Auto-Fill Guarantee (AI Expansion)",
                    "Live Scraped & Cleaned (No Placeholders)",
                    "Instant Browser CSV Download"
                  ]} 
                  ctaLabel="HUNT FOR $7" 
                  onClick={() => setModal("core")} 
                />
              </Reveal>
              <Reveal delay={100}>
                <PricingCard 
                  featured 
                  badge="Custom Automation" 
                  price="Custom" 
                  cadence="Quotes" 
                  headline="Build Custom AI & Systems." 
                  subtitle="SaaS, dashboards, scraping bots, autonomous agents, and tailor-made workflows built for your business needs." 
                  features={[
                    "Custom AI Agents & Chatbots Development",
                    "Full-Stack SaaS platforms & Dashboards",
                    "Advanced Custom Web Scraping Workflows",
                    "Tailored exactly to your business logic",
                    "Dedicated elite development & architecture support"
                  ]} 
                  ctaLabel="BUILD YOUR PIPELINE" 
                  onClick={() => navigate("/contact")} // 👈 كيدي ديريكت لصفحة الكونطاكط بلا تضيع الوقت
                />
              </Reveal>
            </div>

            <Reveal delay={200}>
              <p className="text-center text-xs text-muted-foreground mt-8">Every pipeline request inside Core initiates a dynamic async execution block.</p>
            </Reveal>
          </div>
        </section>

        <section className="px-5 py-24">
          <Reveal>
            <div className="mx-auto max-w-5xl glass-strong halo rounded-3xl px-8 py-14 text-center relative overflow-hidden">
              <div className="absolute -inset-px rounded-3xl pointer-events-none bg-[radial-gradient(600px_200px_at_50%_-20%,rgba(168,120,255,0.35),transparent)]" />
              <h3 className="font-display text-3xl sm:text-4xl font-semibold">Ready to outpace the noise?</h3>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Tell us your niche or your automation bottleneck. We'll deploy your solution immediately.</p>
              <div className="mt-7 flex justify-center gap-3 flex-wrap">
                {/* 👇 هادي حتى هي رجعناها كتلوح للكونطاكط ديريكت */}
                <Link to="/contact" className="halo-btn rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15">
                  Build Custom Automation
                </Link>
                <Link to="/contact" className="halo-btn rounded-xl px-6 py-3 text-sm font-medium glass">Custom Requirements →</Link>
              </div>
            </div>
          </Reveal>
        </section>

        {modal === "core" && <RequirementsModal plan="core" onClose={() => setModal(null)} />}
      </SiteShell>
    </PayPalScriptProvider>
  );
}

function FeatureCard({ tag, title, body, stat, tall = false }: { tag: string; title: string; body: string; stat: string; tall?: boolean }) {
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

function PricingCard({ badge, price, cadence, headline, subtitle, features, ctaLabel, onClick, featured }: { badge: string; price: string; cadence: string; headline: string; subtitle: string; features: string[]; ctaLabel: string; onClick: () => void; featured?: boolean }) {
  return (
    <div className={`relative rounded-3xl p-8 halo h-full flex flex-col ${featured ? "glass-strong border-[oklch(0.55_0.24_305)]/40" : "glass"}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] uppercase bg-gradient-to-r from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15">
          High Ticket Tier
        </div>
      )}
      <div className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">{badge}</div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-5xl font-semibold text-glow">{price}</span>
        <span className="text-sm text-muted-foreground">{cadence}</span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold">{headline}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.78_0.18_300)] shadow-[0_0_10px_rgba(168,120,255,0.8)]" />
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <button onClick={onClick} className={`mt-8 halo-btn rounded-xl py-3.5 text-sm font-semibold tracking-wide border ${featured ? "bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border-white/20" : "bg-white/5 border-white/10"}`}>
        {ctaLabel}
      </button>
    </div>
  );
}