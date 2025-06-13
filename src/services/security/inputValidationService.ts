
import DOMPurify from 'dompurify';

export class InputValidationService {
  // Comprehensive XSS protection
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    // Configure DOMPurify for strict sanitization
    const cleanHtml = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    });
    
    return cleanHtml;
  }

  // Sanitize text input for safe storage and display
  static sanitizeText(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      .trim();
  }

  // Validate and sanitize URL inputs
  static sanitizeUrl(url: string): string {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      
      // Only allow safe protocols
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return '';
      }
      
      return url;
    } catch (error) {
      return '';
    }
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate password strength
  static validatePasswordStrength(password: string): { 
    isValid: boolean; 
    errors: string[]; 
    strength: 'weak' | 'medium' | 'strong' 
  } {
    const errors: string[] = [];
    let score = 0;

    if (!password) {
      return { isValid: false, errors: ['Password is required'], strength: 'weak' };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    if (password.length >= 12) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 6) strength = 'strong';
    else if (score >= 4) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }

  // Validate file uploads with comprehensive security checks
  static validateFileUpload(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'image/gif',
      'image/webp'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed. Allowed types: text, PDF, JPEG, PNG, GIF, WebP');
    }

    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit');
    }

    if (file.size === 0) {
      errors.push('File is empty');
    }

    // Check for suspicious file names
    if (this.hasSuspiciousFileName(file.name)) {
      errors.push('File name contains potentially dangerous content');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Check for suspicious file name patterns
  private static hasSuspiciousFileName(filename: string): boolean {
    const suspiciousPatterns = [
      /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.com$/i, /\.pif$/i,
      /\.scr$/i, /\.vbs$/i, /\.js$/i, /\.jse$/i, /\.jar$/i,
      /\.php$/i, /\.asp$/i, /\.jsp$/i, /\.py$/i, /\.rb$/i,
      /\.sh$/i, /\.pl$/i, /\.cgi$/i, /\.htaccess$/i,
      /\.\./,     // Directory traversal
      /[<>:"|?*]/, // Invalid filename characters
    ];

    return suspiciousPatterns.some(pattern => pattern.test(filename));
  }

  // Rate limiting validation
  static validateRateLimit(attempts: number, windowMs: number, maxAttempts: number): boolean {
    return attempts < maxAttempts;
  }

  // Validate JSON input safely
  static validateAndParseJson(jsonString: string): { valid: boolean; data?: any; error?: string } {
    try {
      if (!jsonString || jsonString.trim() === '') {
        return { valid: false, error: 'Empty JSON string' };
      }

      const data = JSON.parse(jsonString);
      
      // Additional validation to prevent JSON bombs
      const stringified = JSON.stringify(data);
      if (stringified.length > 1024 * 1024) { // 1MB limit
        return { valid: false, error: 'JSON data too large' };
      }

      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  }
}
