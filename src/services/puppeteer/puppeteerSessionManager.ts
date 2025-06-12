
import { Browser, Page } from 'puppeteer';

export interface PuppeteerSession {
  browser: Browser;
  page: Page;
  createdAt: Date;
  lastActivity: Date;
}

export class PuppeteerSessionManager {
  private sessions: Map<string, PuppeteerSession> = new Map();

  addSession(sessionId: string, browser: Browser, page: Page): void {
    const session: PuppeteerSession = {
      browser,
      page,
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    this.sessions.set(sessionId, session);
    console.log(`Puppeteer session ${sessionId} created`);
  }

  getSession(sessionId: string): PuppeteerSession | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
    return session;
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      if (session.page) {
        await session.page.close();
      }
      if (session.browser) {
        await session.browser.close();
      }
      
      this.sessions.delete(sessionId);
      console.log(`Puppeteer session ${sessionId} closed`);
    } catch (error) {
      console.error(`Failed to close Puppeteer session ${sessionId}:`, error);
    }
  }

  async getBrowserInfo(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session?.browser) return null;

    return {
      version: await session.browser.version(),
      connected: session.browser.isConnected(),
      pages: (await session.browser.pages()).length
    };
  }

  getAllSessions(): PuppeteerSession[] {
    return Array.from(this.sessions.values());
  }

  async cleanup(): Promise<void> {
    const sessionIds = Array.from(this.sessions.keys());
    await Promise.all(sessionIds.map(id => this.closeSession(id)));
  }
}
