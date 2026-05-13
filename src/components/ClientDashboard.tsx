import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ClientDashboard() {
  const { key } = useParams();
  const [leads, setLeads] = useState<any[]>([]);
  const [senderName, setSenderName] = useState("");
  const [senderRole, setSenderRole] = useState("");
  const [customMessage, setCustomMessage] = useState("Hi, I saw your business and I'm interested in a collaboration...");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => { 
    const fetchLeads = async () => {
      const { data } = await supabase.from('leads_found').select('*').eq('api_key', key);
      if (data) setLeads(data);
    };
    fetchLeads();
  }, [key]);

  const handleBroadcast = async () => {
    setIsSending(true);
    // إرسال مباشر عبر Brevo API
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { 
          "api-key": import.meta.env.VITE_BREVO_API_KEY, 
          "content-type": "application/json" 
        },
        body: JSON.stringify({
          sender: { name: `${senderName} | ${senderRole}`, email: "outreach@lorpulse.com" },
          to: leads.map(l => ({ email: l.lead_email, name: l.lead_name })),
          replyTo: { email: "your-client-email@gmail.com" }, // هادي غاتجيبها من الداتا
          subject: "Special Inquiry from " + senderName,
          textContent: customMessage
        })
      });
      if (response.ok) alert("Neural Bridge: 50+ Leads notified successfully.");
    } catch (e) { console.error(e); }
    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#00ffcc] mb-2 uppercase italic">Growth Hunter Command</h1>
        <p className="text-xs text-white/30 mb-10 border-b border-white/10 pb-4">Key: {key}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xs text-[#00ffcc] mb-4">SENDER_CONFIG</h3>
              <input placeholder="Your Name" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl mb-3 outline-none focus:border-[#00ffcc]" />
              <input placeholder="Your Role (e.g. Founder)" value={senderRole} onChange={e => setSenderRole(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl outline-none focus:border-[#00ffcc]" />
            </div>
            
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-xs text-[#00ffcc] mb-4">OUTREACH_MESSAGE</h3>
              <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} className="w-full h-40 bg-black border border-white/10 p-3 rounded-xl outline-none focus:border-[#00ffcc] text-sm" />
              <button onClick={handleBroadcast} disabled={isSending} className="w-full mt-4 bg-[#00ffcc] text-black font-bold py-3 rounded-xl hover:scale-95 transition-all">
                {isSending ? "INITIALIZING..." : "FIRE BROADCAST"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-2xl p-4 overflow-x-auto">
             <h3 className="text-xs text-white/40 mb-4 px-2 italic uppercase">Hunted Leads List</h3>
             <table className="w-full text-left text-sm">
                <tr className="text-white/20 text-[10px] uppercase border-b border-white/5">
                  <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Company</th>
                </tr>
                {leads.map((l, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-bold text-[#00ffcc]">{l.lead_name}</td>
                    <td className="p-4">{l.lead_email}</td>
                    <td className="p-4 text-xs italic">{l.company}</td>
                  </tr>
                ))}
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}