
import { supabase } from "@/integrations/supabase/client";
import CryptoJS from "crypto-js";

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
  }

  // Field-level encryption for sensitive data
  encryptSensitiveData(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.config.encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  decryptSensitiveData(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.config.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  // Data masking for PII
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
    // Remove potentially dangerous characters and patterns
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Validate file uploads
  validateFileUpload(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    if (file.size > maxSize) {
      errors.push('File size exceeds limit');
    }

    // Check for malicious content signatures
    if (this.hasMaliciousSignature(file.name)) {
      errors.push('File contains potentially malicious content');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private hasMaliciousSignature(filename: string): boolean {
    const maliciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.vbs$/i,
      /\.js$/i,
      /\.jar$/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(filename));
  }

  // Rate limiting check
  async checkRateLimit(userId: string, action: string, limit: number, windowMs: number): Promise<boolean> {
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
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return result;
  }

  // Hash API key for storage
  hashApiKey(apiKey: string): string {
    return CryptoJS.SHA256(apiKey).toString();
  }

  // Validate password against policy
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.config.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // GDPR data export
  async exportUserData(userId: string): Promise<any> {
    try {
      const tables = [
        'profiles',
        'prompt_batches',
        'prompts',
        'user_usage',
        'notifications'
      ];

      const exportData: Record<string, any> = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', userId);

        if (!error && data) {
          exportData[table] = data;
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
    try {
      const tables = [
        'user_usage',
        'notifications',
        'prompts',
        'prompt_batches',
        'profiles'
      ];

      for (const table of tables) {
        await supabase
          .from(table)
          .delete()
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Data deletion failed:', error);
      throw new Error('Failed to delete user data');
    }
  }
}

export const securityService = SecurityService.getInstance();
