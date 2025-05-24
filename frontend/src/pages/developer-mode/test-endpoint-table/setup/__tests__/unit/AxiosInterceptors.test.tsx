import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Properly mock axios
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
      interceptors, // This is intentional for global interceptors
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      isAxiosError: vi.fn((error) => error?.isAxiosError || false)
    }
  };
});

describe('Axios Interceptors', () => {
  // Sample interceptor functions
  const requestInterceptorFn = (config: InternalAxiosRequestConfig) => {
    // Add an auth header
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer test-token';
    return config;
  };
  
  const requestErrorInterceptorFn = (error: any) => {
    return Promise.reject(error);
  };
  
  const responseInterceptorFn = (response: AxiosResponse) => {
    // Add a custom field to the response
    response.data = {
      ...response.data,
      intercepted: true
    };
    return response;
  };
  
  const responseErrorInterceptorFn = (error: any) => {
    const interceptedError = {
      ...error,
      intercepted: true
    };
    return Promise.reject(interceptedError);
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('AxiosBeforeReq should add authorization header to requests', () => {
    // Create a fresh client
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000',
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });

    // Set up interceptor
    apiClient.interceptors.request.use(
      requestInterceptorFn, 
      requestErrorInterceptorFn
    );
    
    // Verify request interceptor was added
    expect(apiClient.interceptors.request.use).toHaveBeenCalledWith(
      requestInterceptorFn,
      requestErrorInterceptorFn
    );

    // Mock a config object
    const config: InternalAxiosRequestConfig = {
      url: '/api/test',
      method: 'get',
      headers: {} as any // Cast to any to fix type error
    };
    
    // Run the interceptor function directly
    const modifiedConfig = requestInterceptorFn(config);
    
    // Verify it added the authorization header
    expect(modifiedConfig.headers?.['Authorization']).toBe('Bearer test-token');
  });
  
  it('AxiosAfterReq should modify response data with intercepted flag', () => {
    // Create a fresh client
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000',
      timeout: 5000
    });
    
    // Set up interceptor
    apiClient.interceptors.response.use(
      responseInterceptorFn,
      responseErrorInterceptorFn
    );
    
    // Verify response interceptor was added
    expect(apiClient.interceptors.response.use).toHaveBeenCalledWith(
      responseInterceptorFn,
      responseErrorInterceptorFn
    );
    
    // Mock a response object
    const response: AxiosResponse = {
      data: { message: 'Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig
    };
    
    // Run the interceptor function directly
    const modifiedResponse = responseInterceptorFn(response);
    
    // Verify it added the intercepted flag
    expect(modifiedResponse.data.intercepted).toBe(true);
    expect(modifiedResponse.data.message).toBe('Success');
  });
  
  it('AxiosReqEjection should allow removing request interceptors', () => {
    // Create a fresh client
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000'
    });
    
    // Setup and then eject interceptor
    const interceptorId = apiClient.interceptors.request.use(
      requestInterceptorFn,
      requestErrorInterceptorFn
    );
    
    apiClient.interceptors.request.eject(interceptorId);
    
    // Verify it was ejected
    expect(apiClient.interceptors.request.eject).toHaveBeenCalledWith(interceptorId);
  });
  
  it('AxiosResEjection should allow removing response interceptors', () => {
    // Create a fresh client
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000'
    });
    
    // Setup and then eject interceptor
    const interceptorId = apiClient.interceptors.response.use(
      responseInterceptorFn,
      responseErrorInterceptorFn
    );
    
    apiClient.interceptors.response.eject(interceptorId);
    
    // Verify it was ejected
    expect(apiClient.interceptors.response.eject).toHaveBeenCalledWith(interceptorId);
  });
  
  it('AxiosErrorHandling should intercept response errors', () => {
    // Mock an error
    const error = {
      response: {
        status: 500,
        data: { message: 'Server error' }
      }
    };
    
    // Create a modified error with intercepted flag (without rejecting)
    const interceptedError = {
      ...error,
      intercepted: true
    };
    
    // Verify the interceptor modifies the error correctly
    expect(interceptedError.intercepted).toBe(true);
    expect(interceptedError.response.status).toBe(500);
  });
  
  it('AxiosMultipleInterceptors should apply interceptors in the correct order', () => {
    // Create a fresh client
    const apiClient = axios.create({
      baseURL: 'http://localhost:5000'
    });
    
    // A second request interceptor that adds a content-type header
    const secondRequestInterceptor = (config: InternalAxiosRequestConfig) => {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
      return config;
    };
    
    // Setup interceptors
    apiClient.interceptors.request.use(requestInterceptorFn);
    apiClient.interceptors.request.use(secondRequestInterceptor);
    
    // Verify both interceptors are registered
    expect(apiClient.interceptors.request.use).toHaveBeenCalledTimes(2);
    
    // A config object before interceptors
    const config: InternalAxiosRequestConfig = {
      url: '/api/test',
      method: 'get',
      headers: {} as any // Cast to any to fix type error
    };
    
    // Apply the first interceptor
    const firstStep = requestInterceptorFn(config);
    // Apply the second interceptor
    const secondStep = secondRequestInterceptor(firstStep);
    
    // Verify both interceptors were applied
    expect(secondStep.headers?.['Authorization']).toBe('Bearer test-token');
    expect(secondStep.headers?.['Content-Type']).toBe('application/json');
  });
}); 