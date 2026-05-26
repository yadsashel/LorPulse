import { useState } from "react";
import { Link } from "react-router-dom";

type Plan = "core" | "horizon";

export function RequirementsModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const isHorizon = plan === "horizon";
  const title = isHorizon ? "Pulse Horizon — Onboarding" : "Pulse Core — Lead Request";
  const price = isHorizon ? "$24/month" : "$14 one-time";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="glass-strong halo rounded-3xl w-full max-w-lg p-7 relative">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground halo-btn rounded-lg w-8 h-8 grid place-items-center">×</button>
        {!submitted ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" /> Private Beta Onboarding
            </div>
            <h3 className="text-2xl font-display font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{price} · Forms collect requirements and onboard you to our private beta list.</p>
            <form
              className="mt-5 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Field label="Work Email" name="email" type="email" required placeholder="founder@company.com" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Niche / Industry" name="niche" required placeholder="SaaS · Real Estate · Fintech" />
                <Field label="City / Region" name="city" required placeholder="San Francisco" />
              </div>
              <Field label="Email Subject Line" name="subject" required placeholder="Quick question about {Company_Name}" />
              {isHorizon && (
                <Textarea
                  label="AI Personalization Template"
                  name="template"
                  required
                  placeholder={"Hi {First_Name}, noticed {Company_Name} is hiring for…"}
                />
              )}
              <button
                type="submit"
                className="mt-2 halo-btn rounded-xl py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15"
              >
                {isHorizon ? "Join Horizon Beta" : "Submit Hunt Request"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                By submitting you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto h-14 w-14 rounded-2xl glass-strong grid place-items-center text-2xl text-glow">✓</div>
            <h3 className="mt-4 text-xl font-display">You're on the list.</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Our pipeline team will reach out within 24 hours with onboarding details and your first dataset preview.
            </p>
            <button onClick={onClose} className="mt-6 halo-btn rounded-xl px-5 py-2.5 text-sm border border-white/15 bg-white/5">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        {...props}
        className="halo rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:bg-white/[0.07]"
      />
    </label>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <textarea
        rows={3}
        {...props}
        className="halo rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm outline-none focus:bg-white/[0.07] resize-none"
      />
    </label>
  );
}
