import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';
import { Router } from 'express';

// Mock dependencies
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    findById: vi.fn(),
    updatePassword: vi.fn().mockResolvedValue({
      id: 'valid-user-id',
      username: 'testuser',
      updated_at: new Date().toISOString()
    })
  }
}));

// Mock bcrypt with default export
vi.mock('bcrypt', () => {
  return {
    default: {
      hash: vi.fn().mockResolvedValue('new_hashed_password'),
      compare: vi.fn()
    },
    hash: vi.fn().mockResolvedValue('new_hashed_password'),
    compare: vi.fn()
  };
});

// Import bcrypt after mocking
import bcrypt from 'bcrypt';

// Mock the authentication middleware
vi.mock('../../../../routes/auth/middleware/index.js', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    // Add a mock user to the request
    req.user = {
      id: 'test-user-id',
      role: 'user'
    };
    next();
  }
}));

// Mock the validators
vi.mock('../../../../routes/auth/middleware/validators/userValidators.js', () => ({
  validateUserAccess: (req: any, res: any, next: any) => {
    next();
  },
  validateUserUpdate: (req: any, res: any, next: any) => {
    next();
  }
}));

vi.mock('../../../../routes/auth/middleware/validators/passwordValidators.js', () => ({
  validatePasswordUpdate: (req: any, res: any, next: any) => {
    next();
  }
}));

describe('POST /pw/update/:id - Update Password', () => {
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

    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${testId}`)
      .send(passwordData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testId);
    expect(response.body.message).toBe('Password updated successfully');
    expect(response.body).toHaveProperty('updated_at');
  });

  it('should validate password strength', async () => {
    const userId = 'valid-user-id';
    const mockUser = {
      id: userId,
      username: 'testuser',
      password_hash: 'old_hashed_password'
    };

    // Set up mocks
    (User.findById as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);

    const passwordData = {
      currentPassword: 'OldPassword123!',
      newPassword: 'weak' // Too weak
    };

    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send(passwordData);

    // Assertions - should fail validation
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject incorrect current password', async () => {
    const userId = 'valid-user-id';
    const mockUser = {
      id: userId,
      username: 'testuser',
      password_hash: 'old_hashed_password'
    };

    // Set up mocks
    (User.findById as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(false); // Current password doesn't match

    const passwordData = {
      currentPassword: 'WrongPassword123!',
      newPassword: 'NewPassword456!'
    };

    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send(passwordData);

    // Assertions
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should update password successfully', async () => {
    const userId = 'valid-user-id';
    const mockUser = {
      id: userId,
      username: 'testuser',
      password_hash: 'old_hashed_password'
    };

    // Set up mocks
    (User.findById as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);

    const passwordData = {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!'
    };

    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send(passwordData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('message', 'Password updated successfully');
    expect(User.updatePassword).toHaveBeenCalled();
  });
});
