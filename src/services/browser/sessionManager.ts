
export interface BrowserSession {
  id: string;
  engine: 'playwright' | 'puppeteer';
  browserType: 'chromium' | 'firefox' | 'webkit' | 'chrome';
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export class SessionManager {
  private sessions: Map<string, BrowserSession> = new Map();

  addSession(sessionId: string, config: any): void {
    const session: BrowserSession = {
      id: sessionId,
      engine: 'playwright', // Default
      browserType: 'chromium', // Default
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);
    console.log(`Session ${sessionId} tracked locally`);
  }

  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  removeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    console.log(`Session ${sessionId} removed from local tracking`);
  }

  getActiveSessions(): BrowserSession[] {
    return Array.from(this.sessions.values()).filter(session => session.isActive);
  }

  getSessionById(sessionId: string): BrowserSession | undefined {
    return this.sessions.get(sessionId);
  }

  cleanup(): void {
    // Clean up sessions older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < oneHourAgo) {
        this.sessions.delete(sessionId);
        console.log(`Cleaned up inactive session: ${sessionId}`);
      }
    }
  }
}
