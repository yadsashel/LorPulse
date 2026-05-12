import { supabase } from "./supabaseClient";

export const syncCustomNeural = async (email: string, key: string) => {
  const { error } = await supabase.from('custom_leads').insert([
    { client_email: email, api_key: key, status: 'awaiting_integration' }
  ]);
  if (error) console.error("Custom Sync Fail:", error);
};