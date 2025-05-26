import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { importModels, setupMocks } from '../setup.js';

// Will hold our imported models and mocks
let User;
let db;

// Test user data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashedpassword123',
  age: 16
};

// Set up before all tests
beforeAll(async () => {
  // Import models using the setup helper
  const models = await importModels();
  User = models.User;
  
  // Get mocks
  const mocks = setupMocks();
  db = mocks.db;
});

describe('User Model', { tags: ['authentication', 'unit', 'success'] }, () => {
  let userId;

  // Clean up users before each test
  beforeEach(() => {
    // Reset any mock implementations
    if (db && db.query) {
      db.query.mockReset();
    }
  });

  it('should create a new user', async () => {
    // Mock implementation for create
    User.create = vi.fn().mockResolvedValue({ 
      id: '123', 
      ...testUser 
    });
    
    const user = await User.create(testUser);
    userId = user.id;

    expect(user).toHaveProperty('id');
    expect(user.username).toBe(testUser.username);
    expect(user.email).toBe(testUser.email);
    expect(user.age).toBe(testUser.age);
  });

  it('should find a user by ID', async () => {
    // Mock implementation
    User.findById = vi.fn().mockResolvedValue({ 
      id: userId, 
      ...testUser 
    });
    
    const user = await User.findById(userId);

    expect(user).toHaveProperty('id', userId);
    expect(user.username).toBe(testUser.username);
  });

  it('should find a user by email', async () => {
    // Mock implementation
    User.findByEmail = vi.fn().mockResolvedValue({ 
      id: userId, 
      ...testUser 
    });
    
    const user = await User.findByEmail(testUser.email);

    expect(user).toHaveProperty('email', testUser.email);
  });

  it('should update a user', async () => {
    const updatedData = {
      username: 'updatedusername'
    };
    
    // Mock implementation
    User.update = vi.fn().mockResolvedValue({ 
      id: userId, 
      ...testUser, 
      ...updatedData 
    });
    
    const updatedUser = await User.update(userId, updatedData);

    expect(updatedUser.username).toBe('updatedusername');
    expect(updatedUser.email).toBe(testUser.email);
  });

  it('should delete a user', async () => {
    // Mock implementations
    User.delete = vi.fn().mockResolvedValue(true);
    User.findById = vi.fn().mockResolvedValue(null);
    
    const deleted = await User.delete(userId);
    const user = await User.findById(userId);

    expect(deleted).toBe(true);
    expect(user).toBeNull();
  });

  it('should get all users', async () => {
    // Mock implementation
    User.getAll = vi.fn().mockResolvedValue([
      { id: '123', ...testUser },
      { id: '456', ...testUser, username: 'anotheruser', email: 'another@example.com' }
    ]);
    
    const users = await User.getAll();
    expect(users).toHaveLength(2);
  });
}); 