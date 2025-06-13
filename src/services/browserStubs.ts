
// Browser-compatible stubs for server-side browser automation
export class BrowserStub {
  async launch(): Promise<any> {
    console.warn('Browser automation not available in browser environment');
    return null;
  }

  async close(): Promise<void> {
    // No-op in browser
  }
}

export class PlaywrightStub {
  chromium = {
    launch: () => new BrowserStub().launch()
  };
  
  firefox = {
    launch: () => new BrowserStub().launch()
  };
  
  webkit = {
    launch: () => new BrowserStub().launch()
  };
}

export class PuppeteerStub {
  async launch(): Promise<any> {
    console.warn('Puppeteer not available in browser environment');
    return new BrowserStub();
  }
}

// Export browser-safe versions
export const chromium = new PlaywrightStub().chromium;
export const firefox = new PlaywrightStub().firefox;
export const webkit = new PlaywrightStub().webkit;
export const puppeteer = new PuppeteerStub();
