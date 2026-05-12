import { supabase } from "./supabaseClient";

export const syncGrowthHunter = async (email: string, key: string, msg: string) => {
  const { error } = await supabase.from('growth_leads').insert([
    { client_email: email, api_key: key, initial_message: msg, status: 'hunting' }
  ]);
  if (error) console.error("Growth Sync Fail:", error);
};