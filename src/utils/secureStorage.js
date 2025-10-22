/**
 * Secure Storage Utility
 * Provides basic encryption for localStorage data
 * NOTE: This is NOT military-grade encryption, but adds a layer of obfuscation
 * For true security, you need a backend server
 */

// Simple XOR cipher for obfuscation (better than plain text)
const SECRET_KEY = 'MacroGenie_Secure_2024_XYZ'; // In production, this should be more complex

function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
}

function xorDecrypt(encoded, key) {
  try {
    const text = atob(encoded); // Base64 decode
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    console.error('Decryption error:', e);
    return null;
  }
}

/**
 * Set encrypted data in localStorage
 */
export const setSecureItem = (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    const encrypted = xorEncrypt(jsonString, SECRET_KEY);
    localStorage.setItem(key, encrypted);
    return true;
  } catch (error) {
    console.error('Error setting secure item:', error);
    return false;
  }
};

/**
 * Get and decrypt data from localStorage
 */
export const getSecureItem = (key) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    const decrypted = xorDecrypt(encrypted, SECRET_KEY);
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error getting secure item:', error);
    return null;
  }
};

/**
 * Remove item from localStorage
 */
export const removeSecureItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing secure item:', error);
    return false;
  }
};

/**
 * Clear all secure storage
 */
export const clearSecureStorage = () => {
  try {
    // Only clear MacroGenie keys
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('macroGenie_')) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing secure storage:', error);
    return false;
  }
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Basic XSS prevention - escape HTML special characters
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate and sanitize user data
 */
export const sanitizeUserData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeUserData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};




