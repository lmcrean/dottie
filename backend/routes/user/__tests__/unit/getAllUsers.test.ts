import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import User from '../../../../models/user/User.js';
import { Router } from 'express';

// Mock the User model
vi.mock('../../../../models/user/User.js', () => ({
  default: {
    getAll: vi.fn()
  }
}));

// Mock the authentication middleware
vi.mock('../../../auth/middleware/index.js', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    // Add a mock user to the request
    req.user = {
      id: 'test-user-id',
      role: 'user'
    };
    next();
  }
}));

describe('GET / - Get All Users', () => {
  let app: Express;
  let userRoutes: Router;

  beforeEach(async () => {
    // Create a new Express application for each test
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

  it('should return all users without password hashes', async () => {
    // Mock data
    const mockUsers = [
      { id: 'user1', username: 'user1', email: 'user1@example.com', password_hash: 'hash1', age: '18_24' },
      { id: 'user2', username: 'user2', email: 'user2@example.com', password_hash: 'hash2', age: '25_34' }
    ];

    // Set up mocks
    (User.getAll as any).mockResolvedValue(mockUsers);

    // Execute the request
    const response = await request(app).get('/users');

    // Assertions
    expect(response.status).toBe(200);
    expect(User.getAll).toHaveBeenCalledTimes(1);
    expect(response.body).toHaveLength(2);

    // Verify that password_hash is removed from each user
    response.body.forEach((user: any, index: number) => {
      expect(user).not.toHaveProperty('password_hash');
      expect(user.id).toBe(mockUsers[index].id);
      expect(user.username).toBe(mockUsers[index].username);
      expect(user.email).toBe(mockUsers[index].email);
    });
  });

  it('should handle database errors', async () => {
    // Set up mocks to simulate an error
    (User.getAll as any).mockRejectedValue(new Error('Database error'));

    // Execute the request
    const response = await request(app).get('/users');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
