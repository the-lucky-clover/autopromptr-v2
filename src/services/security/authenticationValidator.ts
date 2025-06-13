
import { createClient } from "@supabase/supabase-js";

export class AuthenticationValidator {
  private static supabase = createClient(
    process.env.SUPABASE_URL || 'https://ccvahojhqurgprlhhyzc.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Validate session token and return user info
  static async validateSession(token: string): Promise<{ 
    valid: boolean; 
    user?: any; 
    error?: string 
  }> {
    try {
      if (!token) {
        return { valid: false, error: 'No token provided' };
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/, '');

      const { data: { user }, error } = await this.supabase.auth.getUser(cleanToken);
      
      if (error || !user) {
        return { 
          valid: false, 
          error: error?.message || 'Invalid or expired token' 
        };
      }

      // Additional checks for session freshness
      const tokenPayload = this.parseJWT(cleanToken);
      if (tokenPayload && tokenPayload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp < now) {
          return { valid: false, error: 'Token expired' };
        }
      }

      return { valid: true, user };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Token validation failed' 
      };
    }
  }

  // Parse JWT token without verification (for extracting expiry)
  private static parseJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  // Validate request origin and headers
  static validateRequestSecurity(request: Request): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    // Check for required headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      errors.push('Missing authorization header');
    }

    // Validate Content-Type for POST requests
    if (request.method === 'POST') {
      const contentType = request.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        errors.push('Invalid content type for POST request');
      }
    }

    // Check for suspicious user agents
    const userAgent = request.headers.get('User-Agent');
    if (!userAgent || userAgent.length < 10) {
      errors.push('Suspicious or missing user agent');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Rate limiting check based on user ID
  static async checkRateLimit(
    userId: string, 
    action: string, 
    limit: number, 
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const windowStart = new Date(Date.now() - windowMs).toISOString();
      
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('created_at')
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', windowStart);

      if (error) {
        console.error('Rate limit check failed:', error);
        return { allowed: false, remaining: 0 };
      }

      const currentCount = data?.length || 0;
      const allowed = currentCount < limit;
      const remaining = Math.max(0, limit - currentCount);

      return { allowed, remaining };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { allowed: false, remaining: 0 };
    }
  }

  // Log authentication events
  static async logAuthEvent(
    userId: string, 
    action: string, 
    success: boolean, 
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        resource_type: 'authentication',
        details: { 
          success, 
          timestamp: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent 
        },
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log auth event:', error);
    }
  }
}
