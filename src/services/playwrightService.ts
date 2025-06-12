import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { BrowserConfig } from './browserEngineManager';
import { AntiDetectionUtil } from '../utils/antiDetection';

export class PlaywrightService {
  private browsers: Map<string, Browser> = new Map();
  private contexts: Map<string, BrowserContext> = new Map();
  private pages: Map<string, Page> = new Map();
  private antiDetection: AntiDetectionUtil;

  constructor() {
    this.antiDetection = new AntiDetectionUtil();
  }

  async createBrowser(sessionId: string, config: BrowserConfig): Promise<void> {
    try {
      const launchOptions = {
        headless: config.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      };

      if (config.antiDetection) {
        launchOptions.args.push(
          '--disable-blink-features=AutomationControlled',
          '--disable-features=VizDisplayCompositor'
        );
      }

      const browser = await chromium.launch(launchOptions);
      this.browsers.set(sessionId, browser);

      const contextOptions: any = {
        viewport: config.viewport || { width: 1920, height: 1080 },
        userAgent: config.userAgent || await this.antiDetection.getRandomUserAgent()
      };

      if (config.antiDetection) {
        contextOptions.javaScriptEnabled = true;
        contextOptions.locale = 'en-US';
        contextOptions.timezoneId = 'America/New_York';
      }

      const context = await browser.newContext(contextOptions);
      this.contexts.set(sessionId, context);

      if (config.antiDetection) {
        await context.addInitScript(() => {
          // Remove webdriver property
          delete (window as any).webdriver;
          
          // Override plugins array
          Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5]
          });

          // Override languages
          Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en']
          });
        });
      }

      const page = await context.newPage();
      this.pages.set(sessionId, page);

      console.log(`Playwright browser created for session ${sessionId}`);
    } catch (error) {
      console.error(`Failed to create Playwright browser:`, error);
      throw error;
    }
  }

  async executeOperation(sessionId: string, operation: string, params: any = {}): Promise<any> {
    const page = this.pages.get(sessionId);
    if (!page) {
      throw new Error(`No page found for session ${sessionId}`);
    }

    console.log(`Executing operation ${operation} with Playwright`);

    switch (operation) {
      case 'navigate':
        await page.goto(params.url, { waitUntil: 'networkidle' });
        return { url: page.url() };

      case 'waitForSelector':
        await page.waitForSelector(params.selector, { timeout: params.timeout || 30000 });
        return true;

      case 'click':
        if (params.humanLike) {
          await this.antiDetection.humanLikeClick(page, params.selector);
        } else {
          await page.click(params.selector);
        }
        return true;

      case 'type':
        if (params.humanLike) {
          await this.antiDetection.humanLikeType(page, params.selector, params.text);
        } else {
          await page.fill(params.selector, params.text);
        }
        return true;

      case 'screenshot':
        const screenshot = await page.screenshot({ 
          fullPage: params.fullPage || false,
          path: params.path 
        });
        return { screenshot: screenshot.toString('base64') };

      case 'extractText':
        const element = await page.$(params.selector);
        if (element) {
          const text = await element.textContent();
          return { text };
        }
        return { text: null };

      case 'extractAttribute':
        const attr = await page.getAttribute(params.selector, params.attribute);
        return { attribute: attr };

      case 'waitForNavigation':
        await page.waitForNavigation({ timeout: params.timeout || 30000 });
        return { url: page.url() };

      case 'executeScript':
        const result = await page.evaluate(params.script);
        return { result };

      case 'interceptRequests':
        await page.route(params.pattern || '**/*', route => {
          if (params.block && params.block.includes(route.request().resourceType())) {
            route.abort();
          } else {
            route.continue();
          }
        });
        return true;

      case 'setViewport':
        await page.setViewportSize(params.viewport);
        return true;

      case 'emulateDevice':
        // Use proper device emulation for Playwright
        const context = this.contexts.get(sessionId);
        if (context && params.device) {
          // Set viewport and user agent based on device
          const deviceConfig = this.getDeviceConfig(params.device);
          if (deviceConfig) {
            await page.setViewportSize(deviceConfig.viewport);
            await context.setExtraHTTPHeaders(deviceConfig.headers || {});
          }
        }
        return true;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private getDeviceConfig(deviceName: string): any {
    const devices: { [key: string]: any } = {
      'iPhone 13': {
        viewport: { width: 390, height: 844 },
        headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15' }
      },
      'iPad': {
        viewport: { width: 768, height: 1024 },
        headers: { 'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15' }
      }
    };
    return devices[deviceName];
  }

  async closeBrowser(sessionId: string): Promise<void> {
    const page = this.pages.get(sessionId);
    const context = this.contexts.get(sessionId);
    const browser = this.browsers.get(sessionId);

    if (page) {
      await page.close();
      this.pages.delete(sessionId);
    }

    if (context) {
      await context.close();
      this.contexts.delete(sessionId);
    }

    if (browser) {
      await browser.close();
      this.browsers.delete(sessionId);
    }
  }

  async getBrowserInfo(sessionId: string): Promise<any> {
    const browser = this.browsers.get(sessionId);
    if (!browser) return null;

    return {
      version: browser.version(),
      connected: browser.isConnected(),
      contexts: browser.contexts().length
    };
  }
}
