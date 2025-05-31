import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { signup } from '../../signup/controller.js';

// Mock the User model
const mockUser = {
  findByEmail: vi.fn(),
  findByUsername: vi.fn(),
  create: vi.fn()
};

// Mock the dependencies
vi.mock('../../../models/user/User.js', () => ({
  default: mockUser
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedpassword123')
  }
}));

describe('Signup Error Handling', { tags: ['authentication', 'unit', 'error'] }, () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup request and response mocks
    req = {
      body: {
        username: 'testuser',
        email: 'user@example.com',
        password: 'TestPassword123!',
        age: 16
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
  });

  it('should return specific error for email conflict with structured response', async () => {
    // Mock findByEmail to return an existing user (email conflict)
    mockUser.findByEmail.mockResolvedValue({
      id: '123',
      username: 'existinguser',
      email: 'user@example.com'
    });
    
    // Mock findByUsername to return null (no username conflict)
    mockUser.findByUsername.mockResolvedValue(null);

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email already exists',
      errorType: 'EMAIL_CONFLICT',
      message: 'An account with this email address already exists. Please use a different email or try signing in.'
    });
  });

  it('should return specific error for username conflict with structured response', async () => {
    // Mock findByEmail to return null (no email conflict)
    mockUser.findByEmail.mockResolvedValue(null);
    
    // Mock findByUsername to return an existing user (username conflict)
    mockUser.findByUsername.mockResolvedValue({
      id: '456',
      username: 'testuser',
      email: 'other@example.com'
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Username already exists',
      errorType: 'USERNAME_CONFLICT',
      message: 'This username is already taken. Please choose a different username.'
    });
  });

  it('should check email conflict before username conflict', async () => {
    // Mock both to exist - email should be checked first
    mockUser.findByEmail.mockResolvedValue({
      id: '123',
      username: 'existinguser',
      email: 'user@example.com'
    });
    
    mockUser.findByUsername.mockResolvedValue({
      id: '456',
      username: 'testuser',
      email: 'other@example.com'
    });

    await signup(req, res);

    // Should return email conflict since that's checked first
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email already exists',
      errorType: 'EMAIL_CONFLICT',
      message: 'An account with this email address already exists. Please use a different email or try signing in.'
    });

    // findByUsername should not be called if email already exists
    expect(mockUser.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(mockUser.findByUsername).not.toHaveBeenCalled();
  });

  it('should handle User.create validation errors with structured response', async () => {
    // Mock no existing users
    mockUser.findByEmail.mockResolvedValue(null);
    mockUser.findByUsername.mockResolvedValue(null);
    
    // Mock User.create to return validation error
    mockUser.create.mockResolvedValue({
      success: false,
      errors: ['Email already exists'] // This could happen in race conditions
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email already exists',
      errorType: 'EMAIL_CONFLICT',
      message: 'An account with this email address already exists. Please use a different email or try signing in.'
    });
  });

  it('should handle User.create username validation errors with structured response', async () => {
    // Mock no existing users
    mockUser.findByEmail.mockResolvedValue(null);
    mockUser.findByUsername.mockResolvedValue(null);
    
    // Mock User.create to return username validation error
    mockUser.create.mockResolvedValue({
      success: false,
      errors: ['Username already exists'] // This could happen in race conditions
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Username already exists',
      errorType: 'USERNAME_CONFLICT',
      message: 'This username is already taken. Please choose a different username.'
    });
  });

  it('should handle general validation errors with structured response', async () => {
    // Mock no existing users
    mockUser.findByEmail.mockResolvedValue(null);
    mockUser.findByUsername.mockResolvedValue(null);
    
    // Mock User.create to return other validation error
    mockUser.create.mockResolvedValue({
      success: false,
      errors: ['Password is too weak']
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Password is too weak',
      errorType: 'VALIDATION_ERROR',
      message: 'Failed to create account. Please check your information and try again.'
    });
  });

  it('should handle server errors with structured response', async () => {
    // Mock findByEmail to throw an error
    mockUser.findByEmail.mockRejectedValue(new Error('Database connection failed'));

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to create user',
      errorType: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.'
    });
  });

  it('should return validation error for missing required fields', async () => {
    req.body = {
      username: 'testuser',
      // Missing email and password
    };

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Username, email, and password are required'
    });
  });

  it('should return validation error for invalid email format', async () => {
    req.body.email = 'invalid-email';

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid email format'
    });
  });

  it('should return validation error for weak password', async () => {
    req.body.password = 'weak';

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Password must contain at least 8 characters, an uppercase letter, a number, a special character (@$!%*?&_#)'
    });
  });
}); 