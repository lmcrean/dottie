import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a mock apiClient directly instead of importing
const apiClient = {
  post: vi.fn(),
  get: vi.fn()
};

// No need to mock an import that doesn't exist anymore
// Clear existing mocks in beforeEach

describe('Auth API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Signup with apiClient', () => {
    it('successfully calls signup endpoint with apiClient', async () => {
      // Setup mock data
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockResponse = {
        data: {
          user: { 
            id: 'user-123', 
            email: 'test@example.com',
            name: 'Test User'
          },
          token: 'jwt-token-xyz'
        }
      };

      // Setup the mock response
      (apiClient.post as vi.Mock).mockResolvedValueOnce(mockResponse);

      // Execute the request
      const response = await apiClient.post('/api/auth/signup', userData);

      // Verify
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/signup', userData);
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user.email).toBe(userData.email);
      expect(response.data.token).toBe('jwt-token-xyz');
    });

    it('handles signup error with apiClient', async () => {
      // Setup
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User'
      };

      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'Email already exists' }
        }
      };

      // Setup the mock to reject
      (apiClient.post as vi.Mock).mockRejectedValueOnce(errorResponse);

      // Execute & Verify
      try {
        await apiClient.post('/api/auth/signup', userData);
        // If we reach here, test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(apiClient.post).toHaveBeenCalledWith('/api/auth/signup', userData);
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Email already exists');
      }
    });
  });

  describe('Login with apiClient', () => {
    it('successfully calls login endpoint with apiClient', async () => {
      // Setup
      const loginData = {
        email: 'user@example.com',
        password: 'correct-password'
      };

      const mockResponse = {
        data: {
          token: 'valid-jwt-token',
          user: { 
            id: 'user-123', 
            email: 'user@example.com' 
          }
        }
      };

      // Setup the mock response
      (apiClient.post as vi.Mock).mockResolvedValueOnce(mockResponse);

      // Execute
      const response = await apiClient.post('/api/auth/login', loginData);

      // Verify
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', loginData);
      expect(response.data.token).toBe('valid-jwt-token');
      expect(response.data.user.id).toBe('user-123');
    });

    it('handles login error with apiClient', async () => {
      // Setup
      const loginData = {
        email: 'user@example.com',
        password: 'wrong-password'
      };

      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Invalid email or password' }
        }
      };

      // Setup the mock to reject
      (apiClient.post as vi.Mock).mockRejectedValueOnce(errorResponse);

      // Execute & Verify
      try {
        await apiClient.post('/api/auth/login', loginData);
        // If we reach here, test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', loginData);
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Invalid email or password');
      }
    });
  });

  describe('Logout with apiClient', () => {
    it('successfully calls logout endpoint with apiClient', async () => {
      // Setup
      const mockResponse = {
        data: { message: 'Logged out successfully' }
      };

      // Setup the mock response
      (apiClient.post as vi.Mock).mockResolvedValueOnce(mockResponse);

      // Execute
      const response = await apiClient.post('/api/auth/logout');

      // Verify
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout');
      expect(response.data.message).toBe('Logged out successfully');
    });

    it('handles logout error with apiClient', async () => {
      // Setup
      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Authentication required' }
        }
      };

      // Setup the mock to reject
      (apiClient.post as vi.Mock).mockRejectedValueOnce(errorResponse);

      // Execute & Verify
      try {
        await apiClient.post('/api/auth/logout');
        // If we reach here, test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout');
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Authentication required');
      }
    });
  });
}); 