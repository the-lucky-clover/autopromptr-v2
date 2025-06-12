
import { BasePlatformAdapter, PlatformConfig } from './basePlatformAdapter';
import { BrowserOperationResult } from '../services/browserEngineManager';

export class BoltAdapter extends BasePlatformAdapter {
  constructor() {
    const config: PlatformConfig = {
      name: 'Bolt.new',
      baseUrl: 'https://bolt.new',
      selectors: {
        promptInput: 'textarea[placeholder*="Describe"], textarea[placeholder*="What would you like to build"]',
        sendButton: 'button[type="submit"], button:has(svg[data-icon="send"])',
        responseArea: '.response-content, .chat-message',
        loadingIndicator: '.loading, .spinner, [data-loading="true"]',
        errorMessage: '.error-message, .alert-error',
        projectUrl: 'a[href*="bolt.new/"], [data-testid="project-url"]',
        forkButton: 'button:has-text("Fork"), button[aria-label*="fork"]'
      },
      workflows: {
        submitPrompt: {
          steps: [
            { action: 'waitForSelector', selector: 'textarea[placeholder*="Describe"]' },
            { action: 'click', selector: 'textarea[placeholder*="Describe"]', humanLike: true },
            { action: 'type', selector: 'textarea[placeholder*="Describe"]', value: '{{prompt}}', humanLike: true },
            { action: 'click', selector: 'button[type="submit"]', humanLike: true }
          ],
          timeout: 45000,
          retryAttempts: 3
        },
        forkProject: {
          steps: [
            { action: 'waitForSelector', selector: 'button:has-text("Fork")' },
            { action: 'click', selector: 'button:has-text("Fork")', humanLike: true },
            { action: 'waitForSelector', selector: '[data-testid="project-url"]' }
          ],
          timeout: 30000,
          retryAttempts: 2
        }
      }
    };

    super(config);
  }

  async submitPrompt(prompt: string, options: any = {}): Promise<BrowserOperationResult> {
    try {
      console.log(`Submitting prompt to Bolt.new: ${prompt.substring(0, 100)}...`);
      
      const result = await this.executeWorkflow('submitPrompt', { prompt });
      
      if (result.success) {
        console.log('Prompt submitted successfully to Bolt.new');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to submit prompt to Bolt.new:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractResult(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      // Wait for response to appear
      await this.browserManager.executeOperation(this.sessionId, 'waitForSelector', {
        selector: this.config.selectors.responseArea,
        timeout: 90000
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

      return { success: false, error: 'Failed to extract response text' };
    } catch (error) {
      console.error('Failed to extract result from Bolt.new:', error);
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
          
          // Loading indicator still present, wait a bit more
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch {
          // Loading indicator not found, likely completed
          break;
        }
      }

      // Check for error messages
      try {
        const errorResult = await this.browserManager.executeOperation(this.sessionId, 'extractText', {
          selector: this.config.selectors.errorMessage
        });
        
        if (errorResult.success && errorResult.data.text) {
          return { success: false, error: errorResult.data.text };
        }
      } catch {
        // No error message found, which is good
      }

      return { success: true, data: { completed: true } };
    } catch (error) {
      console.error('Error waiting for Bolt.new completion:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractProjectUrl(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      const urlSelectors = [
        'a[href*="bolt.new/"]',
        '[data-testid="project-url"]',
        '.project-link',
        'a[href*="stackblitz.com"]'
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

      return { success: false, error: 'Project URL not found' };
    } catch (error) {
      console.error('Failed to extract project URL:', error);
      return { success: false, error: String(error) };
    }
  }

  async forkProject(): Promise<BrowserOperationResult> {
    try {
      console.log('Forking project on Bolt.new');
      
      const result = await this.executeWorkflow('forkProject');
      
      if (result.success) {
        const urlResult = await this.extractProjectUrl();
        return {
          success: true,
          data: {
            forked: true,
            projectUrl: urlResult.success ? urlResult.data.projectUrl : null
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error('Failed to fork project on Bolt.new:', error);
      return { success: false, error: String(error) };
    }
  }
}
