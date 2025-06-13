
import { ExecutionOrchestrator, PromptExecutionResult } from './executionOrchestrator';
import { BrowserConfig } from './browserClientProxy';

export interface AutomationConfig {
  platform: string;
  headless: boolean;
  maxConcurrency: number;
  retryAttempts: number;
  humanLikeDelay: boolean;
}

export class BrowserAutomationManager {
  private static instance: BrowserAutomationManager;
  private orchestrator: ExecutionOrchestrator;

  private constructor() {
    this.orchestrator = new ExecutionOrchestrator();
  }

  public static getInstance(): BrowserAutomationManager {
    if (!BrowserAutomationManager.instance) {
      BrowserAutomationManager.instance = new BrowserAutomationManager();
    }
    return BrowserAutomationManager.instance;
  }

  async executePrompt(
    promptId: string, 
    prompt: string, 
    platform: string = 'lovable',
    config: Partial<AutomationConfig> = {}
  ): Promise<PromptExecutionResult> {
    const browserConfig: Partial<BrowserConfig> = {
      headless: config.headless ?? true,
      timeout: 30000,
      retryAttempts: config.retryAttempts ?? 2,
      antiDetection: true
    };

    return await this.orchestrator.executePrompt(promptId, prompt, platform, browserConfig);
  }

  async executeBatch(
    prompts: Array<{ id: string; content: string; platform?: string }>,
    config: Partial<AutomationConfig> = {}
  ): Promise<PromptExecutionResult[]> {
    const browserConfig: Partial<BrowserConfig> = {
      headless: config.headless ?? true,
      timeout: 30000,
      retryAttempts: config.retryAttempts ?? 2,
      antiDetection: true
    };

    return await this.orchestrator.executeBatch(prompts, browserConfig);
  }

  async getEngineStatus(): Promise<any> {
    return await this.orchestrator.getEngineStatus();
  }

  async cleanup(): Promise<void> {
    await this.orchestrator.cleanup();
  }
}

export const browserAutomationManager = BrowserAutomationManager.getInstance();
