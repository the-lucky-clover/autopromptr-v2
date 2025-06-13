
import { supabase } from "@/integrations/supabase/client";

export interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  correlationId: string;
}

export class AuditService {
  async logEvent(event: AuditEvent): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        user_id: event.userId,
        action: event.action,
        resource_type: event.resource,
        resource_id: event.resourceId,
        details: event.details,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  generateCorrelationId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getAuditTrail(userId: string, limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to retrieve audit trail:', error);
      return [];
    }
  }
}
