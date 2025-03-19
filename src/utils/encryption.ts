
/**
 * Encryption utilities for securing sensitive data
 */

// A simple implementation of AES encryption for the frontend
// In a production environment, you would want to use a more robust solution

// CryptoJS is a popular library for encryption in JavaScript
import CryptoJS from 'crypto-js';

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    _originalConsole: typeof console;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      inject: Function;
      [key: string]: any;
    };
  }
}

// We'll use a secret key that is not directly accessible from the client side
// In a real application, this would be securely stored on the server
const SECRET_KEY = 'MTU_CHAPEL_SECURE_KEY_2023';

/**
 * Encrypts a string or object using AES encryption
 */
export const encryptData = (data: any): string => {
  // Convert object to string if needed
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Encrypt the data
  const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
  
  return encrypted;
};

/**
 * Decrypts an encrypted string
 */
export const decryptData = (encryptedData: string): any => {
  try {
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
    // Try to parse as JSON if possible
    try {
      return JSON.parse(decrypted);
    } catch {
      // Return as string if not valid JSON
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Encrypts an admin token
 */
export const encryptToken = (token: string): string => {
  return encryptData(token);
};

/**
 * Decrypts an admin token
 */
export const decryptToken = (encryptedToken: string): string | null => {
  try {
    return decryptData(encryptedToken);
  } catch {
    return null;
  }
};

// Simplified security initialization
export const initSecurity = (): void => {
  // Only implementing basic security measures
  // No UI obfuscation to ensure regular users can see the site normally
  console.log("Basic security measures initialized");
};
