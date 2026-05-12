import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'pending')
    .limit(10);

  if (error || !leads || leads.length === 0) {
    return res.status(200).json({ message: "No pending leads." });
  }

  const BREVO_API_KEY = process.env.VITE_BREVO_API_KEY;

  for (const lead of leads) {
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": BREVO_API_KEY!,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "Yazid | LorPulse", email: "lorpulse.official@gmail.com" },
          to: [{ email: lead.email }],
          subject: "Neural Deployment Strategy for your business",
          htmlContent: `... (نفس الـ HTML اللي عندك ديجا) ...`
        })
      });

      await supabase
        .from('leads')
        .update({ status: 'contacted', contacted_at: new Date() })
        .eq('id', lead.id);
        
    } catch (e) { console.error(e); }
  }

  return res.status(200).json({ message: "Outreach done." });
}