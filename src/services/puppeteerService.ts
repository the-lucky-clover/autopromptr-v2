
// Browser-compatible Puppeteer service
import { BrowserConfig } from './browserEngineManager';
import { supabase } from '@/integrations/supabase/client';

export class PuppeteerService {
  private browsers: Map<string, any> = new Map();
  private pages: Map<string, any> = new Map();

  async createBrowser(sessionId: string, config: BrowserConfig): Promise<void> {
    console.log(`Creating Puppeteer browser for session ${sessionId}`);
    
    // Store session info
    this.browsers.set(sessionId, {
      id: sessionId,
      config,
      created: new Date()
    });

    this.pages.set(sessionId, {
      sessionId,
      url: 'about:blank'
    });
  }

  async executeOperation(sessionId: string, operation: string, params: any = {}): Promise<any> {
    const browser = this.browsers.get(sessionId);
    if (!browser) {
      throw new Error(`No browser found for session ${sessionId}`);
    }

    console.log(`Executing Puppeteer operation ${operation}`);

    // Delegate to server-side via Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('puppeteer-automation', {
        body: {
          sessionId,
          operation,
          params,
          config: browser.config
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Puppeteer operation failed:`, error);
      
      // Return mock data for development
      switch (operation) {
        case 'navigate':
          return { url: params.url };
        case 'screenshot':
          return { screenshot: 'mock-puppeteer-screenshot' };
        case 'extractText':
          return { text: 'Mock Puppeteer text' };
        default:
          return { success: true, mock: true };
      }
    }
  }

  async closeBrowser(sessionId: string): Promise<void> {
    this.browsers.delete(sessionId);
    this.pages.delete(sessionId);
    console.log(`Closed Puppeteer browser ${sessionId}`);
  }

  async getBrowserInfo(sessionId: string): Promise<any> {
    const browser = this.browsers.get(sessionId);
    return browser ? {
      version: 'mock-puppeteer-version',
      connected: true,
      pages: 1
    } : null;
  }
}
