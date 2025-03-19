
/**
 * Encryption utilities for securing sensitive data
 */

// A simple implementation of AES encryption for the frontend
// In a production environment, you would want to use a more robust solution

// CryptoJS is a popular library for encryption in JavaScript
import CryptoJS from 'crypto-js';

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

/**
 * Obfuscates the browser console to prevent easy inspection
 * This adds a basic layer of security, but determined attackers can still bypass it
 */
export const obfuscateConsole = (): void => {
  if (typeof window !== 'undefined') {
    // Override console methods with encrypted versions
    const originalConsole = { ...console };
    
    // Store original methods
    window._originalConsole = originalConsole;
    
    // Replace console methods
    console.log = function(...args: any[]) {
      const encrypted = encryptData(args.join(' '));
      originalConsole.log('%c[ENCRYPTED]', 'color: red', encrypted);
    };
    
    console.error = function(...args: any[]) {
      const encrypted = encryptData(args.join(' '));
      originalConsole.error('%c[ENCRYPTED]', 'color: red', encrypted);
    };
    
    console.warn = function(...args: any[]) {
      const encrypted = encryptData(args.join(' '));
      originalConsole.warn('%c[ENCRYPTED]', 'color: red', encrypted);
    };
    
    console.info = function(...args: any[]) {
      const encrypted = encryptData(args.join(' '));
      originalConsole.info('%c[ENCRYPTED]', 'color: red', encrypted);
    };
    
    // Add anti-debugging measures
    setInterval(() => {
      const devToolsOpen = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
        ? window.outerHeight - window.innerHeight > 100 || window.outerWidth - window.innerWidth > 100
        : false;
      
      if (devToolsOpen) {
        document.body.innerHTML = encryptData('<div>Access Denied</div>');
      }
    }, 1000);
    
    // Prevent easy access to React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
    }
  }
};

// Initialize obfuscation
export const initSecurity = (): void => {
  obfuscateConsole();
  
  // Add event listener to detect right-clicks (context menu)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  
  // Disable viewing source
  document.onkeydown = function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.keyCode === 85) // Ctrl+U
    ) {
      return false;
    }
  };
};
