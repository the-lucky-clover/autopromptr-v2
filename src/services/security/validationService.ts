
export class ValidationService {
  sanitizeInput(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

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

  validatePassword(password: string, policy: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

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
}
