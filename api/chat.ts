import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// تهيئة Supabase - ضروري يكونوا فـ Environment Variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // التعامل مع CORS باش ما يوقعش Error فـ Localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { message, history, selectedPlan } = req.body;
  
  // حساب الأثمنة (The Real Math)
  const currentPlan = selectedPlan || 'Pulse Core';
  const prices: Record<string, number> = {
    'Pulse Core': 14,
    'Growth Hunter': 49,
    'Custom Neural': 149
  };
  const planPrice = prices[currentPlan] || 14;
  const retainerValue = (planPrice / 2).toFixed(2);

  try {
    // 1. استدعاء GROQ (The Brain)
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { 
            role: "system", 
            content: `Identity: AgentCore, Chief Architect at LorPulse. Vibe: Elite, Billionaire Consultant. No fluff. If email provided, confirm $${retainerValue} invoice sent. Plain text only.` 
          },
          ...history.slice(-3).map((m: any) => ({ role: m.role === "agent" ? "assistant" : "user", content: m.content })),
          { role: "user", content: message }
        ],
        temperature: 0.2,
      })
    });

    const groqData = await groqResponse.json();
    const reply = groqData.choices?.[0]?.message?.content || "Neural bridge stable. Proceed.";

    // 2. معالجة الإيميل والبيانات (The Action)
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      const userEmail = emailMatch[0].toLowerCase();

      // حفظ في Supabase
      await supabase.from('leads').upsert({
        email: userEmail,
        selected_plan: currentPlan,
        status: 'awaiting_payment'
      }, { onConflict: 'email' });

      // إرسال الإيميل الاحترافي عبر Brevo
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.VITE_BREVO_API_KEY || "",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "AgentCore | LorPulse", email: "lorpulse.official@gmail.com" },
          to: [{ email: userEmail }],
          subject: `ACTION REQUIRED: Authorize ${currentPlan} Deployment`,
          htmlContent: `
            <div style="background:#000; color:#fff; padding:50px; font-family:sans-serif; border:1px solid #111;">
              <h1 style="color:#00ffcc; letter-spacing:-1px;">LORPULSE <span style="color:#fff;">SYSTEMS</span></h1>
              <p style="color:#666;">INVOICE ID: LP-${Math.random().toString(36).substring(7).toUpperCase()}</p>
              <div style="margin:40px 0; border-left:3px solid #00ffcc; padding-left:20px;">
                <p style="margin:0; color:#aaa;">RETAINER DEPOSIT (50%)</p>
                <h2 style="font-size:40px; margin:10px 0;">$${retainerValue} USD</h2>
              </div>
              <a href="https://paypal.me/yazidesalhi/${retainerValue}" style="background:#fff; color:#000; padding:15px 30px; text-decoration:none; font-weight:bold; display:inline-block;">AUTHORIZE NOW</a>
            </div>
          `
        })
      });
    }

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error("CRASH:", error);
    return res.status(500).json({ error: error.message });
  }
}