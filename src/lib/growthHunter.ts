import { supabase } from "./supabaseClient";

export const syncGrowthHunter = async (email: string, key: string, userMsg: string) => {
  // 1. تسجل الكليان فـ طابلو الـ Clients
  const { data: nClient } = await supabase.from('clients').upsert([{ 
    business_name: "Growth Partner", 
    website_url: email, 
    api_key: key 
  }], { onConflict: 'website_url' }).select().single();

  if (nClient) {
    // 2. تزيدو فـ الـ Production Line باش يبدا الـ Scraper
    await supabase.from('production_line').insert([{ 
      client_name: "Growth Hunter Client",
      client_email: email,
      current_task: "Setting up LinkedIn Scraper",
      progress_percent: 25,
      status: "In Progress"
    }]);
    
    // 3. تقيد الـ Lead فـ السيستيم
    await supabase.from('leads').insert([{ 
      client_id: nClient.id, 
      email: email, 
      plan_selected: "Growth Hunter" 
    }]);
  }
};