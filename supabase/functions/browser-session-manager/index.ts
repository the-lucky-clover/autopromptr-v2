
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SessionConfig {
  headless: boolean;
  viewport?: { width: number; height: number };
  userAgent?: string;
  timeout: number;
}

const sessions = new Map<string, any>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (method === 'POST' && path.endsWith('/create')) {
      const config: SessionConfig = await req.json();
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      sessions.set(sessionId, {
        id: sessionId,
        config,
        created: new Date(),
        lastActivity: new Date()
      });

      console.log(`Created browser session: ${sessionId}`);

      return new Response(JSON.stringify({ 
        success: true, 
        sessionId,
        config 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      const sessionId = path.split('/').pop();
      const session = sessions.get(sessionId);
      
      if (!session) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Session not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        session: {
          id: session.id,
          created: session.created,
          lastActivity: session.lastActivity,
          isActive: true
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (method === 'DELETE') {
      const sessionId = path.split('/').pop();
      const deleted = sessions.delete(sessionId);
      
      console.log(`Deleted browser session: ${sessionId}`);

      return new Response(JSON.stringify({ 
        success: deleted,
        message: deleted ? 'Session deleted' : 'Session not found'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Session manager error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
