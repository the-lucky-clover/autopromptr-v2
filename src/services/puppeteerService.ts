import puppeteer, { Browser, Page } from 'puppeteer';
import { BrowserConfig } from './browserEngineManager';
import { AntiDetectionUtil } from '../utils/antiDetection';

export class PuppeteerService {
  private browsers: Map<string, Browser> = new Map();
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

      const browser = await puppeteer.launch(launchOptions);
      this.browsers.set(sessionId, browser);

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

      if (config.antiDetection) {
        await page.evaluateOnNewDocument(() => {
          // Remove webdriver property
          delete (window as any).webdriver;
          
          // Override plugins
          Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5]
          });

          // Override languages
          Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en']
          });
        });
      }

      this.pages.set(sessionId, page);
      console.log(`Puppeteer browser created for session ${sessionId}`);
    } catch (error) {
      console.error(`Failed to create Puppeteer browser:`, error);
      throw error;
    }
  }

  async executeOperation(sessionId: string, operation: string, params: any = {}): Promise<any> {
    const page = this.pages.get(sessionId);
    if (!page) {
      throw new Error(`No page found for session ${sessionId}`);
    }

    console.log(`Executing operation ${operation} with Puppeteer`);

    switch (operation) {
      case 'navigate':
        await page.goto(params.url, { waitUntil: 'networkidle0' });
        return { url: page.url() };

      case 'waitForSelector':
        await page.waitForSelector(params.selector, { timeout: params.timeout || 30000 });
        return true;

      case 'click':
        if (params.humanLike) {
          await this.antiDetection.humanLikeClickPuppeteer(page, params.selector);
        } else {
          await page.click(params.selector);
        }
        return true;

      case 'type':
        if (params.humanLike) {
          await this.antiDetection.humanLikeTypePuppeteer(page, params.selector, params.text);
        } else {
          await page.type(params.selector, params.text);
        }
        return true;

      case 'screenshot':
        const screenshot = await page.screenshot({ 
          fullPage: params.fullPage || false,
          path: params.path 
        });
        return { screenshot: screenshot.toString('base64') };

      case 'extractText':
        const text = await page.$eval(params.selector, (el: Element) => el.textContent);
        return { text };

      case 'extractAttribute':
        const attr = await page.$eval(params.selector, (el: Element, attribute: string) => 
          el.getAttribute(attribute), params.attribute);
        return { attribute: attr };

      case 'waitForNavigation':
        await page.waitForNavigation({ timeout: params.timeout || 30000 });
        return { url: page.url() };

      case 'executeScript':
        const result = await page.evaluate(params.script);
        return { result };

      case 'interceptRequests':
        await page.setRequestInterception(true);
        page.on('request', request => {
          if (params.block && params.block.includes(request.resourceType())) {
            request.abort();
          } else {
            request.continue();
          }
        });
        return true;

      case 'setViewport':
        await page.setViewport(params.viewport);
        return true;

      case 'emulateDevice':
        // Use built-in device configurations
        const deviceConfig = this.getDeviceConfig(params.device);
        if (deviceConfig) {
          await page.setViewport(deviceConfig.viewport);
          await page.setUserAgent(deviceConfig.userAgent);
        }
        return true;

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private getDeviceConfig(deviceName: string): any {
    const devices: { [key: string]: any } = {
      'iPhone 13': {
        viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
      },
      'iPad': {
        viewport: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
      }
    };
    return devices[deviceName];
  }

  async closeBrowser(sessionId: string): Promise<void> {
    const page = this.pages.get(sessionId);
    const browser = this.browsers.get(sessionId);

    if (page) {
      await page.close();
      this.pages.delete(sessionId);
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
      version: await browser.version(),
      connected: browser.isConnected(),
      pages: (await browser.pages()).length
    };
  }
}
