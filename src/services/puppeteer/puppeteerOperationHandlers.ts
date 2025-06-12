
import { AntiDetectionUtil } from '../../utils/antiDetection';

export class PuppeteerOperationHandlers {
  private antiDetection: AntiDetectionUtil;

  constructor() {
    this.antiDetection = new AntiDetectionUtil();
  }

  async handleNavigation(page: any, params: any): Promise<any> {
    await page.goto(params.url, { waitUntil: 'networkidle0' });
    return { url: page.url() };
  }

  async handleWaitForSelector(page: any, params: any): Promise<boolean> {
    await page.waitForSelector(params.selector, { timeout: params.timeout || 30000 });
    return true;
  }

  async handleClick(page: any, params: any): Promise<boolean> {
    if (params.humanLike) {
      await this.antiDetection.humanLikeClickPuppeteer(page, params.selector);
    } else {
      await page.click(params.selector);
    }
    return true;
  }

  async handleType(page: any, params: any): Promise<boolean> {
    if (params.humanLike) {
      await this.antiDetection.humanLikeTypePuppeteer(page, params.selector, params.text);
    } else {
      await page.type(params.selector, params.text);
    }
    return true;
  }

  async handleScreenshot(page: any, params: any): Promise<any> {
    const screenshot = await page.screenshot({ 
      fullPage: params.fullPage || false,
      path: params.path 
    });
    return { screenshot: screenshot.toString('base64') };
  }

  async handleExtractText(page: any, params: any): Promise<any> {
    const text = await page.$eval(params.selector, (el) => el.textContent);
    return { text };
  }

  async handleExtractAttribute(page: any, params: any): Promise<any> {
    const attr = await page.$eval(params.selector, (el, attribute) => 
      el.getAttribute(attribute), params.attribute);
    return { attribute: attr };
  }

  async handleWaitForNavigation(page: any, params: any): Promise<any> {
    await page.waitForNavigation({ timeout: params.timeout || 30000 });
    return { url: page.url() };
  }

  async handleExecuteScript(page: any, params: any): Promise<any> {
    const result = await page.evaluate(params.script);
    return { result };
  }

  async handleInterceptRequests(page: any, params: any): Promise<boolean> {
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (params.block && params.block.includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
    return true;
  }

  async handleSetViewport(page: any, params: any): Promise<boolean> {
    await page.setViewport(params.viewport);
    return true;
  }

  async handleEmulateDevice(page: any, params: any): Promise<boolean> {
    const deviceConfig = this.getDeviceConfig(params.device);
    if (deviceConfig) {
      await page.setViewport(deviceConfig.viewport);
      await page.setUserAgent(deviceConfig.userAgent);
    }
    return true;
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
}
