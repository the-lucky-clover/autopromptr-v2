
import { PlaywrightService } from './playwrightService';
import { PuppeteerService } from './puppeteerService';

export type BrowserEngine = 'playwright' | 'puppeteer';
export type BrowserType = 'chromium' | 'firefox' | 'webkit' | 'chrome';

export interface BrowserSession {
  id: string;
  engine: BrowserEngine;
  browserType: BrowserType;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface BrowserOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  screenshots?: string[];
  logs?: string[];
}

export interface BrowserConfig {
  headless: boolean;
  viewport?: { width: number; height: number };
  userAgent?: string;
  timeout: number;
  retryAttempts: number;
  antiDetection: boolean;
}

export class BrowserEngineManager {
  private static instance: BrowserEngineManager;
  private activeSessions: Map<string, BrowserSession> = new Map();
  private playwrightService: PlaywrightService;
  private puppeteerService: PuppeteerService;
  private preferredEngine: BrowserEngine = 'playwright';

  private constructor() {
    this.playwrightService = new PlaywrightService();
    this.puppeteerService = new PuppeteerService();
  }

  public static getInstance(): BrowserEngineManager {
    if (!BrowserEngineManager.instance) {
      BrowserEngineManager.instance = new BrowserEngineManager();
    }
    return BrowserEngineManager.instance;
  }

  async createSession(config: BrowserConfig, enginePreference?: BrowserEngine): Promise<string> {
    const engine = enginePreference || this.preferredEngine;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      let service = engine === 'playwright' ? this.playwrightService : this.puppeteerService;
      
      await service.createBrowser(sessionId, config);
      
      const session: BrowserSession = {
        id: sessionId,
        engine,
        browserType: 'chromium', // Default, will be updated based on actual browser
        isActive: true,
        createdAt: new Date(),
        lastActivity: new Date()
      };

      this.activeSessions.set(sessionId, session);
      console.log(`Created browser session ${sessionId} using ${engine}`);
      
      return sessionId;
    } catch (error) {
      console.error(`Failed to create session with ${engine}:`, error);
      
      // Try fallback engine
      const fallbackEngine = engine === 'playwright' ? 'puppeteer' : 'playwright';
      try {
        let fallbackService = fallbackEngine === 'playwright' ? this.playwrightService : this.puppeteerService;
        await fallbackService.createBrowser(sessionId, config);
        
        const session: BrowserSession = {
          id: sessionId,
          engine: fallbackEngine,
          browserType: 'chromium',
          isActive: true,
          createdAt: new Date(),
          lastActivity: new Date()
        };

        this.activeSessions.set(sessionId, session);
        console.log(`Created browser session ${sessionId} using fallback ${fallbackEngine}`);
        
        return sessionId;
      } catch (fallbackError) {
        console.error(`Both engines failed to create session:`, fallbackError);
        throw new Error(`Failed to create browser session with both engines: ${error}`);
      }
    }
  }

  async executeOperation(sessionId: string, operation: string, params: any = {}): Promise<BrowserOperationResult> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive) {
      return { success: false, error: 'Session not found or inactive' };
    }

    session.lastActivity = new Date();
    
    try {
      const service = session.engine === 'playwright' ? this.playwrightService : this.puppeteerService;
      const result = await service.executeOperation(sessionId, operation, params);
      
      return { success: true, data: result };
    } catch (error) {
      console.error(`Operation ${operation} failed on ${session.engine}:`, error);
      
      // Try with fallback engine
      try {
        const fallbackEngine = session.engine === 'playwright' ? 'puppeteer' : 'playwright';
        const fallbackService = fallbackEngine === 'playwright' ? this.playwrightService : this.puppeteerService;
        
        // Create new session with fallback engine
        const config: BrowserConfig = { headless: true, timeout: 30000, retryAttempts: 3, antiDetection: true };
        const fallbackSessionId = await this.createSession(config, fallbackEngine);
        
        const result = await fallbackService.executeOperation(fallbackSessionId, operation, params);
        
        // Update session engine
        session.engine = fallbackEngine;
        
        return { success: true, data: result };
      } catch (fallbackError) {
        return { 
          success: false, 
          error: `Operation failed on both engines: ${error}` 
        };
      }
    }
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    try {
      const service = session.engine === 'playwright' ? this.playwrightService : this.puppeteerService;
      await service.closeBrowser(sessionId);
      
      session.isActive = false;
      this.activeSessions.delete(sessionId);
      
      console.log(`Closed browser session ${sessionId}`);
    } catch (error) {
      console.error(`Failed to close session ${sessionId}:`, error);
    }
  }

  getActiveSessions(): BrowserSession[] {
    return Array.from(this.activeSessions.values()).filter(session => session.isActive);
  }

  async cleanup(): Promise<void> {
    const sessions = Array.from(this.activeSessions.keys());
    await Promise.all(sessions.map(sessionId => this.closeSession(sessionId)));
  }
}

export const browserEngineManager = BrowserEngineManager.getInstance();
