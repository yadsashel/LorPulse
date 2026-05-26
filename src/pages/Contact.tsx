import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)] text-center">Contact</p>
            <h1 className="mt-3 font-display text-5xl font-semibold text-center">Tell us your niche.</h1>
            <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
              Share your requirements and we'll onboard you to our private beta list within 24 hours.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 glass-strong halo rounded-3xl p-7">
              {!sent ? (
                <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" name="name" required />
                    <Input label="Work Email" name="email" type="email" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Company" name="company" required />
                    <Input label="Role" name="role" placeholder="Founder · Head of Growth" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Target Niche" name="niche" required placeholder="DTC fintech · MedTech · Web3 infra" />
                    <Input label="Target City / Region" name="city" required placeholder="London · NYC · APAC" />
                  </div>
                  <Input label="Estimated Volume / Month" name="volume" placeholder="5,000 leads / mo" />
                  <Textarea label="Custom Requirements" name="notes" placeholder="Describe enrichment vectors, intent signals, or onboarding details…" />
                  <button type="submit" className="halo-btn rounded-xl py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15">
                    Request Beta Access
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-14 w-14 rounded-2xl glass-strong grid place-items-center text-2xl text-glow">✓</div>
                  <h3 className="mt-4 text-xl font-display">Request received.</h3>
                  <p className="text-sm text-muted-foreground mt-2">A pipeline strategist will reach out shortly.</p>
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
    <label className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...props} className="halo rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:bg-white/[0.07]" />
    </label>
  );
}
function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <textarea rows={4} {...props} className="halo rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:bg-white/[0.07] resize-none" />
    </label>
  );
}
