import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS (بش يخدم البوت فـ أي سيت بلا مشاكل)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // هادا الساروت الكبير باش نتحكمو فـ الداتا سيكيور
    )

    const { email, apiKey, metadata, type } = await req.json()

    // 2. التحقق من الـ API Key (Security Check)
    const { data: client, error: authError } = await supabase
      .from('clients')
      .select('id, business_name')
      .eq('api_key', apiKey)
      .single()

    if (authError || !client) {
      throw new Error('Unauthorized: Invalid API Key')
    }

    // 3. تقييد الـ Lead فـ السوبابيس
    const { error: leadError } = await supabase
      .from('leads')
      .insert({
        client_id: client.id,
        email: email,
        metadata: metadata
      })

    if (leadError) throw leadError

    // 4. صيفط الـ Roadmap عبر Brevo (Automation)
    // غانعيطو لـ Brevo API هنا نيشان بـ الـ API Key ديالك
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': Deno.env.get('BREVO_API_KEY') ?? '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'LorPulse Lead Architect', email: 'official@lorpulse.com' },
        to: [{ email: email }],
        templateId: 1, // الـ Template اللي صاوبنا قبيلة
        params: { BUSINESS_NAME: client.business_name }
      })
    })

    return new Response(JSON.stringify({ success: true, message: 'Neural Sync Complete' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})