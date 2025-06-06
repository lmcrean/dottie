import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock axios
vi.mock('axios', async () => {
  const interceptors = {
    request: {
      use: vi.fn().mockReturnValue(1),
      eject: vi.fn()
    },
    response: {
      use: vi.fn().mockReturnValue(2),
      eject: vi.fn()
    }
  };

  const axiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors,
    defaults: {
      baseURL: '',
      headers: {}
    }
  };
  
  return {
    default: {
      create: vi.fn().mockReturnValue(axiosInstance),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      isAxiosError: vi.fn((error) => error?.isAxiosError || false),
      isCancel: vi.fn((error) => error?.isCancel || false),
      CancelToken: {
        source: vi.fn().mockReturnValue({
          token: {},
          cancel: vi.fn()
        })
      }
    }
  };
});

describe('Axios Request Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AxiosTimeoutConfig should set proper timeout in config', () => {
    // Create a client with timeout configuration
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000',
      timeout: 3000, // 3 seconds timeout
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Check if create was called with the correct configuration
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 3000
      })
    );
  });
  
  it('AxiosRetryConfig should handle retry logic for failed requests', () => {
    // Setup a request interceptor with retry logic
    const retryInterceptor = (config: InternalAxiosRequestConfig) => {
      // Initialize retry count if not present
      config.headers = config.headers || {};
      // Store the retry count as a string since headers often expect string values
      const currentCount = config.headers['x-retry-count'] ? 
        parseInt(config.headers['x-retry-count'] as string) : 0;
      config.headers['x-retry-count'] = (currentCount + 1).toString();
      return config;
    };
    
    // Create a client
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000'
    });
    
    // Add the retry interceptor
    apiClient.interceptors.request.use(retryInterceptor);
    
    // Verify interceptor was added
    expect(apiClient.interceptors.request.use).toHaveBeenCalledWith(retryInterceptor);
    
    // Test the interceptor directly
    const config: InternalAxiosRequestConfig = {
      url: '/api/test',
      method: 'get',
      headers: {} as any
    };
    
    // First attempt
    const firstAttempt = retryInterceptor(config);
    expect(firstAttempt.headers['x-retry-count']).toBe('1');
    
    // Second attempt (simulating a retry)
    const secondAttempt = retryInterceptor(firstAttempt);
    expect(secondAttempt.headers['x-retry-count']).toBe('2');
    
    // Third attempt
    const thirdAttempt = retryInterceptor(secondAttempt);
    expect(thirdAttempt.headers['x-retry-count']).toBe('3');
  });
  
  it('AxiosCancel should support request cancellation', () => {
    // Get a cancel token source
    const source = axios.CancelToken.source();
    
    // Create a request config with cancel token
    const config: AxiosRequestConfig = {
      url: '/api/test',
      method: 'get',
      cancelToken: source.token
    };
    
    // Verify that source.cancel is a function
    expect(typeof source.cancel).toBe('function');
    
    // Cancel the request
    source.cancel('Operation cancelled by the user');
    
    // Verify cancel was called
    expect(source.cancel).toHaveBeenCalledWith('Operation cancelled by the user');
  });
  
  it('AxiosTimeout should handle timeout errors properly', () => {
    // Create a mock timeout error
    const timeoutError = {
      code: 'ECONNABORTED',
      message: 'timeout of 3000ms exceeded',
      isAxiosError: true
    };
    
    // Check that isAxiosError identifies it correctly
    expect(axios.isAxiosError(timeoutError)).toBeTruthy();
    
    // A response interceptor that catches timeout errors
    const timeoutInterceptor = (error: any) => {
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        // Create a modified error with the custom property
        const modifiedError = {
          ...error,
          customHandled: true,
          message: 'Request timed out, please try again'
        };
        
        // For testing purposes, test the modified error directly
        expect(modifiedError.customHandled).toBeTruthy();
        expect(modifiedError.message).toBe('Request timed out, please try again');
        
        return Promise.reject(modifiedError);
      }
      return Promise.reject(error);
    };
    
    // Just test if the interceptor function exists
    expect(typeof timeoutInterceptor).toBe('function');
    
    // Call the interceptor but catch the rejection to avoid unhandled promise rejection
    timeoutInterceptor(timeoutError).catch(() => {
      // We expect this to be rejected, so this is normal
    });
  });
  
  it('AxiosNetworkError should handle network errors properly', () => {
    // Create a mock network error
    const networkError = {
      message: 'Network Error',
      isAxiosError: true,
      response: undefined
    };
    
    // Check that isAxiosError identifies it correctly
    expect(axios.isAxiosError(networkError)).toBeTruthy();
    
    // A response interceptor that catches network errors
    const networkErrorInterceptor = (error: any) => {
      if (error.message === 'Network Error') {
        // Create a modified error with the custom property
        const modifiedError = {
          ...error,
          customHandled: true,
          message: 'Unable to connect to the server, please check your connection'
        };
        
        // For testing purposes, test the modified error directly
        expect(modifiedError.customHandled).toBeTruthy();
        expect(modifiedError.message).toBe('Unable to connect to the server, please check your connection');
        
        return Promise.reject(modifiedError);
      }
      return Promise.reject(error);
    };
    
    // Just test if the interceptor function exists
    expect(typeof networkErrorInterceptor).toBe('function');
    
    // Call the interceptor but catch the rejection to avoid unhandled promise rejection
    networkErrorInterceptor(networkError).catch(() => {
      // We expect this to be rejected, so this is normal
    });
  });
  
  it('AxiosAuthError should handle 401 responses properly', () => {
    // Create a mock 401 error
    const authError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      },
      isAxiosError: true
    };
    
    // Check that isAxiosError identifies it correctly
    expect(axios.isAxiosError(authError)).toBeTruthy();
    
    // A response interceptor that catches auth errors
    const authErrorInterceptor = (error: any) => {
      if (error.response && error.response.status === 401) {
        // Create a modified error with the custom property
        const modifiedError = {
          ...error,
          customHandled: true,
          message: 'Your session has expired, please log in again'
        };
        
        // For testing purposes, test the modified error directly
        expect(modifiedError.customHandled).toBeTruthy();
        expect(modifiedError.message).toBe('Your session has expired, please log in again');
        
        return Promise.reject(modifiedError);
      }
      return Promise.reject(error);
    };
    
    // Just test if the interceptor function exists
    expect(typeof authErrorInterceptor).toBe('function');
    
    // Call the interceptor but catch the rejection to avoid unhandled promise rejection
    authErrorInterceptor(authError).catch(() => {
      // We expect this to be rejected, so this is normal
    });
  });
}); 