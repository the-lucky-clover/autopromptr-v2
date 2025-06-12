
import { supabase } from "@/integrations/supabase/client";

export interface ApiProvider {
  id: string;
  name: string;
  description: string;
  keyLabel: string;
  testEndpoint?: string;
  costPerToken?: number;
  supportedFeatures: string[];
}

export const API_PROVIDERS: ApiProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models for advanced prompt optimization',
    keyLabel: 'OpenAI API Key',
    costPerToken: 0.00001,
    supportedFeatures: ['optimization', 'analysis', 'bulk_processing'],
  },
  {
    id: 'google',
    name: 'Google AI (Gemini)',
    description: 'Google\'s Gemini Pro for cost-effective optimization',
    keyLabel: 'Google AI API Key',
    costPerToken: 0.000005,
    supportedFeatures: ['optimization', 'bulk_processing'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    description: 'Claude Haiku for context-aware optimization',
    keyLabel: 'Anthropic API Key',
    costPerToken: 0.000008,
    supportedFeatures: ['optimization', 'analysis'],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: 'Semantic analysis and similarity detection',
    keyLabel: 'Cohere API Key',
    costPerToken: 0.000002,
    supportedFeatures: ['analysis', 'similarity'],
  },
];

export class ApiKeyService {
  async saveApiKey(providerId: string, apiKey: string, endpoint?: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Test the API key first
      const isValid = await this.testApiKey(providerId, apiKey, endpoint);
      if (!isValid) {
        throw new Error('Invalid API key or connection failed');
      }

      // Upsert the credential
      const { error } = await supabase
        .from('api_credentials')
        .upsert({
          user_id: user.user.id,
          platform_id: providerId,
          api_key: apiKey, // Supabase handles encryption
          endpoint: endpoint || null,
          is_valid: true,
        }, {
          onConflict: 'user_id,platform_id'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to save API key:', error);
      throw error;
    }
  }

  async testApiKey(providerId: string, apiKey: string, endpoint?: string): Promise<boolean> {
    try {
      const provider = API_PROVIDERS.find(p => p.id === providerId);
      if (!provider) return false;

      // Simple test calls for each provider
      switch (providerId) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });
          return openaiResponse.ok;

        case 'google':
          const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
          );
          return googleResponse.ok;

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
          return anthropicResponse.status !== 401;

        default:
          return false;
      }
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }

  async getUserApiKeys(): Promise<Array<{ providerId: string; isValid: boolean; createdAt: string }>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('api_credentials')
        .select('platform_id, is_valid, created_at')
        .eq('user_id', user.user.id);

      if (error) throw error;

      return data.map(cred => ({
        providerId: cred.platform_id,
        isValid: cred.is_valid,
        createdAt: cred.created_at,
      }));
    } catch (error) {
      console.error('Failed to get user API keys:', error);
      return [];
    }
  }

  async removeApiKey(providerId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('api_credentials')
        .delete()
        .eq('user_id', user.user.id)
        .eq('platform_id', providerId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to remove API key:', error);
      throw error;
    }
  }

  async getUsageStats(): Promise<{
    totalCost: number;
    operationsCount: number;
    remainingQuota: number;
  }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: usage } = await supabase
        .from('ai_usage_tracking')
        .select('cost_estimate, operation_type')
        .eq('user_id', user.user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('ai_usage_remaining')
        .eq('id', user.user.id)
        .single();

      const totalCost = usage?.reduce((sum, record) => sum + (record.cost_estimate || 0), 0) || 0;
      const operationsCount = usage?.length || 0;
      const remainingQuota = profile?.ai_usage_remaining || 0;

      return { totalCost, operationsCount, remainingQuota };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return { totalCost: 0, operationsCount: 0, remainingQuota: 0 };
    }
  }
}

export const apiKeyService = new ApiKeyService();
