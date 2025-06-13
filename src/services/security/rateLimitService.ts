
import { supabase } from "@/integrations/supabase/client";

export class RateLimitService {
  async checkLimit(userId: string, action: string, limit: number, windowMs: number): Promise<boolean> {
    const windowStart = new Date(Date.now() - windowMs);
    
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('created_at')
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', windowStart.toISOString());

      if (error) {
        console.error('Rate limit check failed:', error);
        return false;
      }

      return (data?.length || 0) < limit;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return false;
    }
  }

  async recordAction(userId: string, action: string): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        resource_type: 'rate_limit',
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to record rate limit action:', error);
    }
  }

  async getRateLimitStatus(userId: string, action: string, windowMs: number): Promise<{
    count: number;
    resetTime: Date;
  }> {
    const windowStart = new Date(Date.now() - windowMs);
    
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('created_at')
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', windowStart.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        count: data?.length || 0,
        resetTime: new Date(Date.now() + windowMs)
      };
    } catch (error) {
      console.error('Failed to get rate limit status:', error);
      return { count: 0, resetTime: new Date() };
    }
  }
}
