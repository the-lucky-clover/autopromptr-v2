
export class PIIService {
  maskData(data: string, type: 'email' | 'phone' | 'ssn' | 'credit_card'): string {
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

  detectPII(text: string): string[] {
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      ssn: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g,
      creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
    };

    const detected: string[] = [];
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      if (pattern.test(text)) {
        detected.push(type);
      }
    });

    return detected;
  }

  sanitizePII(text: string): string {
    let sanitized = text;
    
    // Email
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
    
    // Phone
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
    
    // SSN
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, '[SSN]');
    
    // Credit Card
    sanitized = sanitized.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CREDIT_CARD]');
    
    return sanitized;
  }
}
