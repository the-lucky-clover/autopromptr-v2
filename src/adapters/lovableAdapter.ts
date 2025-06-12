
import { BasePlatformAdapter, PlatformConfig } from './basePlatformAdapter';
import { BrowserOperationResult } from '../services/browserEngineManager';

export class LovableAdapter extends BasePlatformAdapter {
  constructor() {
    const config: PlatformConfig = {
      name: 'Lovable',
      baseUrl: 'https://lovable.dev',
      selectors: {
        chatInput: 'textarea[placeholder*="chat"]',
        sendButton: 'button[type="submit"]',
        responseArea: '.response-content',
        loadingIndicator: '.loading-spinner',
        errorMessage: '.error-message'
      },
      workflows: {
        submitPrompt: {
          steps: [
            { action: 'waitForSelector', selector: 'textarea[placeholder*="chat"]' },
            { action: 'click', selector: 'textarea[placeholder*="chat"]', humanLike: true },
            { action: 'type', selector: 'textarea[placeholder*="chat"]', value: '{{prompt}}', humanLike: true },
            { action: 'click', selector: 'button[type="submit"]', humanLike: true }
          ],
          timeout: 30000,
          retryAttempts: 3
        }
      }
    };

    super(config);
  }

  async submitPrompt(prompt: string, options: any = {}): Promise<BrowserOperationResult> {
    try {
      console.log(`Submitting prompt to Lovable: ${prompt.substring(0, 100)}...`);
      
      const result = await this.executeWorkflow('submitPrompt', { prompt });
      
      if (result.success) {
        console.log('Prompt submitted successfully to Lovable');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to submit prompt to Lovable:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractResult(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      // Wait for response to appear
      await this.browserManager.executeOperation(this.sessionId, 'waitForSelector', {
        selector: this.config.selectors.responseArea,
        timeout: 60000
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
      console.error('Failed to extract result from Lovable:', error);
      return { success: false, error: String(error) };
    }
  }

  async waitForCompletion(timeout: number = 120000): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      // Wait for loading indicator to disappear
      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        try {
          await this.browserManager.executeOperation(this.sessionId, 'waitForSelector', {
            selector: this.config.selectors.loadingIndicator,
            timeout: 1000
          });
          
          // Loading indicator still present, wait a bit more
          await new Promise(resolve => setTimeout(resolve, 2000));
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
      console.error('Error waiting for Lovable completion:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractProjectUrl(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      // Look for project URL in various possible locations
      const urlSelectors = [
        'a[href*="lovable.dev/"]',
        '[data-testid="project-url"]',
        '.project-link'
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
}
