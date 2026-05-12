"use client";
import { Check, Zap, Target, Cpu } from "lucide-react";

const plans = [
  {
    name: "Pulse Core",
    price: "5",
    description: "Ideal for solo-founders needing baseline automation.",
    features: ["Neural Chatbot Integration", "Lead Capture System", "Email Authorization", "Standard Support"],
    icon: <Zap className="text-cyan w-6 h-6" />,
    color: "border-white/10"
  },
  {
    name: "Growth Hunter",
    price: "15",
    description: "Advanced scraping & lead generation for scaling agencies.",
    features: ["Everything in Pulse Core", "Automated Lead Hunting", "LinkedIn/Google Scraping", "Priority Deployment"],
    icon: <Target className="text-cyan w-6 h-6" />,
    color: "border-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]",
    popular: true
  },
  {
    name: "Custom Neural",
    price: "49",
    description: "Full-scale enterprise infrastructure & custom logic.",
    features: ["Bespoke AI Training", "API Integration", "Dedicated Neural Bridge", "24/7 Elite Support"],
    icon: <Cpu className="text-cyan w-6 h-6" />,
    color: "border-white/10"
  }
];

export default function Pricing() {
  
  const handlePlanSelect = (planName: string) => {
    // إرسال إشارة للمتصفح باش الشات يفتح ويبدا الهضرة
    const event = new CustomEvent("planSelected", {
      detail: { 
        planName: planName,
        initialMessage: `I am interested in the ${planName}. Initialize the deployment sequence.` 
      }
    });
    window.dispatchEvent(event);

    // سكرول خفيف لجهة الشات (إيلا كان لتحت)
    console.log(`Plan ${planName} selected. Dispatching to AgentCore...`);
  };

  return (
    <section className="bg-black py-24 px-6" id="pricing">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-[10px] font-black tracking-[0.5em] text-cyan uppercase mb-4">Neural Tiering</h2>
        <h3 className="text-4xl md:text-6xl font-black text-white">Select Your Power.</h3>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-[2.5rem] bg-[#050505] border transition-all duration-500 hover:scale-[1.02] ${plan.color}`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Most Deployed
              </span>
            )}
            
            <div className="mb-8">
              <div className="mb-4">{plan.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">${plan.price}</span>
                <span className="text-white/20 text-xs uppercase font-bold">/ monthly</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-white/70">
                  <Check size={14} className="text-cyan shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handlePlanSelect(plan.name)}
              className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                plan.popular 
                ? "bg-cyan text-black hover:bg-white" 
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-white/20 text-[10px] uppercase mt-12 tracking-widest">
        Secure billing via lorpulse.vercel.app // PayPal Authorized
      </p>
    </section>
  );
}