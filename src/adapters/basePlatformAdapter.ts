
import { BrowserEngineManager, BrowserOperationResult } from '../services/browserEngineManager';

export interface PlatformConfig {
  name: string;
  baseUrl: string;
  loginUrl?: string;
  selectors: {
    [key: string]: string;
  };
  workflows: {
    [key: string]: PlatformWorkflow;
  };
}

export interface PlatformWorkflow {
  steps: WorkflowStep[];
  timeout?: number;
  retryAttempts?: number;
}

export interface WorkflowStep {
  action: string;
  selector?: string;
  value?: string;
  waitFor?: string;
  timeout?: number;
  humanLike?: boolean;
}

export abstract class BasePlatformAdapter {
  protected browserManager: BrowserEngineManager;
  protected config: PlatformConfig;
  protected sessionId?: string;

  constructor(config: PlatformConfig) {
    this.browserManager = BrowserEngineManager.getInstance();
    this.config = config;
  }

  async initialize(headless: boolean = true): Promise<string> {
    this.sessionId = await this.browserManager.createSession({
      headless,
      viewport: { width: 1920, height: 1080 },
      timeout: 30000,
      retryAttempts: 3,
      antiDetection: true
    });

    return this.sessionId;
  }

  async navigate(url?: string): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');
    
    return await this.browserManager.executeOperation(this.sessionId, 'navigate', {
      url: url || this.config.baseUrl
    });
  }

  async login(credentials: { username: string;password: string }): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');
    if (!this.config.loginUrl) throw new Error('Login URL not configured');

    // Navigate to login page
    await this.navigate(this.config.loginUrl);

    // Execute login workflow
    const loginWorkflow = this.config.workflows.login;
    if (!loginWorkflow) throw new Error('Login workflow not configured');

    return await this.executeWorkflow('login', { credentials });
  }

  async executeWorkflow(workflowName: string, params: any = {}): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    const workflow = this.config.workflows[workflowName];
    if (!workflow) throw new Error(`Workflow ${workflowName} not found`);

    try {
      for (const step of workflow.steps) {
        await this.executeStep(step, params);
        
        // Wait between steps for human-like behavior
        if (step.humanLike) {
          const delay = Math.floor(Math.random() * 1000) + 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      return { success: true };
    } catch (error) {
      console.error(`Workflow ${workflowName} failed:`, error);
      return { success: false, error: String(error) };
    }
  }

  private async executeStep(step: WorkflowStep, params: any): Promise<void> {
    const operation = step.action;
    const operationParams: any = {
      selector: step.selector,
      value: this.interpolateValue(step.value, params),
      timeout: step.timeout,
      humanLike: step.humanLike || false
    };

    switch (operation) {
      case 'type':
        operationParams.text = operationParams.value;
        break;
      case 'waitForSelector':
        operationParams.selector = step.waitFor || step.selector;
        break;
    }

    await this.browserManager.executeOperation(this.sessionId!, operation, operationParams);
  }

  private interpolateValue(value: string | undefined, params: any): string {
    if (!value) return '';
    
    return value.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const keys = path.split('.');
      let result = params;
      
      for (const key of keys) {
        result = result?.[key];
      }
      
      return result || match;
    });
  }

  async cleanup(): Promise<void> {
    if (this.sessionId) {
      await this.browserManager.closeSession(this.sessionId);
      this.sessionId = undefined;
    }
  }

  abstract submitPrompt(prompt: string, options?: any): Promise<BrowserOperationResult>;
  abstract extractResult(): Promise<BrowserOperationResult>;
  abstract waitForCompletion(timeout?: number): Promise<BrowserOperationResult>;
}
