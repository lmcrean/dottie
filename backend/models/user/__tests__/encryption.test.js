import * as crypto from 'crypto';
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { 
    generateUserEncryptionKey,
    generateIV,
    deriveKEK,
    encryptUserKey,
    decryptUserKey,
    isLikelyEncrypted
 } from '../../../services/encryptionUtils';

// Constants for testing consistency
const TEST_AES_256_KEY_LENGTH = 32;
const TEST_AES_GCM_IV_LENGTH = 16;
const TEST_AES_GCM_AUTH_TAG_LENGTH = 16;
const TEST_PASSWORD = 'MySuperStrongPassword123!@#';

describe('Encryption Utilities', () => {

  // --- generateUserEncryptionKey ---
  describe('generateUserEncryptionKey()', () => {
    it('should return a Buffer', () => {
      const key = generateUserEncryptionKey();
      expect(Buffer.isBuffer(key)).toBe(true);
    });

    it('should return a key of the correct length (32 bytes)', () => {
      const key = generateUserEncryptionKey();
      expect(key.length).toBe(TEST_AES_256_KEY_LENGTH);
    });

    it('should return unique keys on successive calls (high probability)', () => {
      const key1 = generateUserEncryptionKey().toString('hex');
      const key2 = generateUserEncryptionKey().toString('hex');
      expect(key1).not.toBe(key2);
    });
  });

  // --- generateIV ---
  describe('generateIV()', () => {
    it('should return a Buffer', () => {
      const iv = generateIV();
      expect(Buffer.isBuffer(iv)).toBe(true);
    });

    it('should return an IV of the correct length (16 bytes)', () => {
      const iv = generateIV();
      expect(iv.length).toBe(TEST_AES_GCM_IV_LENGTH);
    });

    it('should return unique IVs on successive calls (high probability)', () => {
      const iv1 = generateIV().toString('hex');
      const iv2 = generateIV().toString('hex');
      expect(iv1).not.toBe(iv2);
    });
  });

  // --- deriveKEK ---
  describe('deriveKEK()', () => {
    let testSalt;

    beforeEach(() => {
      testSalt = crypto.randomBytes(16); 
    });

    it('should return a Buffer', async () => {
      const kek = await deriveKEK(TEST_PASSWORD, testSalt);
      expect(Buffer.isBuffer(kek)).toBe(true);
    });

    it('should return a KEK of the correct length (32 bytes)', async () => {
      const kek = await deriveKEK(TEST_PASSWORD, testSalt);
      expect(kek.length).toBe(TEST_AES_256_KEY_LENGTH);
    });

    it('should be deterministic (same password + same salt = same KEK)', async () => {
      const kek1 = await deriveKEK(TEST_PASSWORD, testSalt);
      const kek2 = await deriveKEK(TEST_PASSWORD, testSalt);
      expect(kek1.toString('hex')).toBe(kek2.toString('hex'));
    });

    it('should be non-deterministic with different salts (same password + different salt = different KEK)', async () => {
      const otherSalt = crypto.randomBytes(16);
      const kek1 = await deriveKEK(TEST_PASSWORD, testSalt);
      const kek2 = await deriveKEK(TEST_PASSWORD, otherSalt);
      expect(kek1.toString('hex')).not.toBe(kek2.toString('hex'));
    });

    it('should throw TypeError if password is not a string', async () => {
      await expect(deriveKEK(12345, testSalt)).rejects.toThrow(TypeError);
      await expect(deriveKEK(null, testSalt)).rejects.toThrow(TypeError);
      await expect(deriveKEK(undefined, testSalt)).rejects.toThrow(TypeError);
      await expect(deriveKEK({}, testSalt)).rejects.toThrow(TypeError);
    });

    it('should throw TypeError if salt is not a Buffer', async () => {
      await expect(deriveKEK(TEST_PASSWORD, 'notabuffer')).rejects.toThrow(TypeError);
      await expect(deriveKEK(TEST_PASSWORD, null)).rejects.toThrow(TypeError);
      await expect(deriveKEK(TEST_PASSWORD, {})).rejects.toThrow(TypeError);
    });
  });

  // --- encryptUserKey ---
  describe('encryptUserKey()', () => {
    let userKey, kek, iv;

    beforeAll(async () => {
      userKey = generateUserEncryptionKey();
      const salt = crypto.randomBytes(16);
      kek = await deriveKEK(TEST_PASSWORD, salt);
      iv = generateIV();
    });

    it('should return a Buffer', () => {
      const encrypted = encryptUserKey(userKey, kek, iv);
      expect(Buffer.isBuffer(encrypted)).toBe(true);
    });

    it('should produce a non-empty buffer', () => {
      const encrypted = encryptUserKey(userKey, kek, iv);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should produce a buffer of expected length (IV + Auth Tag + Ciphertext)', () => {
      const encrypted = encryptUserKey(userKey, kek, iv);
      // Ciphertext length will be same as plaintext length for AES-GCM
      const expectedLength = TEST_AES_GCM_IV_LENGTH + TEST_AES_GCM_AUTH_TAG_LENGTH + userKey.length;
      expect(encrypted.length).toBe(expectedLength);
    });

    it('should produce different ciphertext with different IVs for the same plaintext and key', () => {
      const iv1 = generateIV();
      const iv2 = generateIV();
      const encrypted1 = encryptUserKey(userKey, kek, iv1).toString('hex');
      const encrypted2 = encryptUserKey(userKey, kek, iv2).toString('hex');
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should throw TypeError if userKey is not a Buffer', () => {
      expect(() => encryptUserKey('string', kek, iv)).toThrow(TypeError);
      expect(() => encryptUserKey(null, kek, iv)).toThrow(TypeError);
    });

    it('should throw TypeError if kek is not a Buffer', () => {
      expect(() => encryptUserKey(userKey, 'string', iv)).toThrow(TypeError);
      expect(() => encryptUserKey(userKey, null, iv)).toThrow(TypeError);
    });

    it('should throw TypeError if iv is not a Buffer', () => {
      expect(() => encryptUserKey(userKey, kek, 'string')).toThrow(TypeError);
      expect(() => encryptUserKey(userKey, kek, null)).toThrow(TypeError);
    });
  });

  // --- decryptUserKey ---
  describe('decryptUserKey()', () => {
    let userKey, kek, iv, encryptedDEKBuffer;

    // Set up a valid encryption for decryption tests
    beforeAll(async () => {
      userKey = generateUserEncryptionKey(); // The original DEK
      const salt = crypto.randomBytes(16);
      kek = await deriveKEK(TEST_PASSWORD, salt); // The KEK
      iv = generateIV(); // The IV used for encryption
      encryptedDEKBuffer = encryptUserKey(userKey, kek, iv); // The combined encrypted buffer
    });

    it('should successfully decrypt valid data', () => {
      const decrypted = decryptUserKey(encryptedDEKBuffer, kek);
      expect(Buffer.isBuffer(decrypted)).toBe(true);
      expect(decrypted.toString('hex')).toBe(userKey.toString('hex'));
      expect(decrypted.length).toBe(userKey.length);
    });

    it('should throw an error if the Auth Tag is tampered with', () => {
      const tamperedEncrypted = Buffer.from(encryptedDEKBuffer);
      // Tamper with the last byte of the Auth Tag
      const tagStartIndex = TEST_AES_GCM_IV_LENGTH;
      tamperedEncrypted[tagStartIndex + TEST_AES_GCM_AUTH_TAG_LENGTH - 1] ^= 0x01; // Flip a bit
      expect(() => decryptUserKey(tamperedEncrypted, kek))
        .toThrow('Decryption failed due to an unexpected cryptographic error.');
    });

    it('should throw an error if the ciphertext is tampered with', () => {
      const tamperedEncrypted = Buffer.from(encryptedDEKBuffer);
      // Tamper with a byte in the ciphertext part
      const ciphertextStartIndex = TEST_AES_GCM_IV_LENGTH + TEST_AES_GCM_AUTH_TAG_LENGTH;
      tamperedEncrypted[ciphertextStartIndex + 5] ^= 0x01; // Flip a bit
      expect(() => decryptUserKey(tamperedEncrypted, kek))
        .toThrow('Decryption failed due to an unexpected cryptographic error.');
    });

    it('should throw an error if the wrong KEK is used', async () => {
      const wrongSalt = crypto.randomBytes(16);
      const wrongKek = await deriveKEK('wrong_password', wrongSalt); // Generate a different KEK
      expect(() => decryptUserKey(encryptedDEKBuffer, wrongKek))
        .toThrow('Decryption failed due to an unexpected cryptographic error.');
    });

    it('should throw TypeError if encryptedTextBuffer is not a Buffer', () => {
      expect(() => decryptUserKey('string', kek)).toThrow(TypeError);
      expect(() => decryptUserKey(null, kek)).toThrow(TypeError);
    });

    it('should throw TypeError if kek is not a Buffer', () => {
      expect(() => decryptUserKey(encryptedDEKBuffer, 'string')).toThrow(TypeError);
      expect(() => decryptUserKey(encryptedDEKBuffer, null)).toThrow(TypeError);
    });
  });

  // --- isLikelyEncrypted ---
  describe('isLikelyEncrypted()', () => {
    let encryptedBase64;

    beforeAll(async () => {
      const userKey = generateUserEncryptionKey();
      const salt = crypto.randomBytes(16);
      const kek = await deriveKEK(TEST_PASSWORD, salt);
      const iv = generateIV();
      const encryptedBuffer = encryptUserKey(userKey, kek, iv);
      encryptedBase64 = encryptedBuffer.toString('base64');
    });

    it('should return true for a valid Base64 encoded encrypted string', () => {
      expect(isLikelyEncrypted(encryptedBase64)).toBe(true);
    });

    it('should return false for plain text', () => {
      expect(isLikelyEncrypted('Hello World!')).toBe(false);
    });

    it('should return false for non-Base64 strings', () => {
      expect(isLikelyEncrypted('!@#$%^&*()')).toBe(false);
      expect(isLikelyEncrypted('some_text with spaces')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isLikelyEncrypted('')).toBe(false);
    });

    it('should return false for Base64 strings that are too short to contain IV and Tag', () => {
      // Create a base64 string that's too short, e.g., 10 bytes encoded to base64
      const shortBuffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const shortBase64 = shortBuffer.toString('base64');
      expect(isLikelyEncrypted(shortBase64)).toBe(false);
    });


  });
});