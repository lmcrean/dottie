import crypto from 'crypto';


const KEY_LENGTH = 32; // 256-bit AES
const IV_LENGTH = 16;  // For AES-GCM

/**
 * Derives a Key Encryption Key (KEK) from a user's password and a unique salt.
 *
 * This function uses `crypto.scryptSync` for key derivation, a computationally intensive
 * process designed to resist brute-force attacks. It's crucial that the `salt`
 * is unique for each user and stored alongside their encrypted data.
 *
 * @param {string} password - The user's plaintext password.
 * @param {Buffer} salt - A unique, randomly generated salt for key derivation.
 * @returns {Buffer} A derived Key Encryption Key (KEK) of `KEY_LENGTH` bytes.
 * @throws {Error} If `password` or `salt` are invalid, or if key derivation fails.
 */
export function deriveKEK(password, salt) {
  return crypto.scryptSync(password, salt, KEY_LENGTH);
}

/**
 * Encrypts a user's symmetric key using a Key Encryption Key (KEK).
 *
 * This function generates a random Initialization Vector (IV)
 * and uses AES-256-GCM for authenticated encryption.
 * The IV, authentication tag, and ciphertext are concatenated for storage.
 *
 * @param {Buffer} userKey - The user's symmetric key to be encrypted.
 * @param {Buffer} kek - The Key Encryption Key (KEK) used for encryption.
 * @param {Buffer} iv - The IV 
 * @returns {Buffer} A concatenated Buffer containing the IV, authentication tag, and encrypted user key.
 * Format: `[IV | Authentication Tag | Ciphertext]`
 * @throws {Error} If there's an issue during the encryption process (e.g., invalid key/IV length).
 */
export function encryptUserKey(userKey, kek, iv) {
  const cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
  const encrypted = Buffer.concat([cipher.update(userKey), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]); 
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
 * Expected format: `[IV | Authentication Tag | Ciphertext]`
 * @param {Buffer} kek - The Key Encryption Key (KEK) used for decryption.
 * @returns {Buffer} The decrypted user's symmetric key.
 * @throws {Error} If decryption fails, often due to incorrect KEK, corrupted data, or invalid authentication tag.
 */
export function decryptUserKey(encryptedData, kek) {
  const iv = encryptedData.slice(0, IV_LENGTH);
  const tag = encryptedData.slice(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = encryptedData.slice(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', kek, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
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
  const cipher = crypto.createCipheriv('aes-256-gcm', userKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
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
  const buffer = Buffer.from(encryptedText, 'base64');
  const iv = buffer.slice(0, IV_LENGTH);
  const tag = buffer.slice(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = buffer.slice(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', userKey, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}


