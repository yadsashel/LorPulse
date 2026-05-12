import { Target, Settings, BrainCircuit, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const agents = [
  {
    icon: Target,
    title: "Lead Gen Agents",
    accent: "primary",
    stat: "10k+",
    statLabel: "Leads/month",
    description:
      "Scrapes 10k+ leads/month from deep-web sources. Scores leads with a custom-trained LLM. Auto-personalizes every outreach based on real-time neural matching.",
  },
  {
    icon: Settings,
    title: "Operations Agents",
    accent: "secondary",
    stat: "24/7",
    statLabel: "Uptime",
    description:
      "Manages your back-office 24/7. Error detection and auto-correction. Seamlessly syncs data across your entire stack (CRM, ERP, Finance).",
  },
  {
    icon: BrainCircuit,
    title: "Analysis Agents",
    accent: "primary",
    stat: "TB+",
    statLabel: "Data processed",
    description:
      "Synthesizes terabytes of unstructured data into real-time operational reports. Finds the bottleneck before your team does.",
  },
];

const OfferSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 relative overflow-hidden">
      <div ref={ref} className="section-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 text-sm text-muted-foreground mb-4">
              Services <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-mono">02</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Agents as <span className="text-gradient-cyan">Infrastructure</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Deploy intelligent agents that work autonomously across your entire enterprise stack with zero manual intervention.
          </p>
        </div>

        {/* Bento grid */}
        <div
          className={`grid md:grid-cols-3 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {agents.map((agent) => (
            <div key={agent.title} className="group bento-card relative overflow-hidden">
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b from-${agent.accent}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-${agent.accent}/10 border border-${agent.accent}/20 flex items-center justify-center`}>
                    <agent.icon className={`w-7 h-7 text-${agent.accent}`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-foreground">{agent.title}</h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-3xl font-bold text-${agent.accent}`}>{agent.stat}</span>
                  <span className="text-xs text-muted-foreground">{agent.statLabel}</span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className={`mt-12 rounded-3xl overflow-hidden border border-border/30 relative transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <img
            src={dashboardPreview}
            alt="Dashboard Preview"
            loading="lazy"
            width={1280}
            height={720}
            className="w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-sm font-mono text-primary mb-2">// Live Agent Dashboard</p>
            <p className="text-foreground text-lg font-semibold">Real-time autonomous agent monitoring across your entire infrastructure.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
