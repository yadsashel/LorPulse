"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Lock, Zap, Download, Activity, Users, CreditCard, ShieldAlert } from "lucide-react";

export default function NeuralDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const unlockDashboard = async () => {
    setLoading(true);
    // كنجيبو الداتا بـ الـ API Key (Secret Code)
    const { data: bot, error } = await supabase
      .from('bot_configs')
      .select('*, leads(*)')
      .eq('api_key', passcode)
      .eq('status', 'active')
      .single();

    if (bot) {
      setData(bot);
      setIsAuthorized(true);
      sessionStorage.setItem("neural_token", passcode);
    } else {
      alert("INVALID OR INACTIVE NEURAL CODE");
    }
    setLoading(false);
  };

  // 1. شاشة الدخول (Access Control)
  if (!isAuthorized) {
    return (
      <div className="h-screen bg-[#020202] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md p-10 border border-white/5 bg-[#050505] rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(0,255,204,0.05)]">
          <div className="w-16 h-16 bg-[#00ffcc]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-[#00ffcc]" size={28} />
          </div>
          <h2 className="text-white text-xl font-black mb-2 uppercase tracking-tighter italic">Neural Authentication</h2>
          <p className="text-white/40 text-[10px] mb-8 tracking-widest">DECRYPT YOUR CONNECTION</p>
          <input 
            type="password" 
            placeholder="ENTER SECRET BRIDGE CODE"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-center text-[#00ffcc] font-mono outline-none focus:border-[#00ffcc]/50 transition-all mb-4"
            onChange={(e) => setPasscode(e.target.value)}
          />
          <button onClick={unlockDashboard} className="w-full py-4 bg-[#00ffcc] text-black font-black rounded-2xl hover:brightness-110 transition-all">
            {loading ? "INITIALIZING..." : "INITIALIZE ACCESS"}
          </button>
        </div>
      </div>
    );
  }

  // تشيك واش التاريخ سالا (من الكود القديم ديالك)
  const isExpired = data.expiry_date ? new Date(data.expiry_date) < new Date() : false;

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-end mb-16 border-b border-white/5 pb-8">
          <div>
            <p className="text-[#00ffcc] font-mono text-[10px] uppercase mb-2 tracking-[0.3em]">Neural Portal // Active</p>
            <h1 className="text-4xl font-black tracking-tighter uppercase">{data.client_email.split('@')[0]}</h1>
          </div>
          <div className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase ${isExpired ? "border-red-500 text-red-500" : "border-[#00ffcc] text-[#00ffcc]"}`}>
            {isExpired ? "Connection Suspended" : "Stable Connection"}
          </div>
        </header>

        {isExpired ? (
          /* شاشة الدفع إيلا سالا الاشتراك */
          <div className="bg-[#050505] border border-red-500/20 p-16 rounded-[3rem] text-center">
            <ShieldAlert size={64} className="text-red-500 mx-auto mb-6 opacity-20" />
            <h2 className="text-3xl font-black mb-4 uppercase">Neural Bridge Blocked</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">Your monthly access has reached its limit. All captured leads are secured but inaccessible.</p>
            <a href="#" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#00ffcc] transition-all">
              <CreditCard size={18} /> Reactivate via PayPal
            </a>
          </div>
        ) : (
          /* الـ Dashboard الحقيقية */
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-8 bg-[#050505] border border-white/5 rounded-[2.5rem]">
                <p className="text-[10px] text-white/40 uppercase mb-4 font-bold tracking-widest">Total Secured Leads</p>
                <div className="flex items-center gap-4">
                  <p className="text-6xl font-black tracking-tighter">{data.leads?.length || 0}</p>
                  <Users className="text-[#00ffcc]" size={32} />
                </div>
              </div>

              <div className="p-8 bg-[#050505] border border-white/5 rounded-[2.5rem]">
                <p className="text-[10px] text-white/40 uppercase mb-4 font-bold tracking-widest">Neural Infrastructure</p>
                <p className="text-2xl font-black text-[#00ffcc] uppercase italic">Growth Hunter</p>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ffcc] w-2/3 animate-pulse" />
                </div>
              </div>

              <div className="p-8 bg-[#050505] border border-white/5 rounded-[2.5rem] flex flex-col justify-between">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Data Export</p>
                <button className="flex items-center gap-2 text-[#00ffcc] font-black text-xs uppercase hover:underline">
                  <Download size={16} /> Download .CSV Log
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] text-white/30 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="p-8">Captured Intel</th>
                    <th className="p-8 text-right">Synchronization Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.leads?.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-8 font-mono text-[#00ffcc]">{lead.email}</td>
                      <td className="p-8 text-right text-white/40 font-mono text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}