
import { browserEngineManager } from './browserEngineManager';
import { LovableAdapter } from '../adapters/lovableAdapter';
import { BasePlatformAdapter } from '../adapters/basePlatformAdapter';
import { errorHandlingService, ErrorCategory, ErrorSeverity } from './errorHandlingService';
import { recoveryService } from './recoveryService';

export interface AutomationConfig {
  platform: string;
  headless: boolean;
  maxConcurrency: number;
  retryAttempts: number;
  humanLikeDelay: boolean;
}

export interface PromptExecutionResult {
  success: boolean;
  promptId: string;
  platform: string;
  response?: string;
  projectUrl?: string;
  error?: string;
  executionTime: number;
  screenshots?: string[];
  correlationId?: string;
}

export class BrowserAutomationService {
  private static instance: BrowserAutomationService;
  private activeAdapters: Map<string, BasePlatformAdapter> = new Map();
  private executionQueue: Array<{ promptId: string; prompt: string; platform: string }> = [];
  private isProcessing: boolean = false;

  public static getInstance(): BrowserAutomationService {
    if (!BrowserAutomationService.instance) {
      BrowserAutomationService.instance = new BrowserAutomationService();
    }
    return BrowserAutomationService.instance;
  }

  async executePrompt(
    promptId: string, 
    prompt: string, 
    platform: string = 'lovable',
    config: Partial<AutomationConfig> = {}
  ): Promise<PromptExecutionResult> {
    const correlationId = errorHandlingService.generateCorrelationId();
    const startTime = Date.now();
    const defaultConfig: AutomationConfig = {
      platform,
      headless: true,
      maxConcurrency: 3,
      retryAttempts: 2,
      humanLikeDelay: true,
      ...config
    };

    console.log(`Starting prompt execution ${correlationId} for ${promptId} on ${platform}`);

    try {
      return await recoveryService.executeWithRetry(
        async () => {
          const adapter = await this.getOrCreateAdapter(platform, defaultConfig);
          
          // Submit the prompt
          const submitResult = await adapter.submitPrompt(prompt);
          if (!submitResult.success) {
            throw new Error(submitResult.error || 'Failed to submit prompt');
          }

          // Wait for completion with timeout
          const completionResult = await Promise.race([
            adapter.waitForCompletion(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Operation timeout')), 300000) // 5 minutes
            )
          ]);

          if (!completionResult.success) {
            throw new Error(completionResult.error || 'Processing failed');
          }

          // Extract the result
          const extractResult = await adapter.extractResult();
          let projectUrl: string | undefined;

          // Try to extract project URL if it's Lovable
          if (platform === 'lovable') {
            const urlResult = await (adapter as LovableAdapter).extractProjectUrl();
            if (urlResult.success) {
              projectUrl = urlResult.data.projectUrl;
            }
          }

          const executionTime = Date.now() - startTime;

          return {
            success: true,
            promptId,
            platform,
            response: extractResult.data?.response,
            projectUrl,
            executionTime,
            screenshots: extractResult.data?.screenshots,
            correlationId
          };
        },
        {
          maxAttempts: defaultConfig.retryAttempts + 1,
          baseDelay: 2000,
          maxDelay: 30000,
          backoffFactor: 2,
          retryableErrors: ['TimeoutError', 'BrowserError', 'NetworkError']
        },
        {
          service: platform,
          operation: 'executePrompt'
        }
      );

    } catch (error) {
      console.error(`Prompt execution failed for ${promptId}:`, error);
      
      // Report error with detailed context
      await errorHandlingService.reportError(
        error as Error,
        ErrorCategory.BROWSER,
        ErrorSeverity.HIGH,
        {
          correlationId,
          operation: 'executePrompt',
          platform,
          metadata: {
            promptId,
            executionTime: Date.now() - startTime,
            config: defaultConfig
          }
        }
      );

      // Attempt recovery
      const recoverySuccessful = await recoveryService.recoverBrowserSession(promptId, platform);
      
      return {
        success: false,
        promptId,
        platform,
        error: error.message,
        executionTime: Date.now() - startTime,
        correlationId,
        ...(recoverySuccessful && { recovered: true })
      };
    }
  }

  async executeBatch(
    prompts: Array<{ id: string; content: string; platform?: string }>,
    config: Partial<AutomationConfig> = {}
  ): Promise<PromptExecutionResult[]> {
    const correlationId = errorHandlingService.generateCorrelationId();
    console.log(`Starting batch execution ${correlationId} of ${prompts.length} prompts`);
    
    try {
      return await recoveryService.executeWithFallback(
        // Primary batch execution
        async () => {
          const results: PromptExecutionResult[] = [];
          const maxConcurrency = config.maxConcurrency || 3;
          
          // Process prompts in batches to respect concurrency limits
          for (let i = 0; i < prompts.length; i += maxConcurrency) {
            const batch = prompts.slice(i, i + maxConcurrency);
            
            const batchPromises = batch.map(prompt => 
              this.executePrompt(
                prompt.id, 
                prompt.content, 
                prompt.platform || 'lovable',
                config
              )
            );

            const batchResults = await Promise.allSettled(batchPromises);
            
            for (const result of batchResults) {
              if (result.status === 'fulfilled') {
                results.push(result.value);
              } else {
                results.push({
                  success: false,
                  promptId: 'unknown',
                  platform: 'unknown',
                  error: String(result.reason),
                  executionTime: 0,
                  correlationId
                });
              }
            }

            // Add delay between batches if human-like delay is enabled
            if (config.humanLikeDelay && i + maxConcurrency < prompts.length) {
              const delay = Math.floor(Math.random() * 5000) + 2000; // 2-7 seconds
              console.log(`Waiting ${delay}ms before next batch`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }

          console.log(`Batch execution completed. Success rate: ${results.filter(r => r.success).length}/${results.length}`);
          return results;
        },
        // Fallback batch execution with simplified processing
        async () => {
          console.log('Executing fallback batch processing');
          const results: PromptExecutionResult[] = [];
          
          // Sequential processing as fallback
          for (const prompt of prompts) {
            try {
              const result = await this.executePrompt(
                prompt.id,
                prompt.content,
                prompt.platform || 'lovable',
                { ...config, maxConcurrency: 1, retryAttempts: 1 }
              );
              results.push(result);
            } catch (error) {
              results.push({
                success: false,
                promptId: prompt.id,
                platform: prompt.platform || 'lovable',
                error: error.message,
                executionTime: 0,
                correlationId
              });
            }
          }
          
          return results;
        },
        {
          service: 'browser_automation',
          operation: 'executeBatch'
        }
      );

    } catch (error) {
      // Report batch execution failure
      await errorHandlingService.reportError(
        error as Error,
        ErrorCategory.SYSTEM,
        ErrorSeverity.CRITICAL,
        {
          correlationId,
          operation: 'executeBatch',
          metadata: {
            promptCount: prompts.length,
            config
          }
        }
      );

      throw error;
    }
  }

  private async getOrCreateAdapter(platform: string, config: AutomationConfig): Promise<BasePlatformAdapter> {
    const adapterKey = `${platform}_${Date.now()}`;
    
    let adapter: BasePlatformAdapter;
    
    try {
      switch (platform.toLowerCase()) {
        case 'lovable':
          adapter = new LovableAdapter();
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      await adapter.initialize(config.headless);
      this.activeAdapters.set(adapterKey, adapter);

      // Cleanup adapter after some time to prevent memory leaks
      setTimeout(async () => {
        try {
          await adapter.cleanup();
          this.activeAdapters.delete(adapterKey);
        } catch (cleanupError) {
          console.error('Adapter cleanup error:', cleanupError);
        }
      }, 300000); // 5 minutes

      return adapter;

    } catch (error) {
      await errorHandlingService.reportError(
        error as Error,
        ErrorCategory.BROWSER,
        ErrorSeverity.HIGH,
        {
          correlationId: errorHandlingService.generateCorrelationId(),
          operation: 'getOrCreateAdapter',
          platform,
          metadata: { config }
        }
      );
      
      throw error;
    }
  }

  async getEngineStatus(): Promise<{
    activeSessions: number;
    queueLength: number;
    isProcessing: boolean;
    engines: { playwright: boolean; puppeteer: boolean };
    health: {
      playwright: string;
      puppeteer: string;
      overall: string;
    };
  }> {
    try {
      const activeSessions = browserEngineManager.getActiveSessions();
      
      return {
        activeSessions: activeSessions.length,
        queueLength: this.executionQueue.length,
        isProcessing: this.isProcessing,
        engines: {
          playwright: true, // Always available in our setup
          puppeteer: true   // Always available in our setup
        },
        health: {
          playwright: 'healthy', // This would be determined by health checks
          puppeteer: 'healthy',  // This would be determined by health checks
          overall: 'healthy'
        }
      };
    } catch (error) {
      await errorHandlingService.reportError(
        error as Error,
        ErrorCategory.SYSTEM,
        ErrorSeverity.MEDIUM,
        {
          correlationId: errorHandlingService.generateCorrelationId(),
          operation: 'getEngineStatus'
        }
      );
      
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    const correlationId = errorHandlingService.generateCorrelationId();
    console.log(`Cleaning up browser automation service ${correlationId}`);
    
    try {
      // Cleanup all active adapters
      const cleanupPromises = Array.from(this.activeAdapters.values()).map(
        adapter => adapter.cleanup().catch(error => {
          console.error('Individual adapter cleanup failed:', error);
        })
      );
      
      await Promise.allSettled(cleanupPromises);
      this.activeAdapters.clear();
      
      // Cleanup browser engine manager
      await browserEngineManager.cleanup();
      
      console.log(`Browser automation service cleanup completed ${correlationId}`);
    } catch (error) {
      await errorHandlingService.reportError(
        error as Error,
        ErrorCategory.SYSTEM,
        ErrorSeverity.MEDIUM,
        {
          correlationId,
          operation: 'cleanup'
        }
      );
      
      throw error;
    }
  }
}

export const browserAutomationService = BrowserAutomationService.getInstance();
