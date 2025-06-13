
// Browser-compatible Puppeteer factory
import { BrowserConfig } from '../browserEngineManager';
import { AntiDetectionUtil } from '../../utils/antiDetection';

export class PuppeteerBrowserFactory {
  private antiDetection: AntiDetectionUtil;

  constructor() {
    this.antiDetection = new AntiDetectionUtil();
  }

  async createBrowser(config: BrowserConfig): Promise<any> {
    console.log('Creating mock Puppeteer browser for browser environment');
    
    return {
      newPage: async () => ({
        setViewport: async (viewport: any) => console.log('Mock setViewport', viewport),
        setUserAgent: async (userAgent: string) => console.log('Mock setUserAgent', userAgent),
        evaluateOnNewDocument: async (script: Function) => console.log('Mock evaluateOnNewDocument'),
        goto: async (url: string) => console.log('Mock goto', url),
        click: async (selector: string) => console.log('Mock click', selector),
        type: async (selector: string, text: string) => console.log('Mock type', selector, text),
        screenshot: async () => Buffer.from('mock-screenshot'),
        close: async () => console.log('Mock page close')
      }),
      close: async () => console.log('Mock browser close'),
      isConnected: () => true,
      version: () => 'mock-version'
    };
  }

  async setupPage(browser: any, config: BrowserConfig): Promise<any> {
    const page = await browser.newPage();
    
    if (config.viewport) {
      await page.setViewport(config.viewport);
    }

    if (config.userAgent) {
      await page.setUserAgent(config.userAgent);
    } else if (config.antiDetection) {
      const userAgent = await this.antiDetection.getRandomUserAgent();
      await page.setUserAgent(userAgent);
    }

    return page;
  }
}
