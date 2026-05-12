import { useScrollReveal } from "./useScrollReveal";
import techCrystal from "@/assets/tech-crystal.jpg";

const TruthSection = () => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div ref={ref} className="section-container">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 text-sm text-muted-foreground">
            About <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-mono">01</span>
          </span>
        </div>

        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-16">
            As the engineering partner for
            <br className="hidden md:block" />
            autonomous scale, we deploy{" "}
            <span className="text-gradient-cyan">
              intelligent agents, zero-leakage
              <br className="hidden md:block" />
              infrastructure, and local-first
            </span>{" "}
            systems.
          </h2>
        </div>

        {/* Image grid */}
        <div
          className={`grid md:grid-cols-3 gap-6 mt-8 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="rounded-2xl overflow-hidden border border-border/30 aspect-[4/5]">
            <img
              src={techCrystal}
              alt="Tech crystal"
              loading="lazy"
              width={640}
              height={640}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-primary/20 aspect-[4/5] md:mt-12">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-card to-card flex items-center justify-center p-8">
              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                "Most AI models talk too much. We built one that understands the silence between the lines. Your data never leaves. Zero leakage."
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border/30 aspect-[4/5]">
            <div className="w-full h-full bg-gradient-to-br from-card to-muted/30 p-8 flex flex-col justify-end">
              <div className="glass rounded-xl p-4">
                <p className="text-3xl font-bold text-foreground mb-1">99.9%</p>
                <p className="text-xs text-muted-foreground">Data Privacy Compliance</p>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[99.9%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TruthSection;
