
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationRequest {
  prompt: string;
  platform_target?: string;
  optimization_level?: 'conservative' | 'balanced' | 'aggressive';
  user_provider?: string;
}

interface ProviderConfig {
  apiUrl: string;
  headers: (apiKey: string) => Record<string, string>;
  requestBody: (prompt: string, options: any) => any;
  parseResponse: (response: any) => string;
  estimateCost: (prompt: string) => number;
}

const providerConfigs: Record<string, ProviderConfig> = {
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    requestBody: (prompt: string, options: any) => ({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert prompt optimizer. Optimize the following prompt for ${options.platform_target || 'general use'} with ${options.optimization_level || 'balanced'} optimization level. Make it more specific, actionable, and effective while preserving the original intent.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    }),
    parseResponse: (response: any) => response.choices[0].message.content,
    estimateCost: (prompt: string) => Math.ceil(prompt.length / 100) * 0.0001,
  },
  google: {
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    }),
    requestBody: (prompt: string, options: any) => ({
      contents: [{
        parts: [{
          text: `Optimize this prompt for ${options.platform_target || 'general use'} with ${options.optimization_level || 'balanced'} optimization: ${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    }),
    parseResponse: (response: any) => response.candidates[0].content.parts[0].text,
    estimateCost: (prompt: string) => Math.ceil(prompt.length / 100) * 0.00005,
  },
  anthropic: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    }),
    requestBody: (prompt: string, options: any) => ({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Optimize this prompt for ${options.platform_target || 'general use'} with ${options.optimization_level || 'balanced'} optimization level: ${prompt}`
      }]
    }),
    parseResponse: (response: any) => response.content[0].text,
    estimateCost: (prompt: string) => Math.ceil(prompt.length / 100) * 0.00008,
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { prompt, platform_target, optimization_level, user_provider }: OptimizationRequest = await req.json();

    // Check if user can use AI features
    const { data: canUseAI } = await supabaseClient.rpc('can_use_ai_features', { p_user_id: user.id });
    if (!canUseAI) {
      return new Response(JSON.stringify({ 
        error: 'AI features not enabled or usage quota exceeded',
        fallback_optimization: basicOptimization(prompt, platform_target)
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let optimizedPrompt = '';
    let provider = 'basic';
    let cost = 0;

    // Check for user's API credentials if they specified a provider
    if (user_provider && providerConfigs[user_provider]) {
      const { data: credentials } = await supabaseClient
        .from('api_credentials')
        .select('api_key, endpoint')
        .eq('user_id', user.id)
        .eq('platform_id', user_provider)
        .eq('is_valid', true)
        .single();

      if (credentials?.api_key) {
        const config = providerConfigs[user_provider];
        cost = config.estimateCost(prompt);

        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: config.headers(credentials.api_key),
          body: JSON.stringify(config.requestBody(prompt, { platform_target, optimization_level })),
        });

        if (response.ok) {
          const data = await response.json();
          optimizedPrompt = config.parseResponse(data);
          provider = user_provider;
        } else {
          throw new Error(`${user_provider} API error: ${response.statusText}`);
        }
      }
    }

    // Fallback to basic optimization if no provider configured
    if (!optimizedPrompt) {
      optimizedPrompt = basicOptimization(prompt, platform_target);
      provider = 'basic';
      cost = 0;
    }

    // Track usage
    await supabaseClient.rpc('track_ai_usage', {
      p_user_id: user.id,
      p_operation_type: 'optimization',
      p_tokens_consumed: Math.ceil(prompt.length / 4),
      p_cost_estimate: cost,
      p_success: true
    });

    // Save optimization history
    await supabaseClient
      .from('prompt_optimization_history')
      .insert({
        user_id: user.id,
        original_prompt: prompt,
        optimized_prompt: optimizedPrompt,
        optimization_type: provider,
        quality_score_before: calculateQualityScore(prompt),
        quality_score_after: calculateQualityScore(optimizedPrompt),
        platform_target: platform_target || null,
      });

    return new Response(JSON.stringify({
      optimized_prompt: optimizedPrompt,
      provider: provider,
      cost_estimate: cost,
      quality_improvement: calculateQualityScore(optimizedPrompt) - calculateQualityScore(prompt),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Optimization Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function basicOptimization(prompt: string, platform?: string): string {
  let optimized = prompt.trim();
  
  // Add action words if missing
  if (!/^(create|build|make|develop|implement|design|write|generate)/i.test(optimized)) {
    optimized = `Create ${optimized.toLowerCase()}`;
  }
  
  // Add platform-specific context
  if (platform && !optimized.toLowerCase().includes(platform)) {
    optimized += ` for ${platform}`;
  }
  
  // Add best practices reminder
  if (optimized.length < 100) {
    optimized += '. Follow modern best practices and ensure clean, maintainable code.';
  }
  
  return optimized;
}

function calculateQualityScore(prompt: string): number {
  let score = 0.5; // Base score
  
  // Length check
  if (prompt.length > 50 && prompt.length < 500) score += 0.1;
  
  // Action words
  if (/\b(create|build|make|develop|implement|design)\b/i.test(prompt)) score += 0.1;
  
  // Specificity
  if (/\b(component|function|page|feature|ui|interface)\b/i.test(prompt)) score += 0.1;
  
  // Technical context
  if (/\b(react|typescript|tailwind|responsive)\b/i.test(prompt)) score += 0.1;
  
  // Clear requirements
  if (prompt.includes('should') || prompt.includes('must') || prompt.includes('need')) score += 0.1;
  
  return Math.min(score, 1.0);
}
