// src/lib/sync/crypto.ts

// The cryptographic algorithms and parameters used.
const ALGORITHM_KEY_DERIVATION = 'PBKDF2';
const ALGORITHM_KEY_ENCRYPTION = 'AES-GCM';
const PBKDF2_ITERATIONS = 100000;
const AES_KEY_LENGTH = 256;
const IV_LENGTH_BYTES = 12; // 96 bits for AES-GCM

/**
 * Derives a symmetric encryption key from a session token using PBKDF2.
 * This function implements the Session-Derived Key pattern.
 * @param sessionToken The user's session token or an equivalent high-entropy string.
 * @param salt A unique salt for key derivation (e.g., user ID or a fixed application string).
 * @returns A CryptoKey object suitable for AES-GCM encryption/decryption.
 */
export async function deriveEncryptionKey(sessionToken: string, salt: string): Promise<CryptoKey> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not available.');
  }

  const tokenBuffer = new TextEncoder().encode(sessionToken);
  const saltBuffer = new TextEncoder().encode(salt);

  // 1. Import the session token as a "raw" key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    tokenBuffer,
    { name: ALGORITHM_KEY_DERIVATION },
    false, // not extractable
    ['deriveKey'],
  );

  // 2. Define PBKDF2 parameters
  const pbkdf2Params: Pbkdf2Params = {
    name: ALGORITHM_KEY_DERIVATION,
    salt: saltBuffer,
    iterations: PBKDF2_ITERATIONS,
    hash: 'SHA-256',
  };

  // 3. Derive the final symmetric key
  const derivedKey = await window.crypto.subtle.deriveKey(
    pbkdf2Params,
    baseKey,
    { name: ALGORITHM_KEY_ENCRYPTION, length: AES_KEY_LENGTH },
    false, // not extractable
    ['encrypt', 'decrypt'],
  );

  return derivedKey;
}

/**
 * Encrypts data using an AES-GCM derived key.
 * The output format is: Base64(IV):Base64(Ciphertext)
 * @param key The CryptoKey obtained from deriveEncryptionKey.
 * @param data The string data to encrypt.
 * @returns A string containing the Base64 encoded IV and ciphertext, separated by a colon.
 */
export async function encryptData(key: CryptoKey, data: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not available.');
  }
  
  const dataBuffer = new TextEncoder().encode(data);
  // Generate a random IV for AES-GCM
  const ivBuffer = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
  
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: ALGORITHM_KEY_ENCRYPTION, iv: ivBuffer },
    key,
    dataBuffer,
  );

  // WebCrypto AES-GCM returns a combined buffer: Ciphertext || AuthTag (16 bytes)
  const tagLength = 16;
  const combined = new Uint8Array(cipherBuffer);
  const cipherTextBuffer = combined.slice(0, combined.byteLength - tagLength).buffer;
  const authTagBuffer = combined.slice(combined.byteLength - tagLength).buffer;

  const ivBase64 = arrayBufferToBase64(ivBuffer.buffer);
  const cipherBase64 = arrayBufferToBase64(cipherTextBuffer);
  const authTagBase64 = arrayBufferToBase64(authTagBuffer);

  // Format: Base64(IV):Base64(Ciphertext):Base64(AuthTag)
  return `${ivBase64}:${cipherBase64}:${authTagBase64}`;
}

/**
 * Decrypts data using an AES-GCM derived key.
 * @param key The CryptoKey obtained from deriveEncryptionKey.
 * @param encryptedData A string containing the Base64 encoded IV and ciphertext, separated by a colon.
 * @returns The decrypted string data.
 */
export async function decryptData(key: CryptoKey, encryptedData: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not available.');
  }
  
  const parts = encryptedData.split(':');
  
  // Since the client now sends/expects 3 parts, we must update the check and decoding
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format: expected IV:Ciphertext:AuthTag');
  }
  
  const [ivBase64, cipherBase64, authTagBase64] = parts;
  const ivBuffer = base64ToArrayBuffer(ivBase64);
  const cipherTextBuffer = base64ToArrayBuffer(cipherBase64);
  const authTagBuffer = base64ToArrayBuffer(authTagBase64);
  
  // Combine Ciphertext and AuthTag for WebCrypto's decrypt
  const combinedBuffer = new Uint8Array(cipherTextBuffer.byteLength + authTagBuffer.byteLength);
  combinedBuffer.set(new Uint8Array(cipherTextBuffer), 0);
  combinedBuffer.set(new Uint8Array(authTagBuffer), cipherTextBuffer.byteLength);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: ALGORITHM_KEY_ENCRYPTION, iv: ivBuffer },
    key,
    combinedBuffer.buffer, // Pass the combined buffer
  );

  return new TextDecoder().decode(decryptedBuffer);
}

// Helper functions for Base64 conversion (Web API only)

/** Converts an ArrayBuffer to a Base64 string using standard browser APIs (btoa). */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Converts a Base64 string to an ArrayBuffer using standard browser APIs (atob). */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}