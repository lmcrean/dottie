import { describe, it, expect } from 'vitest';
import { 
  User, 
  CreateUser,
  ReadUser,
  UpdateEmail,
  UpdateUsername,
  UpdatePassword,
  DeleteUser,
  AuthenticateUser,
  ResetPassword,
  ValidateUserData,
  ValidateEmail,
  ValidateUsername,
  ValidatePassword,
  ValidateCredentials,
  SanitizeUserData,
  UserBase
} from '../index.js';
import defaultExport from '../index.js';

describe('User Models Index', () => {
  describe('Named Exports', () => {
    it('should export User model', () => {
      expect(User).toBeDefined();
      expect(typeof User).toBe('function');
      expect(User.tableName).toBe('users');
    });

    it('should export all user services', () => {
      expect(CreateUser).toBeDefined();
      expect(ReadUser).toBeDefined();
      expect(UpdateEmail).toBeDefined();
      expect(UpdateUsername).toBeDefined();
      expect(UpdatePassword).toBeDefined();
      expect(DeleteUser).toBeDefined();
      expect(AuthenticateUser).toBeDefined();
      expect(ResetPassword).toBeDefined();
    });

    it('should export all validators', () => {
      expect(ValidateUserData).toBeDefined();
      expect(ValidateEmail).toBeDefined();
      expect(ValidateUsername).toBeDefined();
      expect(ValidatePassword).toBeDefined();
      expect(ValidateCredentials).toBeDefined();
    });

    it('should export transformers and base', () => {
      expect(SanitizeUserData).toBeDefined();
      expect(UserBase).toBeDefined();
    });
  });

  describe('Default Export', () => {
    it('should export User as default', () => {
      expect(defaultExport).toBeDefined();
      expect(defaultExport).toBe(User);
    });
  });

  describe('Model Methods', () => {
    it('should have User CRUD methods', () => {
      expect(typeof User.create).toBe('function');
      expect(typeof User.findById).toBe('function');
      expect(typeof User.update).toBe('function');
      expect(typeof User.delete).toBe('function');
      expect(typeof User.getAll).toBe('function');
    });

    it('should have authentication methods', () => {
      expect(typeof User.authenticate).toBe('function');
      expect(typeof User.verifyCredentials).toBe('function');
      expect(typeof User.checkUserStatus).toBe('function');
      expect(typeof User.emailExists).toBe('function');
      expect(typeof User.usernameExists).toBe('function');
    });

    it('should have password reset methods', () => {
      expect(typeof User.initiatePasswordReset).toBe('function');
      expect(typeof User.resetPassword).toBe('function');
      expect(typeof User.validateResetToken).toBe('function');
      expect(typeof User.hasPendingReset).toBe('function');
    });

    it('should have update methods', () => {
      expect(typeof User.updateEmail).toBe('function');
      expect(typeof User.updateUsername).toBe('function');
      expect(typeof User.updatePassword).toBe('function');
    });

    it('should have validation methods', () => {
      expect(typeof User.validateEmail).toBe('function');
      expect(typeof User.validateUsername).toBe('function');
      expect(typeof User.validatePassword).toBe('function');
      expect(typeof User.validateCredentials).toBe('function');
    });
  });
}); 