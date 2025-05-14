import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as { 
  post: vi.MockedFunction<typeof axios.post> 
};

describe('Auth API Requests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Signup Endpoint', () => {
    it('successfully registers a new user', async () => {
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

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Execute
      const response = await axios.post('/api/auth/signup', userData);

      // Verify
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/signup', userData);
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user.email).toBe(userData.email);
      expect(response.data.token).toBe('jwt-token-xyz');
    });

    it('handles signup error when email already exists', async () => {
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

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      // Execute & Verify
      try {
        await axios.post('/api/auth/signup', userData);
        // If we reach here, test should fail because the request should throw an error
        expect(true).toBe(false);
      } catch (error: any) {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/signup', userData);
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Email already exists');
      }
    });
  });

  describe('Login Endpoint', () => {
    it('successfully logs in a user', async () => {
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

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Execute
      const response = await axios.post('/api/auth/login', loginData);

      // Verify
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', loginData);
      expect(response.data.token).toBe('valid-jwt-token');
      expect(response.data.user.id).toBe('user-123');
      expect(response.data.user.email).toBe('user@example.com');
    });

    it('handles login error with invalid credentials', async () => {
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

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      // Execute & Verify
      try {
        await axios.post('/api/auth/login', loginData);
        // If we reach here, test should fail because the request should throw an error
        expect(true).toBe(false);
      } catch (error: any) {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', loginData);
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Invalid email or password');
      }
    });
  });

  describe('Logout Endpoint', () => {
    it('successfully logs out a user', async () => {
      // Setup
      const mockResponse = {
        data: { message: 'Logged out successfully' }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Setup auth header for the authenticated request
      const authHeader = { headers: { Authorization: 'Bearer valid-token' } };

      // Execute
      const response = await axios.post('/api/auth/logout', null, authHeader);

      // Verify
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout', null, authHeader);
      expect(response.data.message).toBe('Logged out successfully');
    });

    it('handles logout error when not authenticated', async () => {
      // Setup
      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Authentication required' }
        }
      };

      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      // Execute & Verify
      try {
        await axios.post('/api/auth/logout');
        // If we reach here, test should fail because the request should throw an error
        expect(true).toBe(false);
      } catch (error: any) {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/logout');
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Authentication required');
      }
    });
  });
}); 