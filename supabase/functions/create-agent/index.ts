import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { 
      name, 
      bio, 
      lore, 
      modelProvider, 
      clients,
      settings,
      topics,
      adjectives,
      style
    } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: agentData, error: agentError } = await supabaseClient
      .from('agents')
      .insert({
        name,
        creator_id: user.id,
        status: 'active',
        description: bio,
        configuration: {
          bio,
          lore,
          style,
        },
        ai_provider: modelProvider,
        ai_model: settings?.model,
        embedding_model: settings?.embeddingModel,
        voice_settings: settings?.voice || {},
        clients: clients || [],
        topics: topics || [],
        adjectives: adjectives || [],
        style_guidelines: style || {
          all: [],
          chat: [],
          post: []
        },
        system_prompt: Array.isArray(lore) ? lore.join('\n') : lore || '',
      })
      .select()
      .single();

    if (agentError) {
      throw agentError;
    }

    return new Response(
      JSON.stringify({ agent: agentData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});