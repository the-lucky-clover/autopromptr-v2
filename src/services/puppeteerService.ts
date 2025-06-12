
import { BrowserConfig } from './browserEngineManager';
import { PuppeteerBrowserFactory } from './puppeteer/puppeteerBrowserFactory';
import { PuppeteerOperationHandlers } from './puppeteer/puppeteerOperationHandlers';
import { PuppeteerSessionManager } from './puppeteer/puppeteerSessionManager';

export class PuppeteerService {
  private browserFactory: PuppeteerBrowserFactory;
  private operationHandlers: PuppeteerOperationHandlers;
  private sessionManager: PuppeteerSessionManager;

  constructor() {
    this.browserFactory = new PuppeteerBrowserFactory();
    this.operationHandlers = new PuppeteerOperationHandlers();
    this.sessionManager = new PuppeteerSessionManager();
  }

  async createBrowser(sessionId: string, config: BrowserConfig): Promise<void> {
    try {
      const browser = await this.browserFactory.createBrowser(config);
      const page = await this.browserFactory.setupPage(browser, config);
      
      this.sessionManager.addSession(sessionId, browser, page);
    } catch (error) {
      console.error(`Failed to create Puppeteer browser:`, error);
      throw error;
    }
  }

  async executeOperation(sessionId: string, operation: string, params: any = {}): Promise<any> {
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      throw new Error(`No session found for session ${sessionId}`);
    }

    console.log(`Executing operation ${operation} with Puppeteer`);

    switch (operation) {
      case 'navigate':
        return await this.operationHandlers.handleNavigation(session.page, params);
      case 'waitForSelector':
        return await this.operationHandlers.handleWaitForSelector(session.page, params);
      case 'click':
        return await this.operationHandlers.handleClick(session.page, params);
      case 'type':
        return await this.operationHandlers.handleType(session.page, params);
      case 'screenshot':
        return await this.operationHandlers.handleScreenshot(session.page, params);
      case 'extractText':
        return await this.operationHandlers.handleExtractText(session.page, params);
      case 'extractAttribute':
        return await this.operationHandlers.handleExtractAttribute(session.page, params);
      case 'waitForNavigation':
        return await this.operationHandlers.handleWaitForNavigation(session.page, params);
      case 'executeScript':
        return await this.operationHandlers.handleExecuteScript(session.page, params);
      case 'interceptRequests':
        return await this.operationHandlers.handleInterceptRequests(session.page, params);
      case 'setViewport':
        return await this.operationHandlers.handleSetViewport(session.page, params);
      case 'emulateDevice':
        return await this.operationHandlers.handleEmulateDevice(session.page, params);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  async closeBrowser(sessionId: string): Promise<void> {
    await this.sessionManager.closeSession(sessionId);
  }

  async getBrowserInfo(sessionId: string): Promise<any> {
    return await this.sessionManager.getBrowserInfo(sessionId);
  }

  async cleanup(): Promise<void> {
    await this.sessionManager.cleanup();
  }
}
