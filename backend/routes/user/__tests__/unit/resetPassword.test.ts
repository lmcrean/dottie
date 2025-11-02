import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';
import EmailService from '../../../../services/emailService.js';
import { Router } from 'express';

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
  validateResetPasswordRequest: (req: any, res: any, next: any) => {
    next();
  },
  validateResetPasswordCompletion: (req: any, res: any, next: any) => {
    next();
  }
}));

describe('Password Reset Functionality', () => {
  let app: Express;
  let userRoutes: Router;

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
    (bcrypt.hash as any).mockImplementation(() => Promise.resolve(NEW_HASHED_PASSWORD));
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
      (User.findByEmail as any).mockResolvedValue(null);

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
      (User.findByEmail as any).mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com'
      });

      (User.storeResetToken as any).mockResolvedValue({
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
      expect(User.storeResetToken).toHaveBeenCalledWith('user@example.com', 'mock-reset-token', expect.any(Date));
      expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith('user@example.com', 'mock-reset-token');
    });

    it('should handle email service failure', async () => {
      // Mock user found
      (User.findByEmail as any).mockResolvedValue({
        id: 'user-id-123',
        email: 'error@user'
      });

      (User.storeResetToken as any).mockResolvedValue({
        id: 'user-id-123',
        email: 'error@user',
        reset_token: 'mock-reset-token'
      });

      // Mock email service failure
      (EmailService.sendPasswordResetEmail as any).mockRejectedValue(
        new Error('Failed to send password reset email')
      );

      const response = await request(app)
        .post('/users/pw/reset')
        .send({ email: 'error@user' });

      // Should return success message even if email fails (security best practice)
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('If a user with that email exists');
    });
  });

  describe('POST /pw/reset/:token - Complete Password Reset', () => {
    it('should reset password with valid token', async () => {
      const resetToken = 'valid-reset-token';
      const newPassword = 'NewPassword123!';

      // Mock user found with token
      (User.findByResetToken as any).mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com',
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() + 3600000) // 1 hour from now
      });

      (User.updatePassword as any).mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com'
      });

      const response = await request(app)
        .post(`/users/pw/reset/${resetToken}`)
        .send({ newPassword });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password has been reset successfully');

      // Verify services were called
      expect(User.findByResetToken).toHaveBeenCalledWith(resetToken);
      expect(User.updatePassword).toHaveBeenCalled();
      expect(User.clearResetToken).toHaveBeenCalledWith('user-id-123');
    });

    it('should reject invalid token', async () => {
      const resetToken = 'invalid-token';
      const newPassword = 'NewPassword123!';

      // Mock token not found
      (User.findByResetToken as any).mockResolvedValue(null);

      const response = await request(app)
        .post(`/users/pw/reset/${resetToken}`)
        .send({ newPassword });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');

      // Verify updatePassword was not called
      expect(User.updatePassword).not.toHaveBeenCalled();
      expect(User.clearResetToken).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      const resetToken = 'expired-token';
      const newPassword = 'NewPassword123!';

      // Mock user found with expired token
      (User.findByResetToken as any).mockResolvedValue({
        id: 'user-id-123',
        email: 'user@example.com',
        reset_token: resetToken,
        reset_token_expires: new Date(Date.now() - 3600000) // 1 hour ago
      });

      const response = await request(app)
        .post(`/users/pw/reset/${resetToken}`)
        .send({ newPassword });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('expired');

      // Verify updatePassword was not called
      expect(User.updatePassword).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const resetToken = 'valid-token';
      const newPassword = 'NewPassword123!';

      // Mock database error
      (User.findByResetToken as any).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post(`/users/pw/reset/${resetToken}`)
        .send({ newPassword });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
