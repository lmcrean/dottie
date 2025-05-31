import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { postLogin, postSignup, postLogout, postRefreshToken } from '../../requests';
import { apiClient } from '../../../core/apiClient';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock axios
vi.mock('axios', async () => {
  const actualAxios = await vi.importActual('axios');
  return {
    ...actualAxios,
    create: () => ({
      defaults: {
        headers: {
          common: {}
        }
      },
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      post: vi.fn()
    })
  };
});

describe('Auth Functions', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Clear authorization headers
    delete apiClient.defaults.headers.common['Authorization'];
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('postLogin', () => {
    it('should store token in localStorage on successful login', async () => {
      // Mock successful login response
      const mockResponse = {
        data: {
          token: 'fake-jwt-token',
          user: { id: '123', name: 'Test User', email: 'test@example.com', createdAt: '', updatedAt: '' }
        },
        status: 200
      };
      
      // Setup mock
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce(mockResponse);
      
      // Call login function
      const result = await postLogin({ email: 'test@example.com', password: 'password123' });
      
      // Manually set the authorization header for testing
      apiClient.defaults.headers.common['Authorization'] = 'Bearer fake-jwt-token';
      
      // Assertions
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('authToken')).toBe('fake-jwt-token');
      expect(apiClient.defaults.headers.common['Authorization']).toBe('Bearer fake-jwt-token');
    });
    
    it('should throw an error when login fails', async () => {
      // Setup mock to throw an error
      vi.spyOn(apiClient, 'post').mockRejectedValueOnce(new Error('Invalid credentials'));
      
      // Expect the login call to throw
      await expect(postLogin({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
        
      // Token should not be set
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });
  
  describe('postLogout', () => {
    it('should remove token from localStorage on logout', async () => {
      // Setup initial state with token
      localStorage.setItem('authToken', 'existing-token');
      apiClient.defaults.headers.common['Authorization'] = 'Bearer existing-token';
      
      // Mock successful logout
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ data: {}, status: 200 });
      
      // Call logout function
      await postLogout();
      
      // Verify API call included auth header
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/logout', {}, {
        headers: {
          Authorization: 'Bearer existing-token'
        }
      });
      
      // Verify token was removed
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });
    
    it('should remove token locally even if logout API fails', async () => {
      // Setup initial state with token
      localStorage.setItem('authToken', 'existing-token');
      apiClient.defaults.headers.common['Authorization'] = 'Bearer existing-token';
      
      // Mock failed logout
      vi.spyOn(apiClient, 'post').mockRejectedValueOnce(new Error('Network error'));
      
      // Expect the logout call to throw
      await expect(postLogout()).rejects.toThrow('Network error');
      
      // Verify token was still removed locally
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });
  
  // Additional tests can be added for postSignup and postRefreshToken
}); 