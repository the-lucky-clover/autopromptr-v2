
import CryptoJS from "crypto-js";
import { KeyDerivationService } from "./keyDerivationService";

export class EncryptionService {
  private encryptionKey: string;

  constructor(encryptionKey?: string) {
    this.encryptionKey = encryptionKey || process.env.ENCRYPTION_KEY || '';
    
    // Validate encryption key on initialization
    if (!KeyDerivationService.validateKey(this.encryptionKey)) {
      throw new Error('CRITICAL SECURITY ERROR: Invalid or missing ENCRYPTION_KEY. Please set a secure encryption key in environment variables. Do not use default keys in production.');
    }
  }

  encryptData(data: string): string {
    try {
      if (!data) return '';
      
      // Add timestamp and nonce for additional security
      const timestamp = Date.now().toString();
      const nonce = CryptoJS.lib.WordArray.random(16).toString();
      const payload = JSON.stringify({ data, timestamp, nonce });
      
      return CryptoJS.AES.encrypt(payload, this.encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decryptData(encryptedData: string): string {
    try {
      if (!encryptedData) return '';
      
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Failed to decrypt data - invalid key or corrupted data');
      }
      
      // Try to parse as enhanced format first, fall back to simple format
      try {
        const payload = JSON.parse(decryptedText);
        return payload.data || decryptedText;
      } catch {
        return decryptedText;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  generateSecureKey(length: number = 32): string {
    return KeyDerivationService.generateSecureKey();
  }

  hashKey(key: string): string {
    return CryptoJS.SHA256(key).toString();
  }
}
