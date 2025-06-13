import { supabase } from "@/integrations/supabase/client";
import { EnhancedSecurityManager, createEnhancedSecurityManager } from "./security/enhancedSecurityManager";
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
  private enhancedManager?: EnhancedSecurityManager;
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
      const { data, error } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to load user security settings:', error);
        return;
      }

      if (data) {
        this.enhancedManager = createEnhancedSecurityManager(data);
      } else {
        this.enhancedManager = createEnhancedSecurityManager({
          user_id: userId,
          mfa_enabled: false,
          security_questions_enabled: false,
          device_binding_enabled: false
        });
      }
    } catch (error) {
      console.error('Error initializing security manager:', error);
    }
  }

  async encryptSensitiveData(data: string): Promise<string> {
    return this.encryptionService.encrypt(data, this.config.encryptionKey);
  }

  async decryptSensitiveData(encryptedData: string): Promise<string> {
    return this.encryptionService.decrypt(encryptedData, this.config.encryptionKey);
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
      if (this.enhancedManager) {
        await this.enhancedManager.audit.logEvent({
          userId: event.userId,
          action: event.action,
          resourceType: event.resource,
          resourceId: event.resourceId,
          details: event.details,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent
        });
        return;
      }

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

  sanitizeInput(input: string): string {
    const validator = new InputValidationService();
    return validator.sanitize(input);
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
    const apiKey = this.encryptionService.generateSecureKey();

    try {
      await supabase
        .from('api_keys')
        .insert({
          user_id: userId,
          api_key: apiKey,
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
        .from('api_keys')
        .delete()
        .eq('user_id', userId)
        .eq('api_key', apiKey);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      throw new Error('Failed to revoke API key');
    }
  }
}

export const securityService = SecurityService.getInstance();
