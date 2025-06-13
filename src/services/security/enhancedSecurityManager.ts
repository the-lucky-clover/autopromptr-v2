
import { SecureEncryptionService } from './secureEncryptionService';
import { AuditService } from './auditService';
import { InputValidationService } from './inputValidationService';
import { PIIService } from './piiService';
import { RateLimitService } from './rateLimitService';
import { GDPRService } from './gdprService';
import { KeyDerivationService } from './keyDerivationService';

export interface EnhancedSecurityConfig {
  encryptionKey?: string;
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
  rateLimiting: {
    authAttempts: { limit: number; windowMs: number };
    apiCalls: { limit: number; windowMs: number };
  };
}

export class EnhancedSecurityManager {
  private static instance: EnhancedSecurityManager;
  
  public readonly encryption: SecureEncryptionService;
  public readonly audit: AuditService;
  public readonly validation: InputValidationService;
  public readonly pii: PIIService;
  public readonly rateLimit: RateLimitService;
  public readonly gdpr: GDPRService;
  public readonly keyDerivation: typeof KeyDerivationService;
  
  private config: EnhancedSecurityConfig;

  private constructor(config?: Partial<EnhancedSecurityConfig>, userId?: string, authToken?: string) {
    this.config = {
      maxLoginAttempts: 5,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true
      },
      rateLimiting: {
        authAttempts: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
        apiCalls: { limit: 100, windowMs: 60 * 1000 }, // 100 calls per minute
      },
      ...config
    };

    // Validate encryption key on initialization
    if (this.config.encryptionKey && !KeyDerivationService.validateKey(this.config.encryptionKey)) {
      throw new Error('Invalid encryption key provided. Key must be secure and not use default values.');
    }

    this.encryption = new SecureEncryptionService(userId, authToken);
    this.audit = new AuditService();
    this.validation = InputValidationService;
    this.pii = new PIIService();
    this.rateLimit = new RateLimitService();
    this.gdpr = new GDPRService();
    this.keyDerivation = KeyDerivationService;
  }

  public static getInstance(config?: Partial<EnhancedSecurityConfig>, userId?: string, authToken?: string): EnhancedSecurityManager {
    if (!EnhancedSecurityManager.instance) {
      EnhancedSecurityManager.instance = new EnhancedSecurityManager(config, userId, authToken);
    }
    return EnhancedSecurityManager.instance;
  }

  // Reset instance for new user context
  public static resetInstance(userId?: string, authToken?: string, config?: Partial<EnhancedSecurityConfig>): EnhancedSecurityManager {
    EnhancedSecurityManager.instance = new EnhancedSecurityManager(config, userId, authToken);
    return EnhancedSecurityManager.instance;
  }

  getConfig(): EnhancedSecurityConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<EnhancedSecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Comprehensive security validation for user inputs
  async validateUserInput(input: {
    text?: string;
    email?: string;
    password?: string;
    url?: string;
    file?: File;
    json?: string;
  }): Promise<{ valid: boolean; errors: string[]; sanitized?: any }> {
    const errors: string[] = [];
    const sanitized: any = {};

    if (input.text !== undefined) {
      sanitized.text = this.validation.sanitizeText(input.text);
    }

    if (input.email !== undefined) {
      if (!this.validation.validateEmail(input.email)) {
        errors.push('Invalid email format');
      } else {
        sanitized.email = input.email.toLowerCase().trim();
      }
    }

    if (input.password !== undefined) {
      const passwordValidation = this.validation.validatePasswordStrength(input.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      } else {
        sanitized.password = input.password;
        sanitized.passwordStrength = passwordValidation.strength;
      }
    }

    if (input.url !== undefined) {
      const sanitizedUrl = this.validation.sanitizeUrl(input.url);
      if (!sanitizedUrl && input.url) {
        errors.push('Invalid or unsafe URL');
      } else {
        sanitized.url = sanitizedUrl;
      }
    }

    if (input.file !== undefined) {
      const fileValidation = this.validation.validateFileUpload(input.file);
      if (!fileValidation.valid) {
        errors.push(...fileValidation.errors);
      } else {
        sanitized.file = input.file;
      }
    }

    if (input.json !== undefined) {
      const jsonValidation = this.validation.validateAndParseJson(input.json);
      if (!jsonValidation.valid) {
        errors.push(jsonValidation.error || 'Invalid JSON');
      } else {
        sanitized.json = jsonValidation.data;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: errors.length === 0 ? sanitized : undefined
    };
  }

  // Security health check
  async performSecurityHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check encryption key
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || !KeyDerivationService.validateKey(encryptionKey)) {
      issues.push('Weak or missing encryption key');
      recommendations.push('Set a strong ENCRYPTION_KEY environment variable');
    }

    // Check if we're in production with secure settings
    if (process.env.NODE_ENV === 'production') {
      if (!window.location.protocol.includes('https')) {
        issues.push('Not using HTTPS in production');
        recommendations.push('Enable HTTPS for production deployment');
      }
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (issues.length > 0) {
      status = issues.some(issue => 
        issue.includes('encryption') || 
        issue.includes('HTTPS')
      ) ? 'critical' : 'warning';
    }

    return { status, issues, recommendations };
  }
}

export const createEnhancedSecurityManager = (userId?: string, authToken?: string, config?: Partial<EnhancedSecurityConfig>) => {
  return EnhancedSecurityManager.resetInstance(userId, authToken, config);
};
