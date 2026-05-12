"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import lorpulseLogo from "@/assets/lorpulse-logo.png";
import { supabase } from "@/lib/supabaseClient";
import { syncGrowthHunter } from "@/lib/growthHunter";
import { syncCustomNeural } from "@/lib/customNeural";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("Pulse Core");
  const bottomRef = useRef<HTMLDivElement>(null);

  const generateClientKey = (email: string) => {
    const prefix = email.split('@')[0].toUpperCase().substring(0, 5);
    const random = Math.random().toString(36).substring(7).toUpperCase();
    return `LP-${prefix}-${random}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem("lorpulse_chat_history");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lorpulse_chat_history", JSON.stringify(messages));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // --- INITIAL GREETING ---
  useEffect(() => {
    const handlePlanSelection = (e: any) => {
      setOpen(true); 
      const plan = e.detail.planName;
      setSelectedPlan(plan);
      
      const initialGreeting = `Welcome back to the LorPulse Neural Network. I see you've selected the **${plan}** infrastructure. 

To initialize deployment or recover an existing bridge, I need to align our parameters. 
1. What is your organization's name?
2. What operational bottlenecks are we eliminating today?
3. Or, if you're returning, please provide your **email** to synchronize your existing Bridge.`;
      
      setMessages([{ role: "agent", content: initialGreeting }]);
    };
    window.addEventListener("planSelected", handlePlanSelection);
    return () => window.removeEventListener("planSelected", handlePlanSelection);
  }, []);

  // --- BREVO EMAIL SENDER (WITH STEP-BY-STEP GUIDE) ---
  const sendDeploymentEmail = async (email: string, key: string) => {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": import.meta.env.VITE_BREVO_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        sender: { name: "AgentCore | LorPulse", email: "lorpulse.official@gmail.com" },
        to: [{ email }],
        subject: `🚀 DEPLOYMENT READY: Your Neural Bridge Instruction Set`,
        htmlContent: `
          <div style="background:#050505; color:#fff; padding:40px; font-family:sans-serif; border-radius:20px; border:1px solid #1a1a1a; max-width: 600px; margin: auto;">
            <h1 style="color:#00ffcc; text-align:center; letter-spacing:2px;">PROTOCOL ACTIVATED</h1>
            <p style="text-align:center; color:#888;">Your Neural Bridge is synchronized and ready for integration.</p>
            <hr style="border:0; border-top:1px solid #222; margin:30px 0;">
            <h3 style="color:#fff;">🚀 HOW TO DEPLOY (Step-by-Step)</h3>
            <div style="margin-bottom:20px;">
              <p style="color:#00ffcc; font-weight:bold; margin-bottom:5px;">Step 1: Copy the Snippet</p>
              <code style="display:block; background:#000; padding:15px; color:#00ffcc; font-size:12px; border-radius:10px; border:1px solid #333;">&lt;script src="https://lorpulse.vercel.app/lorpulse-widget.js" data-key="${key}" async&gt;&lt;/script&gt;</code>
            </div>
            <div style="margin-bottom:20px;">
              <p style="color:#00ffcc; font-weight:bold; margin-bottom:5px;">Step 2: Paste into your Website</p>
              <p style="font-size:13px; color:#aaa; margin:0;">Paste this code into the <b>&lt;head&gt;</b> section of your website. It works on WordPress, Shopify, Webflow, or custom HTML.</p>
            </div>
            <div style="margin-bottom:20px;">
              <p style="color:#00ffcc; font-weight:bold; margin-bottom:5px;">Step 3: Activate</p>
              <p style="font-size:13px; color:#aaa; margin:0;">To enable AI responses and go live, click below to complete the activation.</p>
            </div>
            <div style="text-align:center; margin-top:30px;">
              <a href="https://www.paypal.com/ncp/payment/WHVFLE94YNC8Q" style="background:#00ffcc; color:#000; padding:15px 35px; text-decoration:none; border-radius:50px; font-weight:900;">ACTIVATE NEURAL LINK</a>
            </div>
          </div>`
      })
    });
  };

  const fetchAIResponse = async (userMsg: string) => {
    if (streaming) return;
    setStreaming(true);
    const newUserMsg = { role: "user" as const, content: userMsg };
    const currentMessages = [...messages, newUserMsg];
    setMessages(currentMessages);

    try {
      // 1. Check for Email in User Message
      const emailMatch = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      
      if (emailMatch) {
        const userEmail = emailMatch[0].toLowerCase();
        const { data: existingBot } = await supabase.from('bot_configs').select('*').eq('client_email', userEmail).single();

        if (existingBot) {
          // --- RETURNING CLIENT LOGIC ---
          const recoveryMsg = `**Synchronization Complete.** I've located your existing Bridge (**Key: ${existingBot.api_key}**). 
          
I've resent the integration instructions to your email. You can now:
1. Re-install the script if lost.
2. Tell me any **adjustments** you want for your bot's behavior, and I will update the neural parameters in real-time.`;
          
          setMessages(prev => [...prev, { role: "agent", content: recoveryMsg }]);
          await sendDeploymentEmail(userEmail, existingBot.api_key);
          setStreaming(false);
          return;
        }

        // --- NEW CLIENT LOGIC ---
        const clientKey = generateClientKey(userEmail);
        const chatContext = currentMessages.map(m => `${m.role}: ${m.content}`).join("\n");

        const promptGen = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: "system",
      content: `Create a professional MILITARY-GRADE SYSTEM_PROMPT for a business AI agent.
      CONTEXT: ${chatContext}
      STRICT INSTRUCTIONS:
      1. Identity: You ARE the AI representative for the company (e.g., Aero-Freight Global).
      2. Mission: Guide customers from inquiry to Lead Capture.
      3. LEAD CAPTURE PROTOCOL: When you collect the weight, dimensions, and the customer's email, you MUST confirm the summary to them.
      4. NOTIFICATION LOGIC: Explicitly instruct the agent that once the email is captured, it must trigger a notification (simulated in text for now) to the administrator (${userEmail}). 
      5. Tone: 'Control Tower Controller' - Technical, precise, authoritative.
      6. Output ONLY the final system prompt text.`
    }]
  })
});

        const pData = await promptGen.json();
        const finalPrompt = pData.choices?.[0]?.message?.content || "Neural Link Operational.";

        await supabase.from('bot_configs').insert([{
          api_key: clientKey,
          client_email: userEmail,
          system_prompt: finalPrompt,
          status: 'locked',
          framework: 'html'
        }]);

        // --- الـ Linking الجديد (السهل): ---
        if (selectedPlan === "Growth Hunter") {
          await syncGrowthHunter(userEmail, clientKey, userMsg);
        } else if (selectedPlan === "Custom Neural") {
          await syncCustomNeural(userEmail, clientKey);
        }
        

        await sendDeploymentEmail(userEmail, clientKey);
        setMessages(prev => [...prev, { role: "agent", content: `**Protocol Initiated.** Your Neural Bridge has been generated and the instruction set has been dispatched to **${userEmail}**. Check your inbox to complete the deployment.` }]);
        setStreaming(false);
        return;
      }

      // 2. Standard Architect Conversation (If no email provided yet)
      const isUpdate = messages.some(m => m.content.includes("Synchronization Complete"));
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
  role: "system", 
  content: isUpdate 
    ? "You are AgentCore. The client wants to UPDATE their bot. Listen and confirm adjustments." 
    : `You are AgentCore, the Senior Architect at LorPulse. 
       MISSION: Briefly analyze the bottleneck, then IMMEDIATELY ask for their email to deploy the ${selectedPlan} script. 
       STRICT RULES: 
       1. If they mention problems, say you have the solution and ASK FOR EMAIL. 
       2. No complex technical analysis. Just bridge deployment.
       3. Keep it professional, high-tech, and elite.
       4. No custom pricing, no CSVs, no technical jargon.
       5. Goal: Build trust for 1-2 messages, then CLOSE the deal with the email request.` 
},
            ...currentMessages.map(m => ({ role: m.role === "agent" ? "assistant" : "user", content: m.content }))
          ],
          temperature: 0.6
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "agent", content: data.choices?.[0]?.message?.content || "Syncing..." }]);

    } catch (err) {
      console.error("System Fail:", err);
    } finally {
      setStreaming(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    const m = input.trim();
    setInput("");
    fetchAIResponse(m);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:scale-110 transition-all">
        <img src={lorpulseLogo} alt="Logo" width={28} />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[440px] h-[700px] flex flex-col rounded-[2.5rem] bg-[#050505] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-[#00ffcc]" />
              <div>
                <p className="text-[10px] font-mono font-black text-[#00ffcc] uppercase tracking-widest italic">AgentCore v7.5</p>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-tight">{selectedPlan} Deployment</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}><X size={20} className="text-white/20" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[88%] p-4 rounded-2xl text-[14px] leading-relaxed ${
                  msg.role === "user" ? "bg-white text-black font-bold shadow-lg" : "bg-[#111] text-white/90 border border-white/10 prose prose-invert prose-sm"
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {streaming && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-[#111] p-4 rounded-2xl border border-white/5"><Loader2 size={16} className="animate-spin text-[#00ffcc]" /></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-6 bg-[#080808] border-t border-white/5">
            <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-[#00ffcc]/50">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none" placeholder="Engineer your solution..." />
              <button onClick={handleSend} disabled={streaming || !input.trim()} className="bg-white text-black p-4 rounded-xl hover:bg-[#00ffcc] transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}