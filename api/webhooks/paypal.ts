import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// paypal.ts - المعدل
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const event = req.body;

  if (event.event_type === 'PAYMENT.SALE.COMPLETED' || event.event_type === 'BILLING.SUBSCRIPTION.CREATED') {
    const customerEmail = event.resource.payer?.email_address || event.resource.subscriber?.email_address;
    
    // 1. تحديث الحالة في bot_configs لـ active
    const { data: updatedBot, error: botError } = await supabase
      .from('bot_configs')
      .update({ status: 'active' })
      .eq('client_email', customerEmail)
      .select()
      .single();

    if (updatedBot) {
      const secretCode = updatedBot.api_key; // هادا هو الكود السري للدخول
      
      // 2. إرسال الكود السري عبر Brevo
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": process.env.VITE_BREVO_API_KEY!, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { name: "LorPulse Deployment", email: "lorpulse.official@gmail.com" },
          to: [{ email: customerEmail }],
          subject: "🔓 ACCESS GRANTED: Your Secret Dashboard Code",
          htmlContent: `
            <div style="background:#000; color:#fff; padding:40px; border:2px solid #00ffcc; font-family:sans-serif;">
              <h1 style="color:#00ffcc; text-align:center;">PROTOCOL ACTIVATED</h1>
              <p>Your Neural Bridge is now <b>LIVE</b>. Use the secret code below to access your private dashboard:</p>
              <div style="background:#111; padding:20px; text-align:center; font-size:24px; color:#00ffcc; border:1px dashed #333; letter-spacing:5px;">
                ${secretCode}
              </div>
              <p style="text-align:center; margin-top:20px;">
                <a href="https://lorpulse.vercel.app/dashboard" style="color:#00ffcc;">Go to Dashboard</a>
              </p>
            </div>`
        })
      });
    }
  }
  return res.status(200).json({ received: true });
}