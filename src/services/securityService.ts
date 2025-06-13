
import { supabase } from "@/integrations/supabase/client";
import { SecureEncryptionService } from "./security/secureEncryptionService";
import { InputValidationService } from "./security/inputValidationService";

export interface SecurityConfig {
  encryptionKey: string;
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
}

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

export class SecurityService {
  private static instance: SecurityService;
  private encryptionService: SecureEncryptionService;
  private config: SecurityConfig;

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  constructor() {
    this.config = {
      encryptionKey: process.env.ENCRYPTION_KEY || 'default-key-change-in-production',
      maxLoginAttempts: 5,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true
      }
    };

    this.encryptionService = new SecureEncryptionService();
  }

  async initializeWithUser(userId: string): Promise<void> {
    try {
      console.log(`Security manager initialized for user: ${userId}`);
    } catch (error) {
      console.error('Error initializing security manager:', error);
    }
  }

  async encryptSensitiveData(data: string): Promise<string> {
    return this.encryptionService.encryptSensitiveData(data);
  }

  async decryptSensitiveData(encryptedData: string): Promise<string> {
    return this.encryptionService.decryptSensitiveData(encryptedData);
  }

  maskPII(data: string, type: 'email' | 'phone' | 'ssn' | 'credit_card'): string {
    switch (type) {
      case 'email':
        const [localPart, domain] = data.split('@');
        return `${localPart.substring(0, 2)}***@${domain}`;
      case 'phone':
        return data.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
      case 'ssn':
        return data.replace(/(\d{3})\d{2}(\d{4})/, '$1**$2');
      case 'credit_card':
        return data.replace(/(\d{4})\d{8}(\d{4})/, '$1********$2');
      default:
        return '***';
    }
  }

  // Audit logging with correlation IDs
  async logAuditEvent(event: AuditEvent): Promise<void> {
    try {
      const auditData = {
        user_id: event.userId,
        action: event.action,
        resource_type: event.resource,
        resource_id: event.resourceId,
        details: { ...event.details, correlationId: event.correlationId },
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        created_at: new Date().toISOString()
      };

      await supabase.from('audit_logs').insert(auditData);
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  generateCorrelationId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  sanitizeInput(input: string): string {
    return InputValidationService.sanitizeText(input);
  }

  validateFile(file: File, allowedTypes: string[], maxSizeKB: number): boolean {
    if (!allowedTypes.includes(file.type)) return false;
    if (file.size > maxSizeKB * 1024) return false;
    return true;
  }

  async checkRateLimit(userId: string, action: string, limit: number, windowMs: number): Promise<boolean> {
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

  async generateApiKey(userId: string): Promise<string> {
    const apiKey = this.encryptionService.generateSecureApiKey();

    try {
      await supabase
        .from('api_tokens')
        .insert({
          user_id: userId,
          token_hash: apiKey,
          name: 'Generated API Key',
          created_at: new Date().toISOString()
        });
      return apiKey;
    } catch (error) {
      console.error('Failed to generate API key:', error);
      throw new Error('Failed to generate API key');
    }
  }

  async revokeApiKey(userId: string, apiKey: string): Promise<void> {
    try {
      await supabase
        .from('api_tokens')
        .delete()
        .eq('user_id', userId)
        .eq('token_hash', apiKey);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      throw new Error('Failed to revoke API key');
    }
  }

  // GDPR compliance methods
  async exportUserData(userId: string): Promise<any> {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId);

      const { data: apiTokenData } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', userId);

      return {
        profile: profileData,
        auditLogs: auditData,
        apiTokens: apiTokenData
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  async deleteUserData(userId: string): Promise<void> {
    try {
      // Delete audit logs
      await supabase
        .from('audit_logs')
        .delete()
        .eq('user_id', userId);

      // Delete API tokens
      await supabase
        .from('api_tokens')
        .delete()
        .eq('user_id', userId);

      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw new Error('Failed to delete user data');
    }
  }
}

export const securityService = SecurityService.getInstance();
