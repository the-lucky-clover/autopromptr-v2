
import { supabase } from "@/integrations/supabase/client";
import { SecureEncryptionService } from "./secureEncryptionService";
import { useAuth } from "@/contexts/AuthContext";

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

export class EnhancedApiKeyService {
  private encryptionService: SecureEncryptionService;

  constructor(userId?: string, authToken?: string) {
    this.encryptionService = new SecureEncryptionService(userId, authToken);
  }

  async saveApiKey(providerId: string, apiKey: string, endpoint?: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Test the API key server-side first
      const isValid = await this.testApiKeyServerSide(providerId, apiKey, endpoint);
      if (!isValid) {
        throw new Error('Invalid API key or connection failed');
      }

      // Encrypt the API key with user-specific encryption
      const encryptedApiKey = this.encryptionService.encryptSensitiveData(apiKey);

      // Upsert the credential with encrypted data
      const { error } = await supabase
        .from('api_credentials')
        .upsert({
          user_id: user.user.id,
          platform_id: providerId,
          api_key: encryptedApiKey,
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

  // Test API key server-side using edge function for security
  async testApiKeyServerSide(providerId: string, apiKey: string, endpoint?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('api-key-validator', {
        body: {
          providerId,
          apiKey,
          endpoint
        }
      });

      if (error) {
        console.error('API key test failed:', error);
        return false;
      }

      return data?.isValid || false;
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }

  async getUserApiKeys(): Promise<Array<{ providerId: string; isValid: boolean; createdAt: string; maskedKey: string }>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('api_credentials')
        .select('platform_id, is_valid, created_at, api_key')
        .eq('user_id', user.user.id);

      if (error) throw error;

      return data.map(cred => {
        let maskedKey = '****';
        try {
          const decryptedKey = this.encryptionService.decryptSensitiveData(cred.api_key);
          maskedKey = this.encryptionService.maskSensitiveData(decryptedKey);
        } catch (error) {
          console.error('Failed to decrypt API key for masking:', error);
        }

        return {
          providerId: cred.platform_id,
          isValid: cred.is_valid,
          createdAt: cred.created_at,
          maskedKey
        };
      });
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

export const createEnhancedApiKeyService = (userId?: string, authToken?: string) => {
  return new EnhancedApiKeyService(userId, authToken);
};
