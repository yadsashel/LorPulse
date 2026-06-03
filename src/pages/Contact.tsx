import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"leads" | "custom">("custom");

  return (
    <SiteShell>
      <section className="px-5 py-20 relative overflow-hidden">
        {/* 🌌 Atmospheric Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-purple-500/5 blur-[120px] pointer-events-none z-0" />

        <div className="mx-auto max-w-3xl relative z-10">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)] text-center">System Scoping</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold text-center tracking-tight">
              Tell us what we're building.
            </h1>
            <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Whether you need instant targeted data corridors or a production-grade autonomous AI pipeline, select your mode to launch the scoping sequence.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 glass-strong halo rounded-3xl p-6 sm:p-8 border-white/5">
              {!sent ? (
                <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  
                  {/* 🎛️ Interactive Plan Selector */}
                  <div className="grid gap-2">
                    <span className="text-xs text-muted-foreground font-medium">Select Operational Mode</span>
                    <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSelectedPlan("leads")}
                        className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                          selectedPlan === "leads"
                            ? "bg-white/10 text-white shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        ⚡ Engine 01: Lead Intelligence
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPlan("custom")}
                        className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                          selectedPlan === "custom"
                            ? "bg-gradient-to-r from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] text-white font-bold border border-white/10"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        👑 Engine 02: Custom AI Build
                      </button>
                    </div>
                  </div>

                  {/* 👤 Identity Information */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" name="name" required placeholder="John Doe" />
                    <Input label="Work Email" name="email" type="email" required placeholder="john@company.com" />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Company" name="company" required placeholder="Acme Corp" />
                    <Input label="Role" name="role" placeholder="Founder · Head of Growth" />
                  </div>

                  {/* 🎯 Dynamic Fields based on Selection */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input 
                      label={selectedPlan === "custom" ? "Target Vertical / Industry" : "Target Niche"} 
                      name="niche" 
                      required 
                      placeholder={selectedPlan === "custom" ? "e.g., AI Logistics, Real Estate SaaS" : "DTC fintech · MedTech · Web3 infra"} 
                    />
                    <Input 
                      label="Target Country / Region" 
                      name="country" 
                      required 
                      placeholder="United States · United Kingdom · Europe" 
                    />
                  </div>

                  {selectedPlan === "leads" ? (
                    <Input label="Estimated Volume / Month" name="volume" placeholder="5,000 leads / mo" />
                  ) : (
                    <Input label="Estimated Timeline / Budget Context" name="budget" placeholder="e.g., Need MVP in 4 weeks / Enterprise scale" />
                  )}

                  {/* 📝 Contextual Requirements Textarea */}
                  <Textarea 
                    label={selectedPlan === "custom" ? "System Specifications & Logic" : "Custom Requirements"} 
                    name="notes" 
                    placeholder={
                      selectedPlan === "custom" 
                        ? "Describe the autonomous agents, multi-step scraping workflows, dashboards, internal tools, or custom software architecture you need built from scratch..."
                        : "Describe enrichment vectors, intent signals, specific industry criteria, or formatting details needed for your dataset corridor..."
                    } 
                  />

                  {/* 🚀 Submit Button */}
                  <button 
                    type="submit" 
                    className="mt-2 halo-btn rounded-xl py-3.5 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15 hover:opacity-95 transition-opacity"
                  >
                    {selectedPlan === "custom" ? "Initialize Custom Build Scoping" : "Request Pipeline Access"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] grid place-items-center text-2xl text-glow text-white shadow-lg shadow-purple-500/20">✓</div>
                  <h3 className="mt-5 text-xl font-display font-semibold">Transmission Successful.</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                    {selectedPlan === "custom" 
                      ? "Our lead system architect will review your technical specifications and reach out via email within 24 hours."
                      : "A data pipeline strategist is verifying your parameters and will onboard you to the beta shortly."}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <input {...props} className="halo rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:bg-white/[0.08] focus:border-purple-500/30 transition-all placeholder:text-zinc-600 text-white" />
    </label>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <textarea rows={4} {...props} className="halo rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:bg-white/[0.08] focus:border-purple-500/30 transition-all resize-none placeholder:text-zinc-600 text-white" />
    </label>
  );
}