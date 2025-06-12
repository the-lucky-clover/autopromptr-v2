
import puppeteer, { Browser } from 'puppeteer';
import { BrowserConfig } from '../browserEngineManager';
import { AntiDetectionUtil } from '../../utils/antiDetection';

export class PuppeteerBrowserFactory {
  private antiDetection: AntiDetectionUtil;

  constructor() {
    this.antiDetection = new AntiDetectionUtil();
  }

  async createBrowser(config: BrowserConfig): Promise<Browser> {
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

    return await puppeteer.launch(launchOptions);
  }

  async setupPage(browser: Browser, config: BrowserConfig): Promise<any> {
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

    return page;
  }
}
