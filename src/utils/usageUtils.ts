
// Type definitions for usage limits and current usage
export interface UsageLimits {
  api_calls: number;
  executions: number;
  tokens: number;
}

export interface CurrentUsage {
  api_calls: number;
  executions_count: number;
  tokens_used: number;
}

// Safely parse usage limits with proper type checking
export const parseUsageLimits = (limits: any): UsageLimits => {
  const defaultLimits = { api_calls: 1000, executions: 100, tokens: 10000 };
  
  if (!limits) return defaultLimits;
  
  try {
    // Check if usage_limits is already an object
    if (typeof limits === 'object' && limits !== null && !Array.isArray(limits)) {
      return {
        api_calls: typeof limits.api_calls === 'number' ? limits.api_calls : defaultLimits.api_calls,
        executions: typeof limits.executions === 'number' ? limits.executions : defaultLimits.executions,
        tokens: typeof limits.tokens === 'number' ? limits.tokens : defaultLimits.tokens,
      };
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof limits === 'string') {
      const parsed = JSON.parse(limits);
      return {
        api_calls: typeof parsed.api_calls === 'number' ? parsed.api_calls : defaultLimits.api_calls,
        executions: typeof parsed.executions === 'number' ? parsed.executions : defaultLimits.executions,
        tokens: typeof parsed.tokens === 'number' ? parsed.tokens : defaultLimits.tokens,
      };
    }
    
    return defaultLimits;
  } catch {
    return defaultLimits;
  }
};

// Safely parse current usage
export const parseCurrentUsage = (usage: any): CurrentUsage => {
  const defaultUsage = { api_calls: 0, executions_count: 0, tokens_used: 0 };
  
  if (!usage) return defaultUsage;
  
  return {
    api_calls: typeof usage.api_calls === 'number' ? usage.api_calls : 0,
    executions_count: typeof usage.executions_count === 'number' ? usage.executions_count : 0,
    tokens_used: typeof usage.tokens_used === 'number' ? usage.tokens_used : 0,
  };
};
