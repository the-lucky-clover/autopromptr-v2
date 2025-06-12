
import { browserEngineManager } from './browserEngineManager';
import { LovableAdapter } from '../adapters/lovableAdapter';
import { BasePlatformAdapter } from '../adapters/basePlatformAdapter';

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
    const startTime = Date.now();
    const defaultConfig: AutomationConfig = {
      platform,
      headless: true,
      maxConcurrency: 3,
      retryAttempts: 2,
      humanLikeDelay: true,
      ...config
    };

    console.log(`Starting prompt execution for ${promptId} on ${platform}`);

    try {
      const adapter = await this.getOrCreateAdapter(platform, defaultConfig);
      
      // Submit the prompt
      const submitResult = await adapter.submitPrompt(prompt);
      if (!submitResult.success) {
        throw new Error(submitResult.error || 'Failed to submit prompt');
      }

      // Wait for completion
      const completionResult = await adapter.waitForCompletion();
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
        screenshots: extractResult.data?.screenshots
      };

    } catch (error) {
      console.error(`Prompt execution failed for ${promptId}:`, error);
      
      return {
        success: false,
        promptId,
        platform,
        error: String(error),
        executionTime: Date.now() - startTime
      };
    }
  }

  async executeBatch(
    prompts: Array<{ id: string; content: string; platform?: string }>,
    config: Partial<AutomationConfig> = {}
  ): Promise<PromptExecutionResult[]> {
    console.log(`Starting batch execution of ${prompts.length} prompts`);
    
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
            executionTime: 0
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
  }

  private async getOrCreateAdapter(platform: string, config: AutomationConfig): Promise<BasePlatformAdapter> {
    const adapterKey = `${platform}_${Date.now()}`;
    
    let adapter: BasePlatformAdapter;
    
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
      await adapter.cleanup();
      this.activeAdapters.delete(adapterKey);
    }, 300000); // 5 minutes

    return adapter;
  }

  async getEngineStatus(): Promise<{
    activeSessions: number;
    queueLength: number;
    isProcessing: boolean;
    engines: { playwright: boolean; puppeteer: boolean };
  }> {
    const activeSessions = browserEngineManager.getActiveSessions();
    
    return {
      activeSessions: activeSessions.length,
      queueLength: this.executionQueue.length,
      isProcessing: this.isProcessing,
      engines: {
        playwright: true, // Always available in our setup
        puppeteer: true   // Always available in our setup
      }
    };
  }

  async cleanup(): Promise<void> {
    console.log('Cleaning up browser automation service');
    
    // Cleanup all active adapters
    const cleanupPromises = Array.from(this.activeAdapters.values()).map(
      adapter => adapter.cleanup()
    );
    
    await Promise.allSettled(cleanupPromises);
    this.activeAdapters.clear();
    
    // Cleanup browser engine manager
    await browserEngineManager.cleanup();
    
    console.log('Browser automation service cleanup completed');
  }
}

export const browserAutomationService = BrowserAutomationService.getInstance();
