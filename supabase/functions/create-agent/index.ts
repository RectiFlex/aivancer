import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, bio, lore, style, modelProvider } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader?.replace('Bearer ', '') ?? ''
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Create agent in database
    const { data: agentData, error: agentError } = await supabaseClient
      .from('agents')
      .insert({
        name,
        creator_id: user.id,
        status: 'active',
        configuration: {
          bio,
          lore,
          style,
        },
        ai_provider: modelProvider,
        system_prompt: lore || '',
      })
      .select()
      .single();

    if (agentError) throw agentError;

    return new Response(
      JSON.stringify({ agent: agentData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});