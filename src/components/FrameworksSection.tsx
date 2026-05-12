import { useScrollReveal } from "./useScrollReveal";
import { Bot, Cloud, Database, Shield, Cpu, Network } from "lucide-react";

const frameworks = [
  { name: "OpenAI", icon: Bot },
  { name: "FastAPI", icon: Cpu },
  { name: "AWS", icon: Cloud },
  { name: "SOC2", icon: Shield },
  { name: "Kubernetes", icon: Network },
  { name: "PostgreSQL", icon: Database },
];

const FrameworksSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 relative">
      <div ref={ref} className="section-container text-center">
        <p className="text-muted-foreground text-sm mb-8">
          Join over <span className="text-foreground font-semibold">10K+</span> businesses using LorPulse.
        </p>

        <div
          className={`grid grid-cols-3 md:grid-cols-6 gap-6 mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {frameworks.map((fw) => (
            <div
              key={fw.name}
              className="glass rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary/30 transition-all duration-300 group"
            >
              <fw.icon className="w-8 h-8 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
              <span className="text-xs font-mono text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                {fw.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`glass-strong rounded-3xl p-12 md:p-16 relative overflow-hidden transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gradient-cyan">Initialize?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Deploy your first autonomous agent in under 48 hours. Enterprise-grade security. Zero data leakage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-btn transition-all duration-300 hover:scale-105">
                Request System Audit
              </button>
              <button className="px-10 py-4 rounded-xl border border-border/50 text-foreground font-semibold text-lg hover:border-primary/40 transition-all duration-300">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameworksSection;
