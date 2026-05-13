import { supabase } from "./supabaseClient";

export const syncGrowthHunter = async (email: string, key: string, niche: string) => {
  const SERPER_KEY = import.meta.env.VITE_SERPER_API_KEY;

  // هاد الـ Query دابا كتسرح فـ الإنترنت كاملة
  const query = `("${niche}") AND ("email" OR "contact") AND ("@gmail.com" OR "@*" ".ai" OR "@*" ".com" OR "@*" ".io")`;

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": SERPER_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 100 }) // 100 نتيجة باش نكبروا الحصيلة
    });

    const data = await response.json();
    
    if (data.organic) {
      const leads = data.organic.map((item: any) => {
        // البحث عن أي إيميل كيفما كان نوعو وسط الـ Snippet
        const emailMatch = item.snippet.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        
        return {
          api_key: key,
          lead_name: item.title.split('-')[0].split('|')[0].trim(),
          lead_email: emailMatch ? emailMatch[0] : null,
          company: niche,
          lead_linkedin: item.link.includes('linkedin.com') ? item.link : null,
          status: 'pending'
        };
      }).filter((l: any) => l.lead_email !== null);

      if (leads.length > 0) {
        await supabase.from('leads_found').insert(leads);
      }
      return { success: true, count: leads.length };
    }
  } catch (err) {
    console.error("The Hunter System Failed:", err);
  }
};