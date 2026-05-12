import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Circle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Embed = () => {
  const [searchParams] = useSearchParams();
  const botKey = searchParams.get("key");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState({ name: "Neural Agent", prompt: "" });
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll ديما لتحت
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!botKey) return;
      try {
        const { data, error } = await supabase
          .from("bot_configs")
          .select("*")
          .eq("api_key", botKey.trim())
          .single();

        if (data && !error) {
          setConfig({ name: data.client_name || "Neural Agent", prompt: data.system_prompt });
          setMessages([{ role: "assistant", content: `System Initialized. I am ${data.client_name || 'your assistant'}. How can I help you today?` }]);
        }
      } catch (err) {
        console.error("Config fetch error:", err);
      }
    };
    fetchConfig();
  }, [botKey]);

  
  const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userMsg = { role: "user", content: input };
  const currentMessages = [...messages, userMsg];
  
  // تنظيف التاريخ باش نضمنو أن ما كاينش شي "null" أو "undefined"
  const cleanHistory = messages
    .filter(m => m.content)
    .map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content)
    }));

  setMessages(currentMessages);
  setInput("");
  setIsLoading(true);

  console.log("🚀 Sending to Edge Function:", {
    message: input,
    systemPrompt: config.prompt,
    chatHistory: cleanHistory
  });

  try {
    const { data, error: invokeError } = await supabase.functions.invoke("lorpulse-core", {
      body: { 
        message: input, 
        systemPrompt: config.prompt, 
        chatHistory: cleanHistory 
      },
    });

    if (invokeError) {
      // إيلا كاين Error، غانقرؤوه من الـ Response
      const errorDetail = await invokeError.context?.json();
      console.error("❌ Edge Function Error Detail:", errorDetail);
      throw invokeError;
    }

    if (data && data.reply) {
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    }
  } catch (err) {
    console.error("❌ Full Invoke Error Object:", err);
    setMessages(prev => [...prev, { role: "assistant", content: "Neural link timeout. Checking infrastructure..." }]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans text-black border overflow-hidden shadow-sm">
      {/* Dynamic Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-gray-100 shadow-sm">
               <span className="text-white font-black text-xs uppercase tracking-tighter">
                 {config.name.substring(0,2)}
               </span>
            </div>
            <Circle className="absolute -bottom-1 -right-1 w-3 h-3 fill-green-500 text-white stroke-2" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-black tracking-tight">{config.name}</h3>
            <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em]">Neural Active</p>
          </div>
        </div>
      </div>

      {/* Chat Space */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FBFBFB]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              m.role === "user" 
                ? "bg-black text-white rounded-br-none shadow-md" 
                : "bg-white border border-gray-200 text-black rounded-tl-none shadow-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-2.5 rounded-2xl rounded-tl-none animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            </div>
          </div>
        )}
      </div>

      {/* Control Panel (Input) */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 items-center bg-gray-50 rounded-2xl p-1.5 pr-2 border border-gray-200 focus-within:border-black focus-within:bg-white transition-all shadow-inner">
          <Input 
            placeholder="Type your command..." 
            className="border-none bg-transparent text-black placeholder:text-gray-400 focus-visible:ring-0 h-10 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            size="icon" 
            className="rounded-xl bg-black hover:bg-gray-800 h-9 w-9 shadow-lg"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 opacity-30">
           <div className="h-[1px] w-10 bg-gray-400"></div>
           <p className="text-[8px] font-black tracking-widest text-gray-500 uppercase">LorPulse Interface</p>
           <div className="h-[1px] w-10 bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default Embed;