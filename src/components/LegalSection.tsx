import { ShieldCheck, Scale, Cookie } from "lucide-react";

const LegalCard = ({ icon: Icon, title, content, id }: { icon: any, title: string, content: string, id: string }) => (
  <div id={id} className="p-8 rounded-[2rem] glass-strong border border-white/10 hover:border-primary/20 transition-all duration-500 group">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-primary" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed italic">
      "{content}"
    </p>
  </div>
);

const Legal = () => {
  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="section-container relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/50 uppercase">Legal Framework</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Compliance & Security</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <LegalCard 
            id="privacy"
            icon={ShieldCheck} 
            title="Privacy Policy" 
            content="Data privacy is our fortress. All neural interactions are encrypted. Your proprietary information remains yours, forever."
          />
          <LegalCard 
            id="terms"
            icon={Scale} 
            title="Terms of Service" 
            content="Result-First delivery. Full ownership of the AI infrastructure is transferred only after final milestone confirmation."
          />
          <LegalCard 
            id="cookies"
            icon={Cookie} 
            title="Cookie Policy" 
            content="Minimal functional cookies for session stability. No tracking. No third-party ads. Just pure performance."
          />
        </div>
      </div>
    </section>
  );
};

export default Legal;