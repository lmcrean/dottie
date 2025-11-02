import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import CreateUser from '../services/CreateUser.js';

// Mock the CreateUser service
vi.mock('../services/CreateUser.js');

describe('User Creation Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('create new user', () => {
    it('should successfully create a new user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password_123',
        age: 25
      };

      const expectedResult = {
        success: true,
        user: {
          id: 'generated-user-id',
          username: 'testuser',
          email: 'test@example.com',
          age: 25,
          created_at: expect.any(String),
          updated_at: expect.any(String)
        }
      };

      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.id).toBeDefined();
      expect(result.user.username).toBe(userData.username);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.age).toBe(userData.age);
      // Password hash should not be in sanitized response
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should fail to create user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password_hash: 'hashed_password_123',
        age: 25
      };

      const expectedResult = {
        success: false,
        errors: ['Invalid email format']
      };

      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password_hash: 'hashed_password_123',
        age: 25
      };

      const expectedResult = {
        success: false,
        errors: ['Email already exists']
      };

      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Email already exists');
    });

    it('should fail to create user with duplicate username', async () => {
      const userData = {
        username: 'existinguser',
        email: 'test@example.com',
        password_hash: 'hashed_password_123',
        age: 25
      };

      const expectedResult = {
        success: false,
        errors: ['Username already exists']
      };

      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Username already exists');
    });

    it('should fail to create user with missing required fields', async () => {
      const userData = {
        username: 'testuser',
        // Missing email and password_hash
        age: 25
      };

      const expectedResult = {
        success: false,
        errors: ['Email is required', 'Password hash is required']
      };

      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should create user with age as null when not provided', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password_123'
        // No age provided
      };

      const expectedResult = {
        success: true,
        user: {
          id: 'generated-user-id',
          username: 'testuser',
          email: 'test@example.com',
          age: null,
          created_at: expect.any(String),
          updated_at: expect.any(String)
        }
      };

      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result.success).toBe(true);
      expect(result.user.age).toBeNull();
    });
  });

  describe('validate user data for creation', () => {
    it('should validate user data without creating', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password_123',
        age: 25
      };

      const expectedResult = {
        isValid: true,
        errors: []
      };

      CreateUser.validateForCreation.mockResolvedValue(expectedResult);

      const result = await User.validateForCreation(userData);

      expect(CreateUser.validateForCreation).toHaveBeenCalledWith(userData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return validation errors without creating', async () => {
      const userData = {
        username: '',
        email: 'invalid-email',
        password_hash: '',
        age: -5
      };

      const expectedResult = {
        isValid: false,
        errors: [
          'Username is required',
          'Invalid email format',
          'Password hash is required',
          'Age must be a positive number'
        ]
      };

      CreateUser.validateForCreation.mockResolvedValue(expectedResult);

      const result = await User.validateForCreation(userData);

      expect(CreateUser.validateForCreation).toHaveBeenCalledWith(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
}); 