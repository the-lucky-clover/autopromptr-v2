
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

  // Initialize with user context
  initializeWithUser(userId: string, authToken: string): void {
    this.enhancedManager = createEnhancedSecurityManager(userId, authToken, {
      encryptionKey: this.config.encryptionKey,
      maxLoginAttempts: this.config.maxLoginAttempts,
      sessionTimeout: this.config.sessionTimeout,
      passwordPolicy: this.config.passwordPolicy,
      rateLimiting: {
        authAttempts: { limit: 5, windowMs: 15 * 60 * 1000 },
        apiCalls: { limit: 100, windowMs: 60 * 1000 }
      }
    });
  }

  // Field-level encryption for sensitive data
  encryptSensitiveData(data: string): string {
    try {
      if (this.enhancedManager) {
        return this.enhancedManager.encryption.encryptSensitiveData(data);
      }
      return this.encryptionService.encryptSensitiveData(data);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  decryptSensitiveData(encryptedData: string): string {
    try {
      if (this.enhancedManager) {
        return this.enhancedManager.encryption.decryptSensitiveData(encryptedData);
      }
      return this.encryptionService.decryptSensitiveData(encryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  // Data masking for PII
  maskPII(data: string, type: 'email' | 'phone' | 'ssn' | 'credit_card'): string {
    if (this.enhancedManager) {
      return this.enhancedManager.pii.maskData(data, type);
    }
    
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

  // Input sanitization
  sanitizeInput(input: string): string {
    return InputValidationService.sanitizeText(input);
  }

  // Validate file uploads
  validateFileUpload(file: File): { valid: boolean; errors: string[] } {
    return InputValidationService.validateFileUpload(file);
  }

  // Rate limiting check
  async checkRateLimit(userId: string, action: string, limit: number, windowMs: number): Promise<boolean> {
    if (this.enhancedManager) {
      const result = await this.enhancedManager.rateLimit.checkLimit(userId, action, limit, windowMs);
      return result.allowed;
    }

    const windowStart = new Date(Date.now() - windowMs);
    
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
  }

  // Generate secure API key
  generateSecureApiKey(length: number = 32): string {
    if (this.enhancedManager) {
      return this.enhancedManager.encryption.generateSecureApiKey(length);
    }

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return result;
  }

  // Hash API key for storage
  hashApiKey(apiKey: string): string {
    if (this.enhancedManager) {
      return this.enhancedManager.encryption.hashData(apiKey);
    }
    return this.encryptionService.hashData(apiKey);
  }

  // Validate password against policy
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const validation = InputValidationService.validatePasswordStrength(password);
    return {
      valid: validation.isValid,
      errors: validation.errors
    };
  }

  // GDPR data export
  async exportUserData(userId: string): Promise<any> {
    if (this.enhancedManager) {
      return await this.enhancedManager.gdpr.exportUserData(userId);
    }

    try {
      const userDataTables = [
        'profiles',
        'prompt_batches', 
        'prompts',
        'user_usage',
        'notifications'
      ];

      const exportData: Record<string, any> = {};

      for (const tableName of userDataTables) {
        try {
          const { data, error } = await supabase
            .from(tableName as any)
            .select('*')
            .eq('user_id', userId);

          if (!error && data) {
            exportData[tableName] = data;
          }
        } catch (tableError) {
          console.error(`Failed to export data from ${tableName}:`, tableError);
        }
      }

      return exportData;
    } catch (error) {
      console.error('Data export failed:', error);
      throw new Error('Failed to export user data');
    }
  }

  // GDPR data deletion
  async deleteUserData(userId: string): Promise<void> {
    if (this.enhancedManager) {
      await this.enhancedManager.gdpr.deleteUserData(userId);
      return;
    }

    try {
      const userDataTables = [
        'user_usage',
        'notifications', 
        'prompts',
        'prompt_batches',
        'profiles'
      ];

      for (const tableName of userDataTables) {
        try {
          await supabase
            .from(tableName as any)
            .delete()
            .eq('user_id', userId);
        } catch (tableError) {
          console.error(`Failed to delete data from ${tableName}:`, tableError);
        }
      }
    } catch (error) {
      console.error('Data deletion failed:', error);
      throw new Error('Failed to delete user data');
    }
  }

  // Get enhanced security manager instance
  getEnhancedManager(): EnhancedSecurityManager | undefined {
    return this.enhancedManager;
  }
}

export const securityService = SecurityService.getInstance();
