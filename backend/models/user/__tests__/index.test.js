import { describe, it, expect } from 'vitest';
import { User, UserAuth, UserPasswordReset } from '../index.js';
import defaultExport from '../index.js';

describe('User Models Index', () => {
  describe('Named Exports', () => {
    it('should export User model', () => {
      expect(User).toBeDefined();
      expect(typeof User).toBe('function');
      expect(User.tableName).toBe('users');
    });

    it('should export UserAuth model', () => {
      expect(UserAuth).toBeDefined();
      expect(typeof UserAuth).toBe('function');
      expect(UserAuth.tableName).toBe('users');
    });

    it('should export UserPasswordReset model', () => {
      expect(UserPasswordReset).toBeDefined();
      expect(typeof UserPasswordReset).toBe('function');
      expect(UserPasswordReset.tableName).toBe('users');
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

    it('should have UserAuth methods', () => {
      expect(typeof UserAuth.findByEmail).toBe('function');
      expect(typeof UserAuth.findByUsername).toBe('function');
      expect(typeof UserAuth.updatePassword).toBe('function');
      expect(typeof UserAuth.verifyCredentials).toBe('function');
      expect(typeof UserAuth.emailExists).toBe('function');
      expect(typeof UserAuth.usernameExists).toBe('function');
    });

    it('should have UserPasswordReset methods', () => {
      expect(typeof UserPasswordReset.storeResetToken).toBe('function');
      expect(typeof UserPasswordReset.findByResetToken).toBe('function');
      expect(typeof UserPasswordReset.clearResetToken).toBe('function');
      expect(typeof UserPasswordReset.resetPassword).toBe('function');
      expect(typeof UserPasswordReset.isValidResetToken).toBe('function');
    });
  });
}); 