import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';

console.log('Type of User:', typeof User);
console.log('Value of User:', User);
console.log('Does User have findById:', User && typeof User.findById);
console.log('Does User.default exist:', User && typeof User.default);
if (User && User.default) {
  console.log('Does User.default have findById:', typeof User.findById);
}
// This `User` variable will be { default: { findById: fn, updatePasswordAndEncrytion: fn } }

// Mock User model
vi.mock('../../../../models/user/User.js', () => ({
  default: { // This 'default' is the key: it becomes the `User.default` in your test
    findById: vi.fn(),
    updatePasswordAndEncrytion: vi.fn(),
  }
}));

// Mock bcrypt setup: It also exports 'default' for `import bcrypt from 'bcrypt'`
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));
import bcrypt from 'bcrypt'; // This `bcrypt` variable will be { default: { hash: fn, compare: fn } }

// Mock encryption utilities
vi.mock('../../../../services/encryptionUtils.js', () => ({
  deriveKEK: vi.fn(),
  encryptUserKey: vi.fn(),
  generateIV: vi.fn(),
  decryptUserKey: vi.fn(),
}));
import { deriveKEK, encryptUserKey, generateIV, decryptUserKey } from '../../../../services/encryptionUtils.js';

// // Mock Node's crypto.randomBytes
// vi.mock('crypto', async (importOriginal) => {
//   const actualCrypto = await importOriginal();
//   return {
//     ...actualCrypto,
//     randomBytes: vi.fn(),
//   };
// });
// import crypto from 'crypto';

vi.mock('crypto', async (importOriginal) => {
  const actualCrypto = await importOriginal();
  return {
    default: { // <--- Wrap the exports in a 'default' property
      ...actualCrypto,
      randomBytes: vi.fn(),
    }
  };
});
import crypto from 'crypto'; 

// Mock authentication middleware
vi.mock('../../../../routes/auth/middleware/index.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 'test-user-id', role: 'user' };
    next();
  }
}));

// Mock validators
vi.mock('../../../../routes/auth/middleware/validators/userValidators.js', () => ({
  validateUserAccess: (req, res, next) => next(),
  validateUserUpdate: (req, res, next) => next(),
}));
vi.mock('../../../../routes/auth/middleware/validators/passwordValidators.js', () => ({
  validatePasswordUpdate: (req, res, next) => next(),
}));

describe('POST /pw/update/:id - Update Password', () => {
  let app;
  let userRoutes;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    const routeModule = await import('../../index.js');
    userRoutes = routeModule.default;
    app.use('/users', userRoutes);

    vi.resetAllMocks(); 
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle special case for test IDs', async () => {
    const testId = 'test-user-123';
    const passwordData = {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!'
    };

    const response = await request(app)
      .post(`/users/pw/update/${testId}`)
      .send(passwordData);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testId);
    expect(response.body.message).toBe('Password updated successfully');
    expect(response.body).toHaveProperty('updated_at');
  });

  it('should return 404 when user does not exist', async () => {
    const userId = 'non-existent-id';
    User.findById.mockResolvedValue(null);

    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return 401 when current password is incorrect', async () => {
    const userId = 'valid-user-id';
    User.findById.mockResolvedValue({
      id: userId,
      username: 'testuser',
      password_hash: 'hashed_password'
    });
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword456!'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Current password is incorrect');
    expect(User.findById).toHaveBeenCalledWith(userId, false);
    expect(bcrypt.compare).toHaveBeenCalledWith('WrongPassword123!', 'hashed_password');
    expect(User.updatePasswordAndEncrytion).not.toHaveBeenCalled();
  });

  it('should update password successfully', async () => {
    const userId = 'valid-user-id';
    const currentPassword = 'CurrentPassword123!';
    const newPassword = 'NewPassword456!';
    const oldHashedPassword = 'existing_hashed_password_from_db';
    const oldEncryptedUserKey = Buffer.from('old_encrypted_key_mock_data', 'utf8');
    const oldKeySalt = Buffer.from('old_key_salt_mock', 'utf8');
    const oldDerivedKek = Buffer.from('old_derived_kek_mock', 'utf8');
    const decryptedUserKey = Buffer.from('decrypted_user_key_mock', 'utf8');
    const newHashedPassword = 'new_hashed_password_from_bcrypt';
    const newKeySalt = Buffer.from('new_key_salt_mock', 'utf8');
    const newKeyIV = Buffer.from('new_key_iv_mock', 'utf8');
    const newDerivedKek = Buffer.from('new_derived_kek_mock', 'utf8');
    const newEncryptedUserKey = Buffer.from('new_encrypted_key_mock', 'utf8');
    const expectedUpdatedAt = new Date().toISOString();

    User.findById.mockResolvedValue({
      id: userId,
      username: 'testuser',
      password_hash: oldHashedPassword,
      encrypted_key: oldEncryptedUserKey,
      key_salt: oldKeySalt,
    });
    bcrypt.compare.mockResolvedValue(true);
    deriveKEK.mockResolvedValueOnce(oldDerivedKek);
    decryptUserKey.mockReturnValueOnce(decryptedUserKey);
    bcrypt.hash.mockResolvedValue(newHashedPassword);
    crypto.randomBytes.mockReturnValueOnce(newKeySalt);
    generateIV.mockReturnValueOnce(newKeyIV);
    deriveKEK.mockResolvedValueOnce(newDerivedKek);
    encryptUserKey.mockReturnValueOnce(newEncryptedUserKey);
    User.updatePasswordAndEncrytion.mockResolvedValueOnce({
      id: userId,
      username: 'testuser',
      password_hash: newHashedPassword,
      encrypted_key: newEncryptedUserKey,
      key_salt: newKeySalt,
      updated_at: expectedUpdatedAt
    });

    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({
        currentPassword: currentPassword,
        newPassword: newPassword
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Password updated successfully');

    expect(User.findById).toHaveBeenCalledWith(userId, false);
    expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, oldHashedPassword);
    expect(deriveKEK).toHaveBeenCalledTimes(2);
    expect(deriveKEK).toHaveBeenCalledWith(currentPassword, oldKeySalt);
    expect(deriveKEK).toHaveBeenCalledWith(newPassword, newKeySalt);
    expect(decryptUserKey).toHaveBeenCalledWith(oldEncryptedUserKey, oldDerivedKek);
    expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
    expect(crypto.randomBytes).toHaveBeenCalledWith(16);
    expect(generateIV).toHaveBeenCalledTimes(1);
    expect(encryptUserKey).toHaveBeenCalledWith(decryptedUserKey, newDerivedKek, newKeyIV);
    expect(User.updatePasswordAndEncrytion).toHaveBeenCalledWith(
      userId,
      oldHashedPassword,
      newHashedPassword,
      newEncryptedUserKey,
      newKeyIV,
      newKeySalt
    );
  });

  it('should return 401 if decryption fails (authentication data mismatch)', async () => {
    const userId = 'valid-user-id';
    const oldHashedPassword = 'existing_hashed_password_from_db';
    const oldEncryptedUserKey = Buffer.from('corrupted_encrypted_key', 'utf8');
    const oldKeySalt = Buffer.from('old_key_salt_mock', 'utf8');
    const currentPassword = 'CurrentPassword123!';

    User.findById.mockResolvedValue({
      id: userId,
      username: 'testuser',
      password_hash: oldHashedPassword,
      encrypted_key: oldEncryptedUserKey,
      key_salt: oldKeySalt,
    });
    bcrypt.compare.mockResolvedValue(true);
    deriveKEK.mockResolvedValueOnce(Buffer.from('derived_kek', 'utf8'));
    decryptUserKey.mockImplementationOnce(() => {
      throw new Error('Unsupported state or authentication data was incorrect');
    });

    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({ currentPassword: currentPassword, newPassword: 'NewPassword456!' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Failed to authenticate data during decryption. Key or IV mismatch.');
    expect(User.updatePasswordAndEncrytion).not.toHaveBeenCalled();
  });

  it('should return 500 on generic update error', async () => {
    const userId = 'valid-user-id';
    const oldHashedPassword = 'existing_hashed_password_from_db';
    const oldEncryptedUserKey = Buffer.from('old_encrypted_key_mock_data', 'utf8');
    const oldKeySalt = Buffer.from('old_key_salt_mock', 'utf8');
    const currentPassword = 'CurrentPassword123!';
    const newPassword = 'NewPassword456!';
    const newHashedPassword = 'new_hashed_password_from_bcrypt';
    const oldDerivedKek = Buffer.from('old_derived_kek_mock', 'utf8');
    const decryptedUserKey = Buffer.from('decrypted_user_key_mock', 'utf8');
    const newKeySalt = Buffer.from('new_key_salt_mock', 'utf8');
    const newKeyIV = Buffer.from('new_key_iv_mock', 'utf8');
    const newDerivedKek = Buffer.from('new_derived_kek_mock', 'utf8');
    const newEncryptedUserKey = Buffer.from('new_encrypted_key_mock', 'utf8');

    User.findById.mockResolvedValue({
      id: userId,
      username: 'testuser',
      password_hash: oldHashedPassword,
      encrypted_key: oldEncryptedUserKey,
      key_salt: oldKeySalt,
    });
    bcrypt.compare.mockResolvedValue(true);
    deriveKEK.mockResolvedValueOnce(oldDerivedKek);
    decryptUserKey.mockReturnValueOnce(decryptedUserKey);
    bcrypt.hash.mockResolvedValue(newHashedPassword);
    crypto.randomBytes.mockReturnValueOnce(newKeySalt);
    generateIV.mockReturnValueOnce(newKeyIV);
    deriveKEK.mockResolvedValueOnce(newDerivedKek);
    encryptUserKey.mockReturnValueOnce(newEncryptedUserKey);
    User.updatePasswordAndEncrytion.mockRejectedValueOnce(new Error('Database write failed!'));

    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({ currentPassword: currentPassword, newPassword: newPassword });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error updating password.');
    expect(User.updatePasswordAndEncrytion).toHaveBeenCalledTimes(1);
  });
});