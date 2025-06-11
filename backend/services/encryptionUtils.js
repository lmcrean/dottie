import crypto from "crypto";
import { promisify } from "util";

const KEY_LENGTH = 32; // 256-bit AES
const IV_LENGTH = 16; // For AES-GCM
const ALGORITHM = 'aes-256-gcm';
const TAG_LENGTH = 16;

const scryptAsyncPromise = promisify(crypto.scrypt);

/**
 * Derives a Key Encryption Key (KEK) from a user's password and a unique salt.
 *
 * @param {string} password - The user's plaintext password.
 * @param {Buffer} salt - A unique, randomly generated salt for key derivation.
 * @returns {Buffer} A derived Key Encryption Key (KEK) of `KEY_LENGTH` bytes.
 * @throws {Error} If `password` or `salt` are invalid, or if key derivation fails.
 */
export async function deriveKEK(password, salt) {
  if (
    typeof password !== "string" ||
    password.length === 0 ||
    !Buffer.isBuffer(salt)
  ) {
    throw new TypeError(`Invalid password`);
  }
  return scryptAsyncPromise(password, salt, KEY_LENGTH);
}

/**
 * Generates a cryptographically strong 256-bit (32-byte) user encryption key.
 * This key is typically used as a Data Encryption Key (DEK) to encrypt user-specific data.
 *
 * @returns {Buffer} A Buffer containing the 256-bit (32-byte) randomly generated key.
 */
export const generateUserEncryptionKey = () => {
  return crypto.randomBytes(32); // 256-bit key
};

// TODO: change IV app-wide to 12-byte(recommended)
/**
 * Generates a cryptographically strong 16-byte (128-bit) Initialization Vector (IV).
 * This IV is crucial for AES-GCM encryption to ensure that encrypting the same plaintext
 * with the same key produces different ciphertexts, enhancing security.
 *
 *
 * @returns {Buffer} A Buffer containing the 16-byte randomly generated IV.
 */
export function generateIV() {
  return crypto.randomBytes(16);
}


/**
 * Encrypts a user key using AES-256-GCM.
 * Combines IV, Auth Tag, and Encrypted Data into a single Buffer for storage/transmission.
 *
 * @param {Buffer} userKey - The key to be encrypted.
 * @param {Buffer} kek - The Key Encryption Key (KEK), must be 32 bytes for AES-256.
 * @param {Buffer} iv - The Initialization Vector, must be 12 bytes for GCM.
 * @returns {Buffer} The combined encrypted buffer (IV + AuthTag + Ciphertext).
 * @throws {TypeError} If inputs are not Buffers or have incorrect lengths.
 * @throws {Error} For unexpected cryptographic errors.
 */
export function encryptUserKey(userKey, kek, iv) {
  // Detailed input validation
  if (!Buffer.isBuffer(userKey)) {
    throw new TypeError('Invalid parameter: userKey must be a Buffer.');
  }
  if (!Buffer.isBuffer(kek)) {
    throw new TypeError('Invalid parameter: kek must be a Buffer.');
  }
  if (kek.length !== KEY_LENGTH) {
    throw new TypeError(`Invalid parameter: kek must be ${KEY_LENGTH} bytes long for ${ALGORITHM}, received ${kek.length}.`);
  }
  if (!Buffer.isBuffer(iv)) {
    throw new TypeError('Invalid parameter: iv must be a Buffer.');
  }
  if (iv.length !== IV_LENGTH) {
    throw new TypeError(`Invalid parameter: iv must be ${IV_LENGTH} bytes long for GCM, received ${iv.length}.`);
  }

  try {
    const cipher = crypto.createCipheriv(ALGORITHM, kek, iv);
    const encrypted = Buffer.concat([cipher.update(userKey), cipher.final()]);
    const tag = cipher.getAuthTag(); 

    // Concatenate IV, Auth Tag, and encrypted data for easy storage/retrieval
    return Buffer.concat([iv, tag, encrypted]);
  } catch (error) {
    console.error('Error during encryption:', error);
    throw new Error('Encryption failed. Please check inputs.');
  }
}

/**
 * Decrypts an encrypted user's symmetric key using the Key Encryption Key (KEK).
 *
 * This function expects the `encryptedData` to be a concatenated Buffer
 * containing the IV, authentication tag, and ciphertext, in that specific order.
 * It uses AES-256-GCM for authenticated decryption, verifying the tag to ensure
 * data integrity and authenticity.
 *
 * @param {Buffer} encryptedData - The concatenated buffer containing the IV, authentication tag, and encrypted user key.
 * @param {Buffer} kek - The Key Encryption Key (KEK) used for decryption, must be 32 bytes for AES-256.
 * @returns {Buffer} The decrypted user's symmetric key.
 * @throws {TypeError} If inputs are not Buffers, have incorrect lengths, or are malformed.
 * @throws {Error} If decryption fails (e.g., incorrect KEK, corrupted data, invalid authentication tag).
 */
export function decryptUserKey(encryptedData, kek) {
  // --- Input Validation ---
  if (!Buffer.isBuffer(encryptedData)) {
    throw new TypeError('Invalid parameter: encryptedData must be a Buffer.');
  }
  if (!Buffer.isBuffer(kek)) {
    throw new TypeError('Invalid parameter: kek must be a Buffer.');
  }
  if (kek.length !== KEY_LENGTH) {
    throw new TypeError(`Invalid parameter: kek must be ${KEY_LENGTH} bytes long for ${ALGORITHM}, received ${kek.length}.`);
  }

  // Calculate the minimum expected length of encryptedData (IV + Tag)
  const MIN_ENCRYPTED_DATA_LENGTH = IV_LENGTH + TAG_LENGTH;
  if (encryptedData.length < MIN_ENCRYPTED_DATA_LENGTH) {
    throw new TypeError(`Invalid parameter: encryptedData is too short. Expected at least ${MIN_ENCRYPTED_DATA_LENGTH} bytes (IV + Auth Tag).`);
  }

  // --- Extract Components ---
  // Ensure we use the defined lengths for extraction
  const iv = encryptedData.subarray(0, IV_LENGTH);
  const tag = encryptedData.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = encryptedData.subarray(IV_LENGTH + TAG_LENGTH);

  // --- Decryption Process ---
  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, kek, iv);
    decipher.setAuthTag(tag); 
    
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted;
  } catch (error) {
    // Catch specific 'Bad decrypt' errors which indicate tag mismatch or corrupted data
    if (error.message === 'Bad decrypt') {
      console.error('Decryption failed: Authentication tag mismatch or corrupted data.');
      throw new Error('Decryption failed: Data integrity compromised or incorrect KEK.');
    } else {
      // Log other unexpected cryptographic errors
      console.error('An unexpected error occurred during decryption:', error);
      throw new Error('Decryption failed due to an unexpected cryptographic error.');
    }
  }
}

/**
 * Encrypts a chat message using the user's symmetric key.
 *
 * A unique, random Initialization Vector (IV) is generated for each message.
 * AES-256-GCM is used for authenticated encryption, ensuring both confidentiality
 * and integrity. The IV, authentication tag, and encrypted message are concatenated
 * and then encoded to a Base64 string for easy storage and transmission.
 *
 * @param {Buffer} userKey - The user's symmetric key used for message encryption.
 * @param {string} text - The plaintext chat message to be encrypted.
 * @returns {string} A Base64-encoded string containing the IV, authentication tag, and encrypted message.
 * Format: `Base64([IV | Authentication Tag | Ciphertext])`
 * @throws {Error} If encryption fails (e.g., invalid key, data encoding issues).
 */
export function encryptMessage(userKey, text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", userKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

/**
 * Decrypts an encrypted chat message using the user's symmetric key.
 *
 * This function expects the `encryptedText` to be a Base64-encoded string
 * representing a concatenated buffer of the IV, authentication tag, and ciphertext.
 * It uses AES-256-GCM for authenticated decryption, verifying the tag to ensure
 * the message hasn't been tampered with.
 *
 * @param {Buffer} userKey - The user's symmetric key used for message decryption.
 * @param {string} encryptedText - The Base64-encoded string containing the IV, authentication tag, and encrypted message.
 * Expected format: `Base64([IV | Authentication Tag | Ciphertext])`
 * @returns {string} The decrypted plaintext chat message.
 * @throws {Error} If decryption fails, often due to an incorrect user key, corrupted data, or invalid authentication tag.
 */
export function decryptMessage(userKey, encryptedText) {
  const buffer = Buffer.from(encryptedText, "base64");
  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = buffer.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", userKey, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Attempts to determine if a given string is likely an AES-256-GCM encrypted, Base64-encoded text
 * by performing basic format and structural checks. This function does not guarantee
 * that the text is valid encrypted data, only that it *resembles* it.
 *
 * This is to optionally decrypt messages for backward compatibility
 *
 * It checks for:
 * 1. Basic type (string) and minimum length expected for Base64 encoded encrypted data.
 * 2. Adherence to a standard Base64 format.
 * 3. A minimum buffer length after Base64 decoding, based on expected IV and Auth Tag sizes.
 *
 * @param {string} text The string to check for encryption characteristics.
 * @param {number} ivLength The expected length of the Initialization Vector (IV) in bytes.
 * (Commonly 12 or 16 for AES-GCM). This parameter is crucial for the structural check.
 * @returns {boolean} True if the text is likely encrypted, false otherwise.
 */
export function isLikelyEncrypted(text) {
  // Check 1. Basic Type and Minimum Length Check:
  // Base64 of 32 bytes is (32 / 3) * 4 = 42.66, so at least 44 characters (due to padding).
  const MIN_EXPECTED_BASE64_LENGTH = 44;
  const MIN_STRUCTURAL_BUFFER_LENGTH = Math.ceil((IV_LENGTH + TAG_LENGTH) / 3) * 4;
  if (typeof text !== "string" || text.length < MIN_EXPECTED_BASE64_LENGTH) {
    return false;
  }

  // Check 2. Base64 Format Check:
  // This regex is a robust check for a valid Base64 string.
  if (
    !/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(text)
  ) {
    return false;
  }

  // Check 3. Structural Check
  try {
    const buffer = Buffer.from(text, "base64");
    // Check if the buffer is long enough to contain the IV and Auth Tag
    if (buffer.length >= MIN_STRUCTURAL_BUFFER_LENGTH) {
      return true;
    }
  } catch (e) {
    // If Buffer.from fails (e.g., invalid Base64, even if regex passed, though unlikely for valid Base64),
    // it's not encrypted data.
    console.log(
      "Error during Base64 decoding in isLikelyEncrypted:",
      e.message
    );
    return false;
  }

  return false;
}
