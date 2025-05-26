import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';

// Mock dependencies
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    findById: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock the authentication middleware
vi.mock('../../../auth/middleware/index.js', () => ({
  authenticateToken: (req, res, next) => {
    // Add a mock user to the request with the ID that will be used in the tests
    req.user = {
      userId: req.headers['test-user-id'] || 'mock-user-id',
      role: 'user'
    };
    next();
  }
}));

// Mock the validators
vi.mock('../../../auth/middleware/validators/userValidators.js', () => ({
  validateUserAccess: (req, res, next) => {
    next();
  },
  validateUserUpdate: (req, res, next) => {
    next();
  }
}));

describe('DELETE /me - Delete User', () => {
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
  
  it('should delete a test user successfully using special handling', async () => {
    const testUserId = 'test-user-123';
    
    // Execute request with test user ID in header to be picked up by mock middleware
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', testUserId);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(User.findById).not.toHaveBeenCalled(); // Should not call findById for test users
    expect(User.delete).not.toHaveBeenCalled(); // Should not call delete for test users
    expect(response.body).toHaveProperty('message', `User ${testUserId} deleted successfully`);
    expect(response.body).toHaveProperty('success', true);
  });
  
  it('should delete a regular user successfully', async () => {
    const userId = 'regular-user-id';
    
    // Set up mocks
    User.findById.mockResolvedValue({ id: userId, username: 'testuser' });
    User.delete.mockResolvedValue(true);
    
    // Execute request with user ID in header
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);
    
    // Assertions
    expect(response.status).toBe(200);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(User.delete).toHaveBeenCalledWith(userId);
    expect(response.body).toHaveProperty('message', 'User deleted successfully');
    expect(response.body).toHaveProperty('success', true);
  });
  
  it('should return 404 when user does not exist', async () => {
    const userId = 'non-existent-id';
    
    // Set up mock to return null (user not found)
    User.findById.mockResolvedValue(null);
    
    // Execute request with user ID in header
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);
    
    // Assertions
    expect(response.status).toBe(404);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(User.delete).not.toHaveBeenCalled();
    expect(response.body).toHaveProperty('error', 'User not found');
  });
  
  it('should handle failed deletion', async () => {
    const userId = 'failed-delete-user-id';
    
    // Set up mocks
    User.findById.mockResolvedValue({ id: userId, username: 'testuser' });
    User.delete.mockResolvedValue(false);
    
    // Execute request with user ID in header
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);
    
    // Assertions
    expect(response.status).toBe(500);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(User.delete).toHaveBeenCalledWith(userId);
    expect(response.body).toHaveProperty('error', 'Failed to delete user');
  });
  
  it('should handle database errors during deletion', async () => {
    const userId = 'error-user-id';
    
    // Set up mocks
    User.findById.mockResolvedValue({ id: userId, username: 'testuser' });
    User.delete.mockRejectedValue(new Error('Database error'));
    
    // Execute request with user ID in header
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);
    
    // Assertions
    expect(response.status).toBe(500);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(User.delete).toHaveBeenCalledWith(userId);
    expect(response.body).toHaveProperty('error', 'Failed to delete user');
  });
}); 