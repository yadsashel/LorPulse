import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { RequirementsModal } from "@/components/RequirementsModal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import logo from "@/assets/lorpulse-logo.png";

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function App() {
  const [modal, setModal] = useState<null | "core">(null);
  const [y, setY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                  ["500+", "Leads per batch"],
                  ["12k+", "Niches mapped"],
                  ["<24h", "Deployment turnaround"],
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

            {/* Two-pillar overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Reveal delay={0}>
                <div className="glass halo rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden min-h-[240px]">
                  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[oklch(0.50_0.25_300)] opacity-[0.15] blur-3xl" />
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.78_0.18_300)]">Engine 01 — Lead Intelligence</div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">Verified B2B leads.<br />Any niche, any country.</h3>
                  <p className="text-sm text-muted-foreground">Tell us your niche and country. Our pipeline scrapes, validates, enriches, and delivers 500 decision-maker contacts in CSV — straight to your browser and inbox.</p>
                  <div className="mt-auto inline-flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" />
                    One-time · $10 · Instant delivery
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

            {/* Feature grid */}
            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <Reveal className="col-span-12 md:col-span-7" delay={0}>
                <FeatureCard
                  tag="Intent-Driven Intelligence"
                  title="Buyers ready in the next 30 days"
                  body="Surface accounts triggering hiring spikes, funding signals, vendor switches, and product launches — scored 0–100 by our intent model."
                  stat="500 Verified Tech Leads · San Francisco"
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
              <Reveal className="col-span-12 md:col-span-4" delay={120}>
                <FeatureCard
                  tag="Niche-Specific Scraping"
                  title="Industry corridors, hand-mapped"
                  body="From Series-B AI infra to Dubai luxury brokers — dedicated scrapers per vertical, refreshed continuously."
                  stat="12,000+ niches mapped"
                />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-4" delay={160}>
                <FeatureCard
                  tag="Full-Stack SaaS Builds"
                  title="Your product, engineered end-to-end"
                  body="Dashboards, portals, internal tools — production-ready code, deployed fast, built exactly to spec."
                  stat="Custom scoping & architecture"
                />
              </Reveal>
              <Reveal className="col-span-12 md:col-span-4" delay={200}>
                <FeatureCard
                  tag="AI Personalization Loop"
                  title="{First_Name} that actually lands"
                  body="Drop a template — we render contextual openers per contact using live enrichment data, ready for your sender."
                  stat="Avg. 4.2× reply lift"
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
                  Need leads today? Launch the pipeline instantly. Need a full system built? Let's architect it together.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-5">
              <Reveal>
                <PricingCard
                  badge="Pulse Core — Lead Intelligence"
                  price="$10"
                  cadence="one-time"
                  headline="500 Verified Leads, Delivered Now."
                  subtitle="Any niche. Any country or region worldwide. Scraped live, enriched, and auto-downloaded in minutes — no empty rows, no placeholders."
                  features={[
                    "Exactly 500 verified B2B decision-maker emails",
                    "Target any niche + country or region",
                    "Smart auto-fill guarantee via AI expansion",
                    "Live scraped, deduplicated & cleaned",
                    "Instant browser CSV download + email backup",
                  ]}
                  ctaLabel="LAUNCH PIPELINE — $10"
                  onClick={() => setModal("core")}
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

            <Reveal delay={200}>
              <p className="text-center text-xs text-muted-foreground mt-8">
                Every Core pipeline request spawns a live async extraction node. Every custom build starts with a scoping call.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ─── BOTTOM CTA ────────────────────────────────────────────── */}
        <section className="px-5 py-24">
          <Reveal>
            <div className="mx-auto max-w-5xl glass-strong halo rounded-3xl px-8 py-14 text-center relative overflow-hidden">
              <div className="absolute -inset-px rounded-3xl pointer-events-none bg-[radial-gradient(600px_200px_at_50%_-20%,rgba(168,120,255,0.35),transparent)]" />
              <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)] mb-4">Ready to move?</p>
              <h3 className="font-display text-3xl sm:text-4xl font-semibold">
                Tell us your problem.<br />We'll engineer the answer.
              </h3>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Whether it's a lead list you need today or an entire autonomous system you've been putting off building — LorPulse deploys solutions fast, built to outlast the trend.
              </p>
              <div className="mt-7 flex justify-center gap-3 flex-wrap">
                <Link
                  to="/contact"
                  className="halo-btn rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15"
                >
                  Build Something Custom
                </Link>
                
                {/* 👑 التعديل هنا: صلحنا هاد التاغ لي كان مقطوع */}
                <a
                  href="#pricing"
                  className="halo-btn rounded-xl px-6 py-3 text-sm font-medium glass"
                >
                  Get Leads Instantly →
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {modal === "core" && <RequirementsModal plan="core" onClose={() => setModal(null)} />}
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
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-5xl font-semibold text-glow">{price}</span>
        <span className="text-sm text-muted-foreground">{cadence}</span>
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
        className={`mt-8 halo-btn rounded-xl py-3.5 text-sm font-semibold tracking-wide border ${featured ? "bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border-white/20" : "bg-white/5 border-white/10"}`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}