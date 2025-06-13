
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client for authentication validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { providerId, apiKey, endpoint } = await req.json();

    if (!providerId || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test the API key based on provider
    let isValid = false;
    let errorMessage = '';

    try {
      switch (providerId) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 
              'Authorization': `Bearer ${apiKey}`,
              'User-Agent': 'AutoPromptr/1.0'
            }
          });
          isValid = openaiResponse.ok;
          if (!isValid) {
            errorMessage = `OpenAI API error: ${openaiResponse.status}`;
          }
          break;

        case 'google':
          const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
          );
          isValid = googleResponse.ok;
          if (!isValid) {
            errorMessage = `Google AI API error: ${googleResponse.status}`;
          }
          break;

        case 'anthropic':
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 10,
              messages: [{ role: 'user', content: 'test' }]
            })
          });
          isValid = anthropicResponse.status !== 401;
          if (!isValid) {
            errorMessage = `Anthropic API error: ${anthropicResponse.status}`;
          }
          break;

        case 'cohere':
          const cohereResponse = await fetch('https://api.cohere.ai/v1/models', {
            headers: { 
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          isValid = cohereResponse.ok;
          if (!isValid) {
            errorMessage = `Cohere API error: ${cohereResponse.status}`;
          }
          break;

        default:
          return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
      }
    } catch (error) {
      console.error(`API key validation failed for ${providerId}:`, error);
      isValid = false;
      errorMessage = error.message;
    }

    // Log the validation attempt (without logging the actual API key)
    console.log(`API key validation for ${providerId}: ${isValid ? 'SUCCESS' : 'FAILED'} - User: ${user.id}`);

    return new Response(JSON.stringify({ 
      isValid, 
      errorMessage: isValid ? null : errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API key validator error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      isValid: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
