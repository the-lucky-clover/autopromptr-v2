
import CryptoJS from "crypto-js";
import { KeyDerivationService } from "./keyDerivationService";

export class SecureEncryptionService {
  private userKey: string;
  private masterKey: string;

  constructor(userId?: string, authToken?: string) {
    // Validate master key exists and is secure
    this.masterKey = process.env.ENCRYPTION_KEY || '';
    if (!KeyDerivationService.validateKey(this.masterKey)) {
      throw new Error('Invalid or missing ENCRYPTION_KEY. Please set a secure encryption key in environment variables.');
    }

    // Generate user-specific key if provided
    if (userId && authToken) {
      this.userKey = KeyDerivationService.deriveUserKey(userId, authToken);
    } else {
      this.userKey = this.masterKey;
    }
  }

  // Encrypt sensitive data with user-specific key
  encryptSensitiveData(data: string): string {
    try {
      if (!data) return '';
      
      // Add timestamp and random nonce for additional security
      const timestamp = Date.now().toString();
      const nonce = CryptoJS.lib.WordArray.random(16).toString();
      const payload = JSON.stringify({ data, timestamp, nonce });
      
      return CryptoJS.AES.encrypt(payload, this.userKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  // Decrypt sensitive data with user-specific key
  decryptSensitiveData(encryptedData: string): string {
    try {
      if (!encryptedData) return '';
      
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.userKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Failed to decrypt data - invalid key or corrupted data');
      }
      
      const payload = JSON.parse(decryptedText);
      return payload.data || decryptedText;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  // Mask sensitive data for display (show only last 4 characters)
  maskSensitiveData(data: string): string {
    if (!data || data.length <= 4) return '****';
    return '*'.repeat(data.length - 4) + data.slice(-4);
  }

  // Hash data for secure storage/comparison
  hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
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
}
