
import { EncryptionService } from './encryptionService';
import { AuditService } from './auditService';
import { ValidationService } from './validationService';
import { PIIService } from './piiService';
import { RateLimitService } from './rateLimitService';
import { GDPRService } from './gdprService';

export interface SecurityConfig {
  encryptionKey?: string;
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
}

export class SecurityManager {
  private static instance: SecurityManager;
  
  public readonly encryption: EncryptionService;
  public readonly audit: AuditService;
  public readonly validation: ValidationService;
  public readonly pii: PIIService;
  public readonly rateLimit: RateLimitService;
  public readonly gdpr: GDPRService;
  
  private config: SecurityConfig;

  private constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      maxLoginAttempts: 5,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true
      },
      ...config
    };

    this.encryption = new EncryptionService(this.config.encryptionKey);
    this.audit = new AuditService();
    this.validation = new ValidationService();
    this.pii = new PIIService();
    this.rateLimit = new RateLimitService();
    this.gdpr = new GDPRService();
  }

  public static getInstance(config?: Partial<SecurityConfig>): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager(config);
    }
    return SecurityManager.instance;
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const securityManager = SecurityManager.getInstance();
