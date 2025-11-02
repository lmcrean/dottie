import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';
import { Router } from 'express';

// Mock dependencies
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    findById: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock the authentication middleware
vi.mock('../../../auth/middleware/index.js', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    // Add a mock user to the request with the ID that will be used in the tests
    req.user = {
      id: req.headers['test-user-id'] || 'mock-user-id',
      role: 'user'
    };
    next();
  }
}));

// Mock the validators
vi.mock('../../../auth/middleware/validators/userValidators.js', () => ({
  validateUserAccess: (req: any, res: any, next: any) => {
    next();
  },
  validateUserUpdate: (req: any, res: any, next: any) => {
    next();
  }
}));

describe('DELETE /me - Delete User', () => {
  let app: Express;
  let userRoutes: Router;

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
    (User.findById as any).mockResolvedValue({ id: userId, username: 'testuser' });
    (User.delete as any).mockResolvedValue(true);

    // Execute request with user ID in header
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);

    // Assertions
    expect(response.status).toBe(200);
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(User.delete).toHaveBeenCalledWith(userId);
    expect(response.body).toHaveProperty('message', `User ${userId} deleted successfully`);
    expect(response.body).toHaveProperty('success', true);
  });

  it('should return 404 if user is not found', async () => {
    const userId = 'non-existent-user';

    // Set up mocks
    (User.findById as any).mockResolvedValue(null);

    // Execute request
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle database errors', async () => {
    const userId = 'error-user-id';

    // Set up mocks to throw error
    (User.findById as any).mockRejectedValue(new Error('Database error'));

    // Execute request
    const response = await request(app)
      .delete('/me')
      .set('test-user-id', userId);

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
