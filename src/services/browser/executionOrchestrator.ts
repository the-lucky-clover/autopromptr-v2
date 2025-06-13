
import { BrowserClientProxy, BrowserConfig, BrowserOperationResult } from './browserClientProxy';
import { SessionManager } from './sessionManager';

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

export class ExecutionOrchestrator {
  private browserProxy: BrowserClientProxy;
  private sessionManager: SessionManager;

  constructor() {
    this.browserProxy = new BrowserClientProxy();
    this.sessionManager = new SessionManager();
  }

  async executePrompt(
    promptId: string,
    prompt: string,
    platform: string = 'lovable',
    config: Partial<BrowserConfig> = {}
  ): Promise<PromptExecutionResult> {
    const correlationId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    console.log(`Starting prompt execution ${correlationId} for ${promptId} on ${platform}`);

    try {
      // Use platform automation Edge Function
      const { data, error } = await supabase.functions.invoke('platform-automation', {
        body: {
          platform,
          prompt,
          config,
          correlationId
        }
      });

      if (error) throw error;

      const executionTime = Date.now() - startTime;

      return {
        success: data.success,
        promptId,
        platform,
        response: data.response,
        projectUrl: data.projectUrl,
        executionTime,
        correlationId
      };

    } catch (error) {
      console.error(`Prompt execution failed for ${promptId}:`, error);
      
      return {
        success: false,
        promptId,
        platform,
        error: error.message,
        executionTime: Date.now() - startTime,
        correlationId
      };
    }
  }

  async executeBatch(
    prompts: Array<{ id: string; content: string; platform?: string }>,
    config: Partial<BrowserConfig> = {}
  ): Promise<PromptExecutionResult[]> {
    const correlationId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Starting batch execution ${correlationId} of ${prompts.length} prompts`);
    
    const results: PromptExecutionResult[] = [];
    const maxConcurrency = 3;
    
    // Process prompts in batches
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

      // Add delay between batches
      if (i + maxConcurrency < prompts.length) {
        const delay = Math.floor(Math.random() * 3000) + 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`Batch execution completed. Success rate: ${results.filter(r => r.success).length}/${results.length}`);
    return results;
  }

  async getEngineStatus(): Promise<any> {
    const activeSessions = this.sessionManager.getActiveSessions();
    
    return {
      activeSessions: activeSessions.length,
      queueLength: 0, // Would get from queue service
      isProcessing: true,
      engines: {
        playwright: true,
        puppeteer: true
      },
      health: {
        playwright: 'healthy',
        puppeteer: 'healthy',
        overall: 'healthy'
      }
    };
  }

  async cleanup(): Promise<void> {
    this.sessionManager.cleanup();
    console.log('Execution orchestrator cleanup completed');
  }
}
