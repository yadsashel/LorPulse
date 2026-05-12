import { Shield, Zap, Server, Lock, CheckCircle2 } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import heroVisual from "@/assets/hero-visual.jpg";

const stats = [
  { icon: Zap, label: "100%", desc: "Uptime SLA", color: "text-primary" },
  { icon: Server, label: "1,000", desc: "Concurrent Agents", color: "text-primary" },
  { icon: Shield, label: "AES-256", desc: "Encryption", color: "text-secondary" },
  { icon: Lock, label: "SOC2", desc: "Compliant", color: "text-secondary" },
];

const features = [
  "On-premise deployment available",
  "Scale from 1 to 1,000 agents instantly",
  "Zero-knowledge architecture",
  "Post-quantum security ready",
];

const TechSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[150px]" />

      <div ref={ref} className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <div className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="rounded-3xl overflow-hidden border border-border/30 relative">
              <img
                src={heroVisual}
                alt="Neural Engine"
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-5 w-48">
              <p className="text-3xl font-bold text-secondary">99.99%</p>
              <p className="text-xs text-muted-foreground mt-1">System reliability</p>
              <div className="mt-3 flex gap-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 h-8 rounded-sm bg-secondary/20" style={{ height: `${20 + Math.random() * 30}px` }}>
                    <div className="w-full bg-secondary/60 rounded-sm" style={{ height: `${50 + Math.random() * 50}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 text-sm text-muted-foreground mb-6">
              Engine <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center font-mono">03</span>
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Technical <span className="text-gradient-green">Prowess</span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Built for absolute reliability. Our infrastructure handles enterprise-grade workloads with military-level encryption and zero downtime.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 flex items-center gap-3">
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                  <div>
                    <p className="text-lg font-bold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;
