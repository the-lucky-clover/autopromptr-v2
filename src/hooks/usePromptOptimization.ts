
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OptimizationResult {
  optimized_prompt: string;
  provider: string;
  cost_estimate: number;
  quality_improvement: number;
}

interface OptimizationOptions {
  platform_target?: string;
  optimization_level?: 'conservative' | 'balanced' | 'aggressive';
  user_provider?: string;
}

export const usePromptOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const optimizePrompt = async (
    prompt: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizationResult | null> => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please provide a prompt to optimize",
        variant: "destructive",
      });
      return null;
    }

    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-prompt-optimizer', {
        body: {
          prompt,
          platform_target: options.platform_target,
          optimization_level: options.optimization_level || 'balanced',
          user_provider: options.user_provider,
        },
      });

      if (error) throw error;

      // Handle fallback optimization
      if (data.fallback_optimization) {
        toast({
          title: "Basic Optimization Applied",
          description: "AI features are disabled. Using basic optimization instead.",
          variant: "default",
        });
        return {
          optimized_prompt: data.fallback_optimization,
          provider: 'basic',
          cost_estimate: 0,
          quality_improvement: 0.1,
        };
      }

      toast({
        title: "Optimization Complete",
        description: `Quality improved by ${(data.quality_improvement * 100).toFixed(1)}% using ${data.provider}`,
      });

      return data;
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize prompt",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  const getOptimizationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_optimization_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get optimization history:', error);
      return [];
    }
  };

  return {
    optimizePrompt,
    getOptimizationHistory,
    isOptimizing,
  };
};
