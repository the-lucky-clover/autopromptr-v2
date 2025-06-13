
import CryptoJS from "crypto-js";

export class KeyDerivationService {
  private static readonly PBKDF2_ITERATIONS = 100000;
  private static readonly SALT_LENGTH = 32;

  // Generate a user-specific encryption key from their auth token
  static deriveUserKey(userId: string, authToken: string): string {
    if (!userId || !authToken) {
      throw new Error('User ID and auth token are required for key derivation');
    }

    // Create a user-specific salt
    const salt = CryptoJS.SHA256(userId + 'autopromptr_salt').toString();
    
    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(authToken, salt, {
      keySize: 256/32,
      iterations: this.PBKDF2_ITERATIONS
    });

    return key.toString();
  }

  // Generate a secure random encryption key for the application
  static generateSecureKey(): string {
    const randomBytes = CryptoJS.lib.WordArray.random(32);
    return CryptoJS.SHA256(randomBytes).toString();
  }

  // Validate that an encryption key meets security requirements
  static validateKey(key: string): boolean {
    if (!key || key.length < 32) return false;
    if (key === 'default-key-change-in-production') return false;
    if (key.includes('default') || key.includes('change')) return false;
    return true;
  }

  // Generate a secure salt for user-specific operations
  static generateUserSalt(userId: string): string {
    return CryptoJS.SHA256(userId + Date.now().toString()).toString().substring(0, 32);
  }
}
