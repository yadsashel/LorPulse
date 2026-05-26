import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

type Plan = "core" | "horizon";

type FormValues = {
  email: string;
  niche: string;
  city: string;
  subject: string;
  template: string;
};

export function RequirementsModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [values, setValues] = useState<FormValues>({
    email: "",
    niche: "",
    city: "",
    subject: "",
    template: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isHorizon = plan === "horizon";
  const title = isHorizon ? "Pulse Horizon — Onboarding" : "Pulse Core — Lead Request";
  const price = isHorizon ? "$24/month" : "$14 one-time";
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const response = await fetch(`${apiUrl}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          plan_type: plan,
          niche: values.niche,
          city: values.city,
          email_subject: values.subject,
          email_template: isHorizon ? values.template : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.detail || response.statusText || "Unable to submit request.";
        throw new Error(message);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="glass-strong halo rounded-3xl w-full max-w-lg p-7 relative">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground halo-btn rounded-lg w-8 h-8 grid place-items-center">×</button>

        {status !== "success" ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_300)] animate-pulseGlow" /> Private Beta Onboarding
            </div>
            <h3 className="text-2xl font-display font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{price} · Forms collect requirements and onboard you to our private beta list.</p>

            <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
              <Field label="Work Email" name="email" type="email" required placeholder="founder@company.com" value={values.email} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Niche / Industry" name="niche" required placeholder="SaaS · Real Estate · Fintech" value={values.niche} onChange={handleChange} />
                <Field label="City / Region" name="city" required placeholder="San Francisco" value={values.city} onChange={handleChange} />
              </div>
              <Field label="Email Subject Line" name="subject" required placeholder="Quick question about {Company_Name}" value={values.subject} onChange={handleChange} />

              {isHorizon && (
                <Textarea
                  label="AI Personalization Template"
                  name="template"
                  required
                  placeholder="Hi {First_Name}, noticed {Company_Name} is hiring for…"
                  value={values.template}
                  onChange={handleChange}
                />
              )}

              {status === "error" && error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 halo-btn rounded-xl py-3 text-sm font-semibold bg-gradient-to-b from-[oklch(0.62_0.24_305)] to-[oklch(0.45_0.22_290)] border border-white/15 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Processing your request…" : isHorizon ? "Join Horizon Beta" : "Submit Hunt Request"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                By submitting you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto h-14 w-14 rounded-2xl glass-strong grid place-items-center text-2xl text-glow">✓</div>
            <h3 className="mt-4 text-xl font-display">Your campaign is live.</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Your custom data pipeline is queued and running. Results will be delivered via email shortly.
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
