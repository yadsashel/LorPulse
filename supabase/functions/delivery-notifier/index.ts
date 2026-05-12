import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const VITE_BREVO_API_KEY = Deno.env.get("VITE_BREVO_API_KEY");
  
  try {
    const { record } = await req.json();

    // الشرط الصارم: فقط فاش يوصل لـ 100% ويكون "Completed"
    if (record.status === 'Completed' && record.progress_percent === 100 && record.client_email) {
      
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": VITE_BREVO_API_KEY || "",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "LorPulse Deployment", email: "lorpulse.official@gmail.com" },
          to: [{ email: record.client_email }],
          subject: `PROJECT COMPLETE: ${record.client_name} is Ready!`,
          htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #000;">Build Status: 100% Complete</h2>
              <p>Hello,</p>
              <p>The development for <strong>${record.client_name}</strong> has been successfully finalized.</p>
              <p>You can now access your project files and dashboard via the link below:</p>
              <div style="margin: 20px 0;">
                <a href="https://lorpulse.vercel.app/" 
                   style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
                   Access Project Dashboard
                </a>
              </div>
              <p style="font-size: 12px; color: #888; border-top: 1px solid #eee; pt: 10px;">
                This is an automated delivery from LorPulse Agency.
              </p>
            </div>`
        })
      });

      return new Response(JSON.stringify({ status: "Email sent to client" }), { status: 200 });
    }

    return new Response(JSON.stringify({ status: "Condition not met (Not 100% or no email)" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }

  // كود بسيط لـ تنبيه مول السيت بوجود كليان جديد
if (payload.type === 'INSERT' && payload.table === 'leads') {
    await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": VITE_BREVO_API_KEY!, "content-type": "application/json" },
        body: JSON.stringify({
            sender: { name: "LorPulse System", email: "lorpulse.official@gmail.com" },
            to: [{ email: "ADMIN_EMAIL_HERE" }], // إيميل مول الشركة اللي مخلصك 14$
            subject: "🔥 NEW LEAD CAPTURED!",
            htmlContent: `<p>New lead from: <b>${payload.record.email}</b></p><p>Status: Qualified</p>`
        })
    });
}

})