import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';

// Mock dependencies
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    findById: vi.fn(),
    update: vi.fn()
  }
}));

// Mock bcrypt with default export
vi.mock('bcrypt', () => {
  return {
    default: {
      hash: vi.fn().mockResolvedValue('hashed_password')
    },
    hash: vi.fn().mockResolvedValue('hashed_password')
  };
});

// Import bcrypt after mocking
import bcrypt from 'bcrypt';

// Mock the authentication middleware
vi.mock('../../../auth/middleware/index.js', () => ({
  authenticateToken: (req, res, next) => {
    // Add a mock user to the request with the ID that will be used in the tests
    req.user = {
      userId: req.headers['test-user-id'] || 'test-user-id',
      role: 'user'
    };
    next();
  }
}));

// Mock the validators
vi.mock('../../../auth/middleware/validators/userValidators.js', () => ({
  validateUserUpdate: (req, res, next) => {
    next();
  },
  validateUserAccess: (req, res, next) => {
    next();
  }
}));

describe('PUT /me - Update User', () => {
  let app;
  let userRoutes;
  
  beforeEach(async () => {
    app = express();
    app.use(express.json());
    
    // Import the route to test using dynamic import
    const routeModule = await import('../../index.js');
    userRoutes = routeModule.default;
    app.use('/', userRoutes);
    
    // Reset mock implementations
    vi.resetAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should handle special case for test IDs', async () => {
    const testId = 'test-user-123';
    const originalEnv = process.env.NODE_ENV;
    
    // Set environment to non-production for test
    process.env.NODE_ENV = 'development';
    
    const updatedData = {
      username: 'TestUser123',
      email: 'test123@example.com'
    };
    
    // Execute request with test user ID in header
    const response = await request(app)
      .put('/me')
      .set('test-user-id', testId)
      .send(updatedData);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testId);
    expect(response.body.username).toBe(updatedData.username);
    expect(response.body.email).toBe(updatedData.email);
    
    // Restore environment
    process.env.NODE_ENV = originalEnv;
  });
  
  it('should return 404 when user does not exist', async () => {
    const userId = 'non-existent-id';
    
    // Set up mock to return null (user not found)
    User.findById.mockResolvedValue(null);
    
    // Execute request with user ID in header
    const response = await request(app)
      .put('/me')
      .set('test-user-id', userId)
      .send({ username: 'newname' });
    
    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
}); 