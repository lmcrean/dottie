import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';

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
  authenticateToken: (req, res, next) => {
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
  validateUserAccess: (req, res, next) => {
    next();
  },
  validateUserUpdate: (req, res, next) => {
    next();
  }
}));

vi.mock('../../../../routes/auth/middleware/validators/passwordValidators.js', () => ({
  validatePasswordUpdate: (req, res, next) => {
    next();
  }
}));

describe('POST /pw/update/:id - Update Password', () => {
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
  
  it('should return 404 when user does not exist', async () => {
    const userId = 'non-existent-id';
    
    // Set up mock to return null (user not found)
    User.findById.mockResolvedValue(null);
    
    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!'
      });
    
    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
  
  it('should return 401 when current password is incorrect', async () => {
    const userId = 'valid-user-id';
    
    // Set up mock to return a user
    User.findById.mockResolvedValue({
      id: userId,
      username: 'testuser',
      password_hash: 'hashed_password'
    });
    
    // Set up bcrypt to return false (password doesn't match)
    bcrypt.compare.mockResolvedValue(false);
    
    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword456!'
      });
    
    // Assertions
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Current password is incorrect');
  });
  
  it('should update password successfully', async () => {
    const userId = 'valid-user-id';
    const newHashedPassword = 'new_hashed_password';
    
    // Set up mock to return a user
    User.findById.mockResolvedValue({
      id: userId,
      username: 'testuser',
      password_hash: 'hashed_password'
    });
    
    // Set up bcrypt to return true (password matches)
    bcrypt.compare.mockResolvedValue(true);
    
    // Set up bcrypt hash to return new hashed password
    bcrypt.hash.mockResolvedValue(newHashedPassword);
    
    // Execute request
    const response = await request(app)
      .post(`/users/pw/update/${userId}`)
      .send({
        currentPassword: 'CurrentPassword123!',
        newPassword: 'NewPassword456!'
      });
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Password updated successfully');
    expect(response.body).toHaveProperty('updated_at');
    
    // Verify bcrypt and User.updatePassword were called with correct parameters
    expect(bcrypt.compare).toHaveBeenCalledWith('CurrentPassword123!', 'hashed_password');
    expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword456!', 10);
    expect(User.updatePassword).toHaveBeenCalledWith(userId, newHashedPassword);
  });
}); 