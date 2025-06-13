
import { supabase } from '@/integrations/supabase/client';

export interface BrowserConfig {
  headless: boolean;
  viewport?: { width: number; height: number };
  userAgent?: string;
  timeout: number;
  retryAttempts: number;
  antiDetection: boolean;
}

export interface BrowserOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  screenshots?: string[];
  logs?: string[];
}

export class BrowserClientProxy {
  async createSession(config: BrowserConfig): Promise<string> {
    const { data, error } = await supabase.functions.invoke('browser-session-manager', {
      body: { ...config, action: 'create' }
    });

    if (error) throw new Error(`Failed to create browser session: ${error.message}`);
    if (!data.success) throw new Error(data.error || 'Session creation failed');

    return data.sessionId;
  }

  async executeOperation(sessionId: string, operation: string, params: any = {}): Promise<BrowserOperationResult> {
    const { data, error } = await supabase.functions.invoke('browser-automation-engine', {
      body: {
        sessionId,
        operation,
        params
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  }

  async closeSession(sessionId: string): Promise<void> {
    await supabase.functions.invoke('browser-session-manager', {
      body: { sessionId, action: 'delete' }
    });
  }

  async getSessionInfo(sessionId: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('browser-session-manager', {
      body: { sessionId, action: 'get' }
    });

    if (error) throw error;
    return data;
  }
}
