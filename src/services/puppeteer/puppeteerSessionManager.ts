
// Browser-compatible session manager
export interface PuppeteerSession {
  browser: any;
  page: any;
  createdAt: Date;
  lastActivity: Date;
}

export class PuppeteerSessionManager {
  private sessions: Map<string, PuppeteerSession> = new Map();

  addSession(sessionId: string, browser: any, page: any): void {
    const session: PuppeteerSession = {
      browser,
      page,
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    this.sessions.set(sessionId, session);
    console.log(`Mock Puppeteer session ${sessionId} created`);
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
      if (session.page?.close) {
        await session.page.close();
      }
      if (session.browser?.close) {
        await session.browser.close();
      }
      
      this.sessions.delete(sessionId);
      console.log(`Mock Puppeteer session ${sessionId} closed`);
    } catch (error) {
      console.error(`Failed to close mock session ${sessionId}:`, error);
    }
  }

  async getBrowserInfo(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session?.browser) return null;

    return {
      version: 'mock-version',
      connected: true,
      pages: 1
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
