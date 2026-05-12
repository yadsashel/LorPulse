import lorpulseLogo from "@/assets/lorpulse-logo.png";
import heroVisual from "@/assets/hero-visual.jpg";
import robotHand from "@/assets/robot-hand.png";
import ParticleField from "./ParticleField";
import { Users, TrendingUp, Cpu, ArrowRight } from "lucide-react";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <ParticleField />
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none z-[1]" />

    <div className="relative z-10 section-container w-full pt-24 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left column - Text */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">Autonomous AI Agency</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="text-foreground">Your AI</span>
            <br />
            <span className="text-foreground">Agents,</span>{" "}
            <span className="text-gradient-cyan">On</span>
            <br />
            <span className="text-gradient-cyan">Demand.</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-lg mb-10 leading-relaxed">
            We craft autonomous ecosystems where intelligence, precision, and visual data merge into one seamless infrastructure.
          </p>

          {/* Floating stat cards */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3 glow-cyan">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3K+</p>
                <p className="text-xs text-muted-foreground">Happy users</p>
              </div>
            </div>
            <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">95%</p>
                <p className="text-xs text-muted-foreground">ROI Improvement</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
  <a 
    href="#tech" 
    className="group px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-btn transition-all duration-300 hover:scale-105 flex items-center gap-2"
  >
    Explore Services
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </a>
  <a 
    href="#section-pricing" 
    className="px-8 py-4 rounded-xl border border-primary/40 text-primary font-semibold text-lg hover:bg-primary/10 transition-all duration-300"
  >
    View Pricing
  </a>
</div>
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-accent/40 border-2 border-background" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-primary text-sm">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <span className="text-sm text-muted-foreground">3000+ Customers</span>
          </div>
        </div>

        {/* Right column - Visual composition */}
        <div className="relative hidden lg:block">
          {/* Main hero image */}
          <div className="relative">
            <img
              src={heroVisual}
              alt="Neural Network Visualization"
              width={1024}
              height={1024}
              className="w-full rounded-3xl shadow-2xl shadow-primary/10"
            />
            {/* Overlay glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background via-transparent to-transparent" />

            {/* Robot hand overlay */}
            <img
              src={robotHand}
              alt="Robotic hand"
              width={300}
              height={300}
              className="absolute -top-16 -right-12 w-64 animate-float drop-shadow-[0_0_40px_rgba(0,230,255,0.3)]"
            />
          </div>

          {/* Floating AgentAI card */}
          <div className="absolute top-8 right-4 glass-strong rounded-2xl p-4 w-56 animate-float" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2 mb-3">
              <img src={lorpulseLogo} alt="Logo" width={20} height={20} />
              <span className="text-xs font-mono text-primary">AgentAI</span>
              <span className="text-xs text-muted-foreground ml-auto">01/04</span>
            </div>
            <div className="rounded-xl overflow-hidden mb-3 border border-border/30">
              <img src={lorpulseLogo} alt="Agent" width={200} height={120} className="w-full h-24 object-cover bg-primary/5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">100+</p>
              <p className="text-xs text-muted-foreground">Projects successfully launched worldwide</p>
            </div>
          </div>

          {/* Floating partners card */}
          <div className="absolute bottom-12 -left-8 glass-strong rounded-2xl p-4 w-52" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "1s" }}>
            <p className="text-2xl font-bold text-foreground mb-1">250+</p>
            <p className="text-xs text-muted-foreground mb-3">Trusted Partners</p>
            <div className="flex flex-wrap gap-2">
              {["FastAPI", "OpenAI", "AWS", "K8s"].map((t) => (
                <span key={t} className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
            <button className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              Sent a Message
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
  </section>
);

export default HeroSection;
