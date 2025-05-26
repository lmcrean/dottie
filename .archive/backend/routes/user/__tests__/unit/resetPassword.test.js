import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';
import EmailService from '../../../../services/emailService.js';

// Mock dependencies
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    findByEmail: vi.fn(),
    storeResetToken: vi.fn(),
    findByResetToken: vi.fn(),
    updatePassword: vi.fn(),
    clearResetToken: vi.fn()
  }
}));

vi.mock('../../../../services/emailService.js', () => ({
  default: {
    sendPasswordResetEmail: vi.fn().mockResolvedValue(true)
  }
}));

// Define a consistent hashed password value
const NEW_HASHED_PASSWORD = 'new_hashed_password';

// Mock bcrypt with consistent hash value
vi.mock('bcrypt', () => {
  const hash = vi.fn().mockImplementation(() => Promise.resolve(NEW_HASHED_PASSWORD));
  return {
    default: {
      hash,
      compare: vi.fn().mockResolvedValue(true)
    },
    hash,
    compare: vi.fn().mockResolvedValue(true)
  };
});

// Import bcrypt after mocking
import bcrypt from 'bcrypt';

// Mock crypto - fix the crypto mock to provide a proper default export
vi.mock('crypto', () => {
  return {
    default: {
      randomBytes: () => ({
        toString: () => 'mock-reset-token'
      })
    },
    randomBytes: () => ({
      toString: () => 'mock-reset-token'
    })
  };
});

// Mock validators
vi.mock('../../../../routes/auth/middleware/validators/resetPasswordValidators.js', () => ({
  validateResetPasswordRequest: (req, res, next) => {
    next();
  },
  validateResetPasswordCompletion: (req, res, next) => {
    next();
  }
}));

describe('Password Reset Functionality', () => {
  let app;
  let userRoutes;
  
  beforeEach(async () => {
    app = express();
    app.use(express.json());
    
    // Import the route to test using dynamic import
    const routeModule = await import('../../index.js');
    userRoutes = routeModule.default;
    app.use('/users', userRoutes);
    
    // Reset mock implementations
    vi.resetAllMocks();
    
    // Ensure bcrypt.hash returns the consistent value for all test cases
    bcrypt.hash.mockImplementation(() => Promise.resolve(NEW_HASHED_PASSWORD));
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /pw/reset - Request Password Reset', () => {
    it('should handle special case for test email', async () => {
      const response = await request(app)
        .post('/users/pw/reset')
        .send({ email: 'test-email' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('If a user with that email exists');
      
      // Verify service not called for test email
      expect(User.findByEmail).not.toHaveBeenCalled();
      expect(User.storeResetToken).not.toHaveBeenCalled();
      expect(EmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
    
    it('should handle non-existent email securely', async () => {
      // Mock user not found
      User.findByEmail.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/users/pw/reset')
        .send({ email: 'nonexistent@example.com' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('If a user with that email exists');
      
      // Verify findByEmail was called
      expect(User.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      
      // Verify other services not called
      expect(User.storeResetToken).not.toHaveBeenCalled();
      expect(EmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
    
    it('should process password reset for existing user', async () => {
      // Mock user found
      User.findByEmail.mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com'
      });
      
      User.storeResetToken.mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com',
        reset_token: 'mock-reset-token'
      });
      
      const response = await request(app)
        .post('/users/pw/reset')
        .send({ email: 'user@example.com' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('If a user with that email exists');
      
      // Verify services were called
      expect(User.findByEmail).toHaveBeenCalledWith('user@example.com');
      expect(User.storeResetToken).toHaveBeenCalledWith(
        'user@example.com',
        'mock-reset-token',
        expect.any(Date)
      );
      expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'user@example.com',
        'mock-reset-token'
      );
    });
    
    it('should handle email service failure', async () => {
      // Mock user found
      User.findByEmail.mockResolvedValue({
        id: 'user-id-123',
        email: 'error@user'
      });
      
      User.storeResetToken.mockResolvedValue({
        id: 'user-id-123',
        email: 'error@user',
        reset_token: 'mock-reset-token'
      });
      
      // Mock email service error
      EmailService.sendPasswordResetEmail.mockRejectedValue(
        new Error('Failed to send password reset email')
      );
      
      const response = await request(app)
        .post('/users/pw/reset')
        .send({ email: 'error@user' });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to process password reset request');
      
      // Verify services were called
      expect(User.findByEmail).toHaveBeenCalledWith('error@user');
      expect(User.storeResetToken).toHaveBeenCalled();
      expect(EmailService.sendPasswordResetEmail).toHaveBeenCalled();
    });
  });
  
  describe('POST /pw/reset-complete - Complete Password Reset', () => {
    it('should handle special case for test token', async () => {
      const response = await request(app)
        .post('/users/pw/reset-complete')
        .send({ 
          token: 'test-token',
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Password has been reset successfully');
      
      // Verify services not called for test token
      expect(User.findByResetToken).not.toHaveBeenCalled();
      expect(User.updatePassword).not.toHaveBeenCalled();
      expect(User.clearResetToken).not.toHaveBeenCalled();
    });
    
    it('should handle invalid or expired token', async () => {
      // Mock token not found
      User.findByResetToken.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/users/pw/reset-complete')
        .send({ 
          token: 'invalid-token',
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid or expired reset token');
      
      // Verify findByResetToken was called
      expect(User.findByResetToken).toHaveBeenCalledWith('invalid-token');
      
      // Verify other services not called
      expect(User.updatePassword).not.toHaveBeenCalled();
      expect(User.clearResetToken).not.toHaveBeenCalled();
    });
    
    it('should successfully reset password with valid token', async () => {
      // Mock valid token found
      User.findByResetToken.mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com'
      });
      
      User.updatePassword.mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com',
        updated_at: new Date().toISOString()
      });
      
      User.clearResetToken.mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com',
        reset_token: null,
        reset_token_expires: null
      });
      
      const response = await request(app)
        .post('/users/pw/reset-complete')
        .send({ 
          token: 'valid-token',
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Password has been reset successfully');
      
      // Verify all services were called with correct parameters
      expect(User.findByResetToken).toHaveBeenCalledWith('valid-token');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(User.updatePassword).toHaveBeenCalledWith('user-id-123', NEW_HASHED_PASSWORD);
      expect(User.clearResetToken).toHaveBeenCalledWith('user-id-123');
    });
  });
}); 