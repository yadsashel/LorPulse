import { supabase } from "./supabaseClient";

export const syncCustomNeural = async (email: string, key: string) => {
  // هادي ديال Enterprise، الخدمة فيها كتكون Deep
  await supabase.from('production_line').insert([{ 
    client_name: "Enterprise Client",
    client_email: email,
    current_task: "Neural Architecture Design",
    progress_percent: 10,
    status: "Queued"
  }]);
  
  // تقدر تزيد هنا أي API Integration logic مستقبلاً
};