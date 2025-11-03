import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';
import getUser from '../../get-user/controller.js';
import { Router } from 'express';

// Mock the User model
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    findById: vi.fn()
  }
}));

// Mock the authentication middleware
vi.mock('../../../auth/middleware/index.js', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    // Add a mock user to the request
    req.user = {
      id: 'mock-user-id',
      role: 'user'
    };
    next();
  }
}));

// Mock the user access validator
vi.mock('../../../auth/middleware/validators/userValidators.js', () => ({
  validateUserAccess: (req: any, res: any, next: any) => {
    next();
  },
  validateUserUpdate: (req: any, res: any, next: any) => {
    next();
  }
}));

describe('GET /me - Get Current User', () => {
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

  it('should return current user data', async () => {
    const userId = 'mock-user-id';
    const mockUser = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      password_hash: 'hashvalue',
      age: '18_24'
    };

    // Set up mock
    (User.findById as any).mockResolvedValue(mockUser);

    // Execute request
    const response = await request(app).get('/users/me');

    // Assertions
    expect(response.status).toBe(200);
    expect(User.findById).toHaveBeenCalledWith(userId, false);
    expect(response.body).not.toHaveProperty('password_hash');
    expect(response.body).toMatchObject({
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      age: '18_24'
    });
  });

  it('should return 404 if user is not found', async () => {
    // Set up mock to return null
    (User.findById as any).mockResolvedValue(null);

    // Execute request
    const response = await request(app).get('/users/me');

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle database errors', async () => {
    // Set up mock to throw error
    (User.findById as any).mockRejectedValue(new Error('Database error'));

    // Execute request
    const response = await request(app).get('/users/me');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
