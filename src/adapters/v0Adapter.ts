
import { BasePlatformAdapter, PlatformConfig } from './basePlatformAdapter';
import { BrowserOperationResult } from '../services/browserEngineManager';

export class V0Adapter extends BasePlatformAdapter {
  constructor() {
    const config: PlatformConfig = {
      name: 'V0.dev',
      baseUrl: 'https://v0.dev',
      selectors: {
        promptInput: 'textarea[placeholder*="Describe"], input[placeholder*="component"]',
        sendButton: 'button[type="submit"], button:has(svg)',
        responseArea: '.component-preview, .generated-code',
        loadingIndicator: '.loading, .spinner, [data-loading="true"]',
        errorMessage: '.error-message, .alert-error',
        codeBlock: 'pre code, .code-block',
        previewFrame: 'iframe, .preview-container',
        copyButton: 'button:has-text("Copy"), button[aria-label*="copy"]'
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
        extractCode: {
          steps: [
            { action: 'waitForSelector', selector: 'pre code' },
            { action: 'click', selector: 'button:has-text("Copy")', humanLike: true }
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
      console.log(`Submitting component request to V0.dev: ${prompt.substring(0, 100)}...`);
      
      const result = await this.executeWorkflow('submitPrompt', { prompt });
      
      if (result.success) {
        console.log('Component request submitted successfully to V0.dev');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to submit prompt to V0.dev:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractResult(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      // Wait for component generation
      await this.browserManager.executeOperation(this.sessionId, 'waitForSelector', {
        selector: this.config.selectors.responseArea,
        timeout: 120000
      });

      // Extract generated code
      const codeResult = await this.extractGeneratedCode();
      
      // Extract preview URL if available
      const previewResult = await this.extractPreviewUrl();

      return {
        success: true,
        data: {
          code: codeResult.success ? codeResult.data.code : null,
          previewUrl: previewResult.success ? previewResult.data.previewUrl : null,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to extract result from V0.dev:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractGeneratedCode(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      const codeResult = await this.browserManager.executeOperation(this.sessionId, 'extractText', {
        selector: this.config.selectors.codeBlock
      });

      if (codeResult.success && codeResult.data.text) {
        return {
          success: true,
          data: { code: codeResult.data.text }
        };
      }

      return { success: false, error: 'Generated code not found' };
    } catch (error) {
      console.error('Failed to extract generated code:', error);
      return { success: false, error: String(error) };
    }
  }

  async extractPreviewUrl(): Promise<BrowserOperationResult> {
    if (!this.sessionId) throw new Error('Session not initialized');

    try {
      const previewResult = await this.browserManager.executeOperation(this.sessionId, 'extractAttribute', {
        selector: this.config.selectors.previewFrame,
        attribute: 'src'
      });

      if (previewResult.success && previewResult.data.attribute) {
        return {
          success: true,
          data: { previewUrl: previewResult.data.attribute }
        };
      }

      return { success: false, error: 'Preview URL not found' };
    } catch (error) {
      console.error('Failed to extract preview URL:', error);
      return { success: false, error: String(error) };
    }
  }

  async waitForCompletion(timeout: number = 150000): Promise<BrowserOperationResult> {
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
      console.error('Error waiting for V0.dev completion:', error);
      return { success: false, error: String(error) };
    }
  }

  async copyGeneratedCode(): Promise<BrowserOperationResult> {
    try {
      console.log('Copying generated code from V0.dev');
      
      const result = await this.executeWorkflow('extractCode');
      
      if (result.success) {
        const codeResult = await this.extractGeneratedCode();
        return {
          success: true,
          data: {
            copied: true,
            code: codeResult.success ? codeResult.data.code : null
          }
        };
      }
      
      return result;
    } catch (error) {
      console.error('Failed to copy code from V0.dev:', error);
      return { success: false, error: String(error) };
    }
  }
}
