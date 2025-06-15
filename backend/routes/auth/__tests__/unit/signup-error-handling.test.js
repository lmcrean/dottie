import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signup } from '../../signup/controller.js';

// Define mocks using a different approach that handles hoisting better
vi.mock('../../../../models/user/User.js', async () => {
  const actual = await vi.importActual('../../../../models/user/User.js');
  return {
    default: {
      findByEmail: vi.fn(),
      findByUsername: vi.fn(),
      create: vi.fn()
    }
  };
});

vi.mock('../../../../services/dbService.js', () => ({
  default: {
    findBy: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn()
  }
}));

vi.mock('bcrypt', () => {
  const bycryptMock = {
    hash: vi.fn().mockResolvedValue('hashedpassword123')
  };

  return {
    ...bycryptMock,
    default: bycryptMock
  }

  
});

vi.mock('../../../services/encryptionUtils.js', () => ({
  deriveKEK: vi.fn().mockResolvedValue(Buffer.alloc(32, 'mock-kek')),
  encryptUserKey: vi.fn().mockReturnValue(Buffer.alloc(64, 'encrypted')),
  generateIV: vi.fn().mockReturnValue(Buffer.alloc(16, 'mock-iv')),
  generateUserEncryptionKey: vi.fn().mockReturnValue(Buffer.alloc(32, 'user-key'))
}));

vi.mock('crypto', () => {
  const cryptoMock = {
    randomBytes: vi.fn().mockReturnValue(Buffer.alloc(16, 'salt')),
    createCipheriv: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue(Buffer.alloc(32, 'encrypted')),
      final: vi.fn().mockReturnValue(Buffer.alloc(0)),
      getAuthTag: vi.fn().mockReturnValue(Buffer.alloc(16, 'auth-tag'))
    }),
    createDecipheriv: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue(Buffer.alloc(32, 'decrypted')),
      final: vi.fn().mockReturnValue(Buffer.alloc(0)),
      setAuthTag: vi.fn()
    }),
    scrypt: vi.fn((password, salt, keylen, callback) => {
      callback(null, Buffer.alloc(32, 'derived-key'));
    })
  };
  
  // Return both the named exports and default export
  return {
    ...cryptoMock,
    default: cryptoMock
  };
});

vi.mock('util', () => ({
  promisify: vi.fn((fn) => {
    return vi.fn().mockResolvedValue(Buffer.alloc(32, 'derived-key'));
  })
}));

// Import the User model after all mocks are defined
import User from '../../../../models/user/User.js';

describe('Signup Error Handling', { tags: ['authentication', 'unit', 'error'] }, () => {
  let req, res;

  // Reset all mocks before each test
  beforeEach(() => {
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
    // Mock User.findByEmail to return an existing user
    User.findByEmail.mockResolvedValueOnce({
      id: '123',
      username: 'existinguser',
      email: 'user@example.com'
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email already exists',
      errorType: 'EMAIL_CONFLICT',
      message: 'An account with this email address already exists. Please use a different email or try signing in.'
    });

    // Verify the email was checked using User.findByEmail
    expect(User.findByEmail).toHaveBeenCalledWith('user@example.com');
    // Ensure findByUsername was not called if email conflict is found first
    expect(User.findByUsername).not.toHaveBeenCalled();
  });

  it('should return specific error for username conflict with structured response', async () => {
    // Mock no existing email, but an existing username
    User.findByEmail.mockResolvedValueOnce(null); // No email found
    User.findByUsername.mockResolvedValueOnce({   // Username found
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

    // Verify both email and username were checked using User methods
    expect(User.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(User.findByUsername).toHaveBeenCalledWith('testuser');
  });

  it('should check email conflict before username conflict', async () => {
    // Mock User.findByEmail to return existing user for email (first call)
    User.findByEmail.mockResolvedValueOnce({
      id: '123',
      username: 'existinguser',
      email: 'user@example.com'
    });

    await signup(req, res);

    // Should return email conflict since that's checked first
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Email already exists',
      errorType: 'EMAIL_CONFLICT',
      message: 'An account with this email address already exists. Please use a different email or try signing in.'
    });

    // Only email should be checked, not username (since email conflict found first)
    expect(User.findByEmail).toHaveBeenCalledTimes(1);
    expect(User.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(User.findByUsername).not.toHaveBeenCalled();
  });

  it('should handle User.create validation errors with structured response', async () => {
    // Mock no existing users found by email or username
    User.findByEmail.mockResolvedValueOnce(null);
    User.findByUsername.mockResolvedValueOnce(null);

    // Mock User.create to return validation error
    User.create.mockResolvedValueOnce({
      success: false,
      errors: ['Email already exists'] 
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
    // Mock no existing users found by email or username
    User.findByEmail.mockResolvedValueOnce(null);
    User.findByUsername.mockResolvedValueOnce(null);

    // Mock User.create to return username validation error
    User.create.mockResolvedValueOnce({
      success: false,
      errors: ['Username already exists']
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
    // Mock no existing users found by email or username
    User.findByEmail.mockResolvedValueOnce(null);
    User.findByUsername.mockResolvedValueOnce(null);

    // Mock User.create to return other validation error
    User.create.mockResolvedValueOnce({
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
    // Mock User.findByEmail to throw an error, simulating a database issue
    User.findByEmail.mockRejectedValue(new Error('Database connection failed'));

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

  it('should successfully create a user when all validations pass', async () => {
    // Mock no existing users
    User.findByEmail.mockResolvedValueOnce(null);
    User.findByUsername.mockResolvedValueOnce(null);
    
    // Mock successful user creation
    User.create.mockResolvedValueOnce({
      success: true,
      user: {
        id: 'new-user-123',
        username: 'testuser',
        email: 'user@example.com',
        // Sensitive fields like password_hash should not be returned
      }
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'new-user-123',
        username: 'testuser',
        email: 'user@example.com'
      })
    );
  });
});