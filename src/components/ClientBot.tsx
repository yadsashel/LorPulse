"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, X } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ClientBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. جلب المعطيات من URL
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const apiKey = urlParams?.get('apiKey') || 'default-core';

  // 2. جلب إعدادات البوت من Supabase (The Brain)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('bot_configs')
          .select('system_prompt')
          .eq('api_key', apiKey)
          .single();

        if (data && !error) {
          setSystemPrompt(data.system_prompt);
        } else {
          // ديفولت إيلا مالقاش الساروت فـ السوبابيس
          const defaultPrompt = apiKey.includes('docsift') 
            ? "You are the DocSift AI Specialist. Focus on explaining document automation and sales benefits professionally."
            : "You are Pulse Core, an elite AI assistant. Keep responses brief and helpful.";
          setSystemPrompt(defaultPrompt);
        }
      } catch (err) {
        setSystemPrompt("You are Pulse Core AI.");
      }
    };
    fetchConfig();
  }, [apiKey]);

  // 3. إدارة الـ LocalStorage (مسح الكاش إيلا تبدل الكليان)
  useEffect(() => {
    const saved = localStorage.getItem(`chat_history_${apiKey}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'assistant', content: "Neural link established. How can I assist you today?" }]);
    }
  }, [apiKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${apiKey}`, JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, apiKey]);

  // 4. إرسال الميساج لـ Groq
  const fetchAIResponse = async (userMsg: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ],
          temperature: 0.5, // دقة عالية
          max_tokens: 300
        })
      });

      const data = await response.json();
      const aiReply = data.choices[0]?.message?.content || "Synchronized.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Neural link unstable. Retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const m = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: m }]);
    setInput('');
    await fetchAIResponse(m);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-black font-sans">
      {/* Header Area */}
      <div className="p-4 bg-black text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center animate-pulse">
            <MessageSquare size={18} />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-widest uppercase italic text-blue-400">Pulse Core v2.0</h1>
            <p className="text-[9px] text-white/50 uppercase font-bold">{apiKey}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fcfcfc] scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm border ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
              : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] text-gray-400 font-mono italic px-2">Architect is thinking...</div>}
      </div>

      {/* Input Area - FIXED TEXT COLOR */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 text-black placeholder-gray-400 outline-none"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-black text-white p-3 rounded-xl hover:bg-blue-600 transition-all disabled:bg-gray-300"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="mt-3 text-center text-[8px] text-gray-300 font-bold tracking-widest uppercase">
          Powered by LorPulse Neural Network
        </p>
      </div>
    </div>
  );
}