// src/lib/sync/crypto-server.ts
// Server-side implementation of cryptographic functions using Node.js 'crypto' module

import { createHmac, createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'crypto';

// Configuration must match client-side (src/lib/sync/crypto.ts)
const ALGORITHM_KEY_DERIVATION = 'sha256';
const ALGORITHM_ENCRYPTION = 'aes-256-gcm';
const PBKDF2_ITERATIONS = 100000;
const IV_LENGTH_BYTES = 12; // 96 bits for AES-GCM

/**
 * Derives a symmetric encryption key from a session token using PBKDF2.
 * @param sessionToken The user's session token.
 * @param salt A unique salt for key derivation (e.g., user ID).
 * @returns A Buffer containing the derived key.
 */
export function deriveEncryptionKeyServer(sessionToken: string, salt: string): Buffer {
    // We use PBKDF2 to derive a 32-byte (256-bit) key
    const derivedKey = pbkdf2Sync(
        sessionToken, 
        salt, 
        PBKDF2_ITERATIONS, 
        32, // 256 bits / 8 = 32 bytes
        ALGORITHM_KEY_DERIVATION
    );
    return derivedKey;
}

/**
 * Encrypts data using AES-256-GCM.
 * The output format is: Base64(IV):Base64(Ciphertext):Base64(AuthTag)
 * @param key The Buffer key obtained from deriveEncryptionKeyServer.
 * @param data The string data to encrypt.
 * @returns A string containing the Base64 encoded IV, ciphertext, and auth tag, separated by colons.
 */
export function encryptDataServer(key: Buffer, data: string): string {
    const iv = randomBytes(IV_LENGTH_BYTES);
    const cipher = createCipheriv(ALGORITHM_ENCRYPTION, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();

    const ivBase64 = iv.toString('base64');
    const authTagBase64 = authTag.toString('base64');
    
    // Client-side expects IV:Ciphertext. We'll include the AuthTag to be robust
    // but the client-side protocol might need adjustment if it only handles IV:Ciphertext.
    // However, the client uses WebCrypto AES-GCM which automatically handles the AuthTag 
    // when serializing ArrayBuffer to Base64 in `protocol.ts` (lines 76-77).
    // Let's match the client format: IV:Ciphertext, ensuring the ciphertext includes the AuthTag.
    // Node's GCM usually appends the tag to the ciphertext buffer or provides it separately.
    // For simplicity and compatibility with the existing client protocol which expects two parts (IV:Ciphertext),
    // we need to ensure the client-side `decryptData` can handle the tag embedded or correctly.

    // Looking at the client code: src/lib/sync/crypto.ts: 76-79
    // The client serializes IV and CipherBuffer separately. The WebCrypto API handles GCM's AuthTag internally.
    // The structure needs to be `IV:Ciphertext`, where `Ciphertext` is just the encrypted content.
    
    // Let's modify the server output to be compatible with the client's split logic, 
    // ensuring the client's decryption works by passing `authTag` via AAD or internal mechanism.
    // Node.js implementation of GCM requires setting the AuthTag on the decipher object before decrypting.
    
    // New server format: IV:Ciphertext:AuthTag
    return `${ivBase64}:${encrypted}:${authTagBase64}`;
}

/**
 * Decrypts data using AES-256-GCM.
 * @param key The Buffer key obtained from deriveEncryptionKeyServer.
 * @param encryptedData A string containing the Base64 encoded IV, ciphertext, and auth tag, separated by colons.
 * @returns The decrypted string data.
 */
export function decryptDataServer(key: Buffer, encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format: expected IV:Ciphertext:AuthTag');
    }
    
    const [ivBase64, cipherBase64, authTagBase64] = parts;
    
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    const encryptedText = Buffer.from(cipherBase64, 'base64');

    const decipher = createDecipheriv(ALGORITHM_ENCRYPTION, key, iv);
    decipher.setAuthTag(authTag); // Set AuthTag before decryption

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}

// NOTE: Since the client-side only returns IV:Ciphertext, the server-side needs to be updated 
// to handle IV:Ciphertext:AuthTag, or the client needs to be modified.
// Since the goal is server implementation, I will make a note to check client compatibility later,
// but for the sake of the API implementation, I will assume the server must be robust 
// and implement full AES-GCM with AuthTag, adjusting the client if necessary in a future step.
// However, to make the client work *right now*, I will check the client-side `crypto.ts` again.

// Checking src/lib/sync/crypto.ts: 70-79
/*
 70 |   const cipherBuffer = await window.crypto.subtle.encrypt(
 71 |     { name: ALGORITHM_KEY_ENCRYPTION, iv: ivBuffer },
 72 |     key,
 73 |     dataBuffer,
 74 |   );
 75 | 
 76 |   const ivBase64 = arrayBufferToBase64(ivBuffer);
 77 |   const cipherBase64 = arrayBufferToBase64(cipherBuffer);
 78 | 
 79 |   return `${ivBase64}:${cipherBase64}`;
*/
// WebCrypto AES-GCM typically returns a buffer where the AuthTag is concatenated to the ciphertext.
// If the client's `cipherBuffer` (line 74) is just the ciphertext, then the AuthTag is missing.
// If it includes the AuthTag, `arrayBufferToBase64` encodes the combined buffer, and `decryptData` 
// needs to know how to split it, which it doesn't seem to do based on lines 99-105.

// ASSUMPTION: The client-side `crypto.ts` is currently flawed in its handling of the AuthTag for AES-GCM 
// serialization/deserialization, as it only uses `IV:Ciphertext` but doesn't handle the tag explicitly.
// Since the server must send *encrypted data* back to the client, I will proceed with the robust
// server implementation (IV:Ciphertext:AuthTag) and ensure that when the server *receives* data,
// it is slightly more tolerant of the client's existing (IV:Ciphertext) format.

// BUT, for PULL, the server must encrypt data the client can decrypt. If the client expects IV:Ciphertext, 
// the server should adhere to that format if possible, or we must fix the client first.
// Let's assume the client's `cipherBuffer` (line 74 of crypto.ts) IS the combination of ciphertext + tag,
// and the client's `decryptData` (line 102 of crypto.ts) handles the buffer structure correctly. 
// Given the lack of a robust ArrayBuffer splitter/joiner on the client side, I will adhere to 
// the standard Node.js GCM which requires an explicit tag for decryption.

// To make this work: I MUST make the client-side crypto compatible with explicit AuthTag handling, 
// because GCM requires it for security validation. 

// Let's fix the client-side `src/lib/sync/crypto.ts` now to use a 3-part format (IV:Ciphertext:AuthTag), 
// and then the server-side `crypto-server.ts` will use the same logic.

// Removing crypto-server.ts creation for now and focusing on fixing crypto.ts and then recreating crypto-server.ts with the same logic.

// --- Step 3a: Update Client Crypto for robust GCM handling ---
