
import { BasePlatformAdapter, PlatformConfig } from './basePlatformAdapter';
import { BrowserOperationResult } from '../services/browserEngineManager';

export class ReplitAdapter extends BasePlatformAdapter {
  constructor() {
    const config: PlatformConfig = {
      name: 'Replit',
      baseUrl: 'https://replit.com',
      loginUrl: 'https://replit.com/login',
      selectors: {
        aiChatInput: '[data-cy="ai-chat-input"], textarea[placeholder*="Ask Replit AI"]',
        sendButton: '[data-cy="send-button"], button[aria-label="Send"]',
        responseArea: '.ai-response, .chat-message',
        loadingIndicator: '.loading-spinner, [data-loading="true"]',
        errorMessage: '.error-alert, .alert-error',
        projectUrl: 'a[href*="replit.com/@"]',
        createReplButton: 'button:has-text("Create Repl")',
        runButton: '[data-cy="run-button"]'
      },
      workflows: {
        submitPrompt: {
          steps: [
            { action: 'waitForSelector', selector: '[data-cy="ai-chat-input"]' },
            { action: 'click', selector: '[data-cy="ai-chat-input"]', humanLike: true },
            { action: 'type', selector: '[data-cy="ai-chat-input"]', value: '{{prompt}}', humanLike: true },
            { action: 'click', selector: '[data-cy="send-button"]', humanLike: true }
          ],
          timeout: 30000,
          retryAttempts: 3
        },
        createProject: {
          steps: [
            { action: 'waitForSelector', selector: 'button:has-text("Create Repl")' },
            { action: 'click', selector: 'button:has-text("Create Repl")', humanLike: true },
            { action: 'waitForSelector', selector: 'input[placeholder*="Name your Repl"]' },
            { action: 'type', selector: 'input[placeholder*="Name your Repl"]', value: '{{projectName}}', humanLike: true },
            { action: 'click', selector: 'button:has-text("Create")', humanLike: true }
          ],
          timeout: 45000,
          retryAttempts: 2
        }
      }
    };

    super(config);
  }

  async submitPrompt(prompt: string, options: any = {}): Promise<BrowserOperationResult> {
    try {
      console.log(`Submitting prompt to Replit AI: ${prompt.substring(0, 100)}...`);
      
      const result = await this.executeWorkflow('submitPrompt', { prompt });
      
      if (result.success) {
        console.log('Prompt submitted successfully to Replit AI');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to submit prompt to Replit AI:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractResult(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      // Wait for AI response
      await this.browserManager.executeOperation(this.sessionId, 'waitForSelector', {
        selector: this.config.selectors.responseArea,
        timeout: 120000
      });

      // Extract the response text
      const textResult = await this.browserManager.executeOperation(this.sessionId, 'extractText', {
        selector: this.config.selectors.responseArea
      });

      if (textResult.success) {
        return {
          success: true,
          data: {
            response: textResult.data.text,
            timestamp: new Date().toISOString()
          }
        };
      }

      return { success: false, error: 'Failed to extract AI response' };
    } catch (error) {
      console.error('Failed to extract result from Replit:', error);
      return { success: false, error: String(error) };
    }
  }

  async waitForCompletion(timeout: number = 180000): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        try {
          await this.browserManager.executeOperation(this.sessionId, 'waitForSelector', {
            selector: this.config.selectors.loadingIndicator,
            timeout: 2000
          });
          
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch {
          break;
        }
      }

      return { success: true, data: { completed: true } };
    } catch (error) {
      console.error('Error waiting for Replit completion:', error);
      return { success: false, error: String(error) };
    }
  }

  async createProject(projectName: string): Promise<BrowserOperationResult> {
    try {
      console.log(`Creating new Repl project: ${projectName}`);
      
      const result = await this.executeWorkflow('createProject', { projectName });
      
      if (result.success) {
        const urlResult = await this.extractProjectUrl();
        return {
          success: true,
          data: {
            created: true,
            projectName,
            projectUrl: urlResult.success ? urlResult.data.projectUrl : null
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error('Failed to create Repl project:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractProjectUrl(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      const urlSelectors = [
        'a[href*="replit.com/@"]',
        '[data-testid="repl-url"]',
        '.repl-link'
      ];

      for (const selector of urlSelectors) {
        try {
          const result = await this.browserManager.executeOperation(this.sessionId, 'extractAttribute', {
            selector,
            attribute: 'href'
          });

          if (result.success && result.data.attribute) {
            return {
              success: true,
              data: { projectUrl: result.data.attribute }
            };
          }
        } catch {
          // Try next selector
        }
      }

      // Try to get current URL as fallback
      const currentUrl = await this.browserManager.executeOperation(this.sessionId, 'executeScript', {
        script: 'return window.location.href;'
      });

      if (currentUrl.success && currentUrl.data.result.includes('replit.com')) {
        return {
          success: true,
          data: { projectUrl: currentUrl.data.result }
        };
      }

      return { success: false, error: 'Project URL not found' };
    } catch (error) {
      console.error('Failed to extract project URL:', error);
      return { success: false, error: String(error) };
    }
  }
}
