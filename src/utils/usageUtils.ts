
export interface UsageLimits {
  prompts: number;
  ai_optimizations: number;
  batch_extraction_chars: number;
  batch_extractions: number;
  api_calls: number;
  executions: number;
  tokens: number;
}

export interface CurrentUsage {
  prompts: number;
  ai_optimizations: number;
  batch_extraction_chars: number;
  batch_extractions: number;
  api_calls: number;
  executions_count: number;
  tokens_used: number;
}

export const getUsageLimitsForPlan = (planName: string): UsageLimits => {
  switch (planName.toLowerCase()) {
    case 'free':
      return {
        prompts: 10,
        ai_optimizations: 0,
        batch_extraction_chars: 1000,
        batch_extractions: 5,
        api_calls: 100,
        executions: 10,
        tokens: 1000,
      };
    case 'pro':
      return {
        prompts: 500,
        ai_optimizations: 100,
        batch_extraction_chars: 50000,
        batch_extractions: 100,
        api_calls: 5000,
        executions: 500,
        tokens: 100000,
      };
    case 'enterprise':
      return {
        prompts: -1, // unlimited
        ai_optimizations: -1,
        batch_extraction_chars: -1,
        batch_extractions: -1,
        api_calls: -1,
        executions: -1,
        tokens: -1,
      };
    default:
      return getUsageLimitsForPlan('free');
  }
};

export const formatUsageValue = (value: number, isUnlimited: boolean = false): string => {
  if (isUnlimited || value === -1) {
    return 'Unlimited';
  }
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toString();
};

export const calculateUsagePercentage = (current: number, limit: number): number => {
  if (limit === -1) return 0; // unlimited
  if (limit === 0) return 100;
  return Math.min((current / limit) * 100, 100);
};

export const getUsageColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 75) return 'text-yellow-600';
  return 'text-green-600';
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-yellow-500';
  return 'bg-blue-500';
};
