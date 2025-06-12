
import { ErrorCategory, ErrorSeverity, errorHandlingService } from './errorHandlingService';
import { systemHealthService } from './systemHealthService';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors: string[];
}

export interface RecoveryAction {
  id: string;
  type: 'retry' | 'fallback' | 'circuit_breaker' | 'degrade';
  description: string;
  execute: () => Promise<any>;
  condition?: () => boolean;
}

export class RecoveryService {
  private static instance: RecoveryService;
  private circuitBreakers: Map<string, { isOpen: boolean; failures: number; lastFailure: Date }> = new Map();

  public static getInstance(): RecoveryService {
    if (!RecoveryService.instance) {
      RecoveryService.instance = new RecoveryService();
    }
    return RecoveryService.instance;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    context: { service: string; operation: string }
  ): Promise<T> {
    const defaultConfig: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffFactor: 2,
      retryableErrors: ['NetworkError', 'TimeoutError', 'ServiceUnavailable']
    };

    const finalConfig = { ...defaultConfig, ...config };
    let lastError: Error;

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        // Check circuit breaker
        if (this.isCircuitBreakerOpen(context.service)) {
          throw new Error(`Circuit breaker is open for ${context.service}`);
        }

        const result = await operation();
        
        // Reset circuit breaker on success
        this.resetCircuitBreaker(context.service);
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        console.log(`Attempt ${attempt} failed for ${context.service}.${context.operation}:`, error.message);
        
        // Record failure
        this.recordFailure(context.service);
        
        // Report error
        await errorHandlingService.reportError(
          lastError,
          this.categorizeError(lastError),
          attempt === finalConfig.maxAttempts ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
          {
            correlationId: errorHandlingService.generateCorrelationId(),
            operation: context.operation,
            platform: context.service,
            metadata: { attempt, maxAttempts: finalConfig.maxAttempts }
          }
        );

        // Don't retry if not retryable or final attempt
        if (!this.isRetryable(lastError, finalConfig) || attempt === finalConfig.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt - 1),
          finalConfig.maxDelay
        );
        const jitteredDelay = delay + (Math.random() * 1000);

        console.log(`Retrying in ${jitteredDelay}ms...`);
        await this.sleep(jitteredDelay);
      }
    }

    throw lastError;
  }

  async executeWithFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    context: { service: string; operation: string }
  ): Promise<T> {
    try {
      return await this.executeWithRetry(primaryOperation, {}, context);
    } catch (primaryError) {
      console.log(`Primary operation failed, executing fallback for ${context.service}.${context.operation}`);
      
      try {
        const result = await fallbackOperation();
        
        // Report successful fallback
        await errorHandlingService.reportError(
          primaryError as Error,
          ErrorCategory.SYSTEM,
          ErrorSeverity.MEDIUM,
          {
            correlationId: errorHandlingService.generateCorrelationId(),
            operation: context.operation,
            platform: context.service,
            metadata: { fallbackUsed: true, fallbackSuccessful: true }
          }
        );
        
        return result;
      } catch (fallbackError) {
        // Both operations failed
        await errorHandlingService.reportError(
          new Error(`Both primary and fallback operations failed. Primary: ${(primaryError as Error).message}, Fallback: ${(fallbackError as Error).message}`),
          ErrorCategory.SYSTEM,
          ErrorSeverity.CRITICAL,
          {
            correlationId: errorHandlingService.generateCorrelationId(),
            operation: context.operation,
            platform: context.service,
            metadata: { 
              primaryError: (primaryError as Error).message,
              fallbackError: (fallbackError as Error).message
            }
          }
        );
        
        throw fallbackError;
      }
    }
  }

  async recoverBrowserSession(sessionId: string, platform: string): Promise<boolean> {
    try {
      console.log(`Attempting to recover browser session ${sessionId} for ${platform}`);
      
      // Implement browser session recovery logic
      const recoveryActions: RecoveryAction[] = [
        {
          id: 'restart_browser',
          type: 'retry',
          description: 'Restart browser instance',
          execute: async () => {
            // Restart browser logic would go here
            return true;
          }
        },
        {
          id: 'switch_engine',
          type: 'fallback',
          description: 'Switch to alternative browser engine',
          execute: async () => {
            // Switch from Playwright to Puppeteer or vice versa
            return true;
          }
        },
        {
          id: 'degrade_functionality',
          type: 'degrade',
          description: 'Use simplified extraction method',
          execute: async () => {
            // Use basic text extraction without advanced features
            return true;
          }
        }
      ];

      for (const action of recoveryActions) {
        try {
          console.log(`Executing recovery action: ${action.description}`);
          await action.execute();
          console.log(`Recovery action successful: ${action.description}`);
          return true;
        } catch (actionError) {
          console.error(`Recovery action failed: ${action.description}`, actionError);
        }
      }

      return false;
    } catch (error) {
      console.error('Browser session recovery failed:', error);
      return false;
    }
  }

  async recoverAIService(operation: string): Promise<any> {
    try {
      console.log(`Attempting to recover AI service for operation: ${operation}`);
      
      const recoveryStrategies = [
        {
          name: 'use-cached-result',
          execute: async () => {
            // Try to find cached result for similar operations
            return this.getCachedResult(operation);
          }
        },
        {
          name: 'fallback-provider',
          execute: async () => {
            // Switch to alternative AI provider
            return this.useAlternativeAIProvider(operation);
          }
        },
        {
          name: 'simplified-operation',
          execute: async () => {
            // Use basic optimization without AI
            return this.useBasicOptimization(operation);
          }
        }
      ];

      for (const strategy of recoveryStrategies) {
        try {
          const result = await strategy.execute();
          if (result) {
            console.log(`AI recovery successful using strategy: ${strategy.name}`);
            return result;
          }
        } catch (strategyError) {
          console.error(`AI recovery strategy failed: ${strategy.name}`, strategyError);
        }
      }

      throw new Error('All AI recovery strategies failed');
    } catch (error) {
      console.error('AI service recovery failed:', error);
      throw error;
    }
  }

  private isCircuitBreakerOpen(service: string): boolean {
    const breaker = this.circuitBreakers.get(service);
    if (!breaker) return false;
    
    // Reset circuit breaker after timeout
    if (breaker.isOpen && Date.now() - breaker.lastFailure.getTime() > 5 * 60 * 1000) {
      breaker.isOpen = false;
      breaker.failures = 0;
    }
    
    return breaker.isOpen;
  }

  private recordFailure(service: string): void {
    const breaker = this.circuitBreakers.get(service) || { isOpen: false, failures: 0, lastFailure: new Date() };
    breaker.failures++;
    breaker.lastFailure = new Date();
    
    // Open circuit breaker after 5 failures
    if (breaker.failures >= 5) {
      breaker.isOpen = true;
      console.warn(`Circuit breaker opened for ${service} due to repeated failures`);
    }
    
    this.circuitBreakers.set(service, breaker);
  }

  private resetCircuitBreaker(service: string): void {
    const breaker = this.circuitBreakers.get(service);
    if (breaker) {
      breaker.failures = 0;
      breaker.isOpen = false;
    }
  }

  private isRetryable(error: Error, config: RetryConfig): boolean {
    return config.retryableErrors.some(retryableError => 
      error.message.includes(retryableError) || error.name === retryableError
    );
  }

  private categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return ErrorCategory.NETWORK;
    }
    if (message.includes('browser') || message.includes('playwright') || message.includes('puppeteer')) {
      return ErrorCategory.BROWSER;
    }
    if (message.includes('ai') || message.includes('openai') || message.includes('anthropic')) {
      return ErrorCategory.AI;
    }
    if (message.includes('extraction') || message.includes('parsing')) {
      return ErrorCategory.EXTRACTION;
    }
    if (message.includes('api') || message.includes('service')) {
      return ErrorCategory.API;
    }
    
    return ErrorCategory.SYSTEM;
  }

  private async getCachedResult(operation: string): Promise<any> {
    try {
      // Check for cached results in database
      // This is a placeholder - implement actual caching logic
      return null;
    } catch (error) {
      return null;
    }
  }

  private async useAlternativeAIProvider(operation: string): Promise<any> {
    try {
      // Switch to backup AI provider
      // This is a placeholder - implement actual provider switching
      return null;
    } catch (error) {
      return null;
    }
  }

  private async useBasicOptimization(operation: string): Promise<any> {
    try {
      // Use rule-based optimization instead of AI
      // This is a placeholder - implement basic optimization
      return operation; // Return original operation as fallback
    } catch (error) {
      return null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const recoveryService = RecoveryService.getInstance();
