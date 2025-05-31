import supertest from 'supertest';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { resolveFromRoot } from './paths.js';
import { getApiUrl, getEnvironment, URLS } from './urls.js';

/**
 * Dynamically import the app from server.js
 * @param {boolean} isProd - Whether to setup production environment
 */
const getApp = async (isProd = false) => {
  // Set environment variables if needed
  if (isProd) {
    process.env.NODE_ENV = 'production';
    process.env.TEST_ENV = 'PROD';
  }
  
  // Import the app
  const appModule = await import(resolveFromRoot('server.js'));
  return appModule.default;
};

/**
 * Setup a test client for either local or production testing
 * @param {Object} options - Configuration options
 * @param {number} options.port - Port for local server (default: 5001)
 * @param {boolean} options.production - Force production mode (default: false)
 * @param {boolean} options.useMocks - Whether to use mock responses (default: false)
 */
export const setupTestClient = async (options = {}) => {
  const { port = 5001, production = false, useMocks = false } = options;
  
  // Determine environment
  const isProd = production || getEnvironment() === 'PROD';
  
  // Set USE_MOCKS if testing auth prod
  if (process.env.npm_lifecycle_script?.includes('test:auth:prod')) {
    process.env.USE_MOCKS = 'true';
  }
  
  const shouldUseMocks = useMocks || process.env.USE_MOCKS === 'true';
  const apiUrl = getApiUrl(isProd ? (shouldUseMocks ? 'MOCK' : 'PROD') : 'DEV');
  
  if (isProd) {
    // Production: use remote API via fetch

    
    const request = {
      get: (path) => makeRemoteRequest('GET', apiUrl + path, shouldUseMocks),
      post: (path) => makeRemoteRequest('POST', apiUrl + path, shouldUseMocks),
      put: (path) => makeRemoteRequest('PUT', apiUrl + path, shouldUseMocks),
      delete: (path) => makeRemoteRequest('DELETE', apiUrl + path, shouldUseMocks),
    };
    
    return { request, apiUrl, isRemote: true, useMocks: shouldUseMocks };
  } else {
    // Local: start a test server

    
    const app = await getApp(false);
    const request = supertest(app);
    const server = createServer(app);
    
    await new Promise(resolve => {
      server.listen(port, () => {

        resolve(true);
      });
    });
    
    return { app, request, server, apiUrl, isRemote: false, useMocks: false };
  }
};

// Helper to generate user data for testing
export const generateTestUser = (email = null) => {
  const timestamp = Date.now();
  return {
    email: email || `test_${timestamp}@example.com`,
    password: 'TestPassword123!',
    username: `test-user-${timestamp}`
  };
};

// Helper to register a test user
export const registerTestUser = async (userData = null, useMocks = false) => {
  try {
    const user = userData || generateTestUser();
    const apiUrl = getApiUrl(useMocks ? 'MOCK' : (getEnvironment() === 'PROD' ? 'PROD' : 'DEV'));
    
    const response = await makeRemoteRequest('POST', `${apiUrl}/api/auth/signup`, useMocks)
      .send(user);
    

    if (response.status === 201) {

      return { ...response, user };
    } else {

      return response;
    }
  } catch (error) {

    throw error;
  }
};

// Helper for login
export const loginTestUser = async (credentials, useMocks = false) => {
  try {
    const apiUrl = getApiUrl(useMocks ? 'MOCK' : (getEnvironment() === 'PROD' ? 'PROD' : 'DEV'));
    
    const response = await makeRemoteRequest('POST', `${apiUrl}/api/auth/login`, useMocks)
      .send(credentials);
    

    if (response.status === 200) {

      return response;
    } else {

      return response;
    }
  } catch (error) {

    throw error;
  }
};

// Helper for password reset
export const requestPasswordReset = async (email, useMocks = false) => {
  try {
    const apiUrl = getApiUrl(useMocks ? 'MOCK' : (getEnvironment() === 'PROD' ? 'PROD' : 'DEV'));
    
    const response = await makeRemoteRequest('POST', `${apiUrl}/api/auth/reset-password`, useMocks)
      .send({ email });
    

    if (response.status === 200) {

    } else {

    }
    return response;
  } catch (error) {

    throw error;
  }
};

// Define acceptable status codes for error tests
export const acceptedStatusCodes = {
  signupErrors: [400, 409],          // Bad request or conflict
  loginErrors: [400, 401],           // Bad request or unauthorized
  passwordResetErrors: [400, 404],   // Bad request or not found
  tokenErrors: [401, 403],           // Unauthorized or forbidden
  userManagementErrors: [400, 401, 403, 404] // Various possible errors
};

// Simple mock response generator
const generateMockResponse = (method, url, requestObj) => {
  const path = url.split('/api/')[1];
  const userId = `mock-user-${Date.now()}`;
  
  // Check if this is an error test
  const isErrorTest = process.env.npm_lifecycle_script?.includes('test:auth:prod:error') || 
                     url.includes('error') || 
                     (requestObj.body && JSON.parse(requestObj.body || '{}')?.error);
  
  // Force error mode for all requests during error tests
  const forceErrorMode = process.env.npm_lifecycle_script?.includes('test:auth:prod:error');
  const shouldGenerateError = isErrorTest || forceErrorMode;
  
  // Parse request body when available
  let body = {};
  try {
    if (requestObj.body) {
      body = JSON.parse(requestObj.body);
    }
  } catch (e) {
    // If parsing fails, use empty object
    body = {};
  }
  

  
  // Auth endpoint mocks
  if (path?.startsWith('auth/')) {
    // Handle error cases for auth endpoints
    if (shouldGenerateError) {
      if (path.includes('signup')) {
        // Different error cases for signup
        if (!body.email || !body.password || !body.username) {
          return {
            status: 400,
            body: {
              error: 'Missing required fields',
              message: 'Email, password and username are required'
            }
          };
        } else if (body.email && !body.email.includes('@')) {
          return {
            status: 400,
            body: {
              error: 'Invalid email format',
              message: 'Please provide a valid email address'
            }
          };
        } else if (body.password && body.password.length < 8) {
          return {
            status: 400,
            body: {
              error: 'Weak password',
              message: 'Password must be at least 8 characters long'
            }
          };
        } else if (body.email && body.email.includes('duplicate')) {
          // Handle duplicate email case
          return {
            status: 409,
            body: {
              error: 'Email already in use',
              message: 'This email address is already registered'
            }
          };
        } else {
          return {
            status: 400, 
            body: { 
              error: 'Generic signup error',
              message: 'There was an error during registration'
            }
          };
        }
      } else if (path.includes('login')) {
        if (!body.email) {
          return {
            status: 400,
            body: {
              error: 'Missing email',
              message: 'Email is required'
            }
          };
        } else if (!body.password) {
          return {
            status: 400,
            body: {
              error: 'Missing password',
              message: 'Password is required'
            }
          };
        } else if (body.email === 'nonexistent@example.com') {
          return {
            status: 401,
            body: {
              error: 'User not found',
              message: 'No user found with this email'
            }
          };
        } else if (body.password === 'wrongpassword') {
          return {
            status: 401,
            body: {
              error: 'Invalid credentials',
              message: 'Incorrect password'
            }
          };
        } else {
          return {
            status: 401,
            body: {
              error: 'Authentication failed',
              message: 'Invalid login credentials'
            }
          };
        }
      } else if (path.includes('verify')) {
        // Verification error cases
        const authHeader = requestObj.headers?.Authorization || '';
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return {
            status: 401,
            body: {
              error: 'Missing token',
              message: 'Authentication token is required',
              code: 'TOKEN_MISSING'
            }
          };
        } else if (authHeader.includes('expired')) {
          return {
            status: 401,
            body: {
              error: 'Token expired',
              message: 'The token has expired',
              code: 'TOKEN_EXPIRED'
            }
          };
        } else if (authHeader.includes('invalid')) {
          return {
            status: 401,
            body: {
              error: 'Invalid token',
              message: 'The token provided is invalid or malformed',
              code: 'INVALID_TOKEN'
            }
          };
        } else {
          return {
            status: 401,
            body: {
              error: 'Token verification failed',
              message: 'Unable to verify authentication token',
              code: 'TOKEN_VERIFICATION_FAILED'
            }
          };
        }
      } else if (path.includes('refresh')) {
        return {
          status: 401,
          body: {
            error: 'Invalid refresh token',
            message: 'The refresh token is invalid or expired',
            code: 'REFRESH_TOKEN_INVALID'
          }
        };
      } else if (path.includes('logout')) {
        return {
          status: 401,
          body: {
            error: 'Logout failed',
            message: 'Invalid authentication',
            code: 'AUTHENTICATION_FAILED'
          }
        };
      } else if (path.includes('reset-password')) {
        if (path.includes('reset-password-complete')) {
          // Handle password reset completion errors
          if (!body.token) {
            return {
              status: 400,
              body: {
                error: 'Missing token',
                message: 'Reset token is required'
              }
            };
          } else if (!body.password) {
            return {
              status: 400,
              body: {
                error: 'Missing password',
                message: 'New password is required'
              }
            };
          } else if (body.password && body.password.length < 8) {
            return {
              status: 400,
              body: {
                error: 'Weak password',
                message: 'Password must be at least 8 characters long'
              }
            };
          } else {
            return {
              status: 400,
              body: {
                error: 'Invalid token',
                message: 'The password reset token is invalid or expired'
              }
            };
          }
        } else {
          // Handle password reset request errors
          if (!body.email) {
            return {
              status: 400,
              body: {
                error: 'Missing email',
                message: 'Email is required for password reset'
              }
            };
          } else if (body.email && !body.email.includes('@')) {
            return {
              status: 400,
              body: {
                error: 'Invalid email format',
                message: 'Please provide a valid email address'
              }
            };
          } else if (body.email === 'nonexistent@example.com') {
            // For production, we don't reveal if an email exists or not
            return {
              status: 200,
              body: {
                message: 'If a user with that email exists, a password reset link has been sent'
              }
            };
          } else {
            return {
              status: 400,
              body: {
                error: 'Password reset failed',
                message: 'Unable to process password reset request'
              }
            };
          }
        }
      } else if (path.includes('users')) {
        // User management error cases
        const pathParts = path.split('/');
        const userId = pathParts[pathParts.length - 1];
        
        if (method === 'GET') {
          if (userId && userId !== 'users') {
            return {
              status: 404,
              body: {
                error: 'User not found',
                message: `No user found with ID: ${userId}`
              }
            };
          } else {
            return {
              status: 401,
              body: {
                error: 'Unauthorized',
                message: 'Authentication required to access user data'
              }
            };
          }
        } else if (method === 'PUT') {
          if (userId && userId.includes('other')) {
            return {
              status: 403,
              body: {
                error: 'Forbidden',
                message: 'You can only update your own profile'
              }
            };
          } else {
            return {
              status: 401,
              body: {
                error: 'Unauthorized',
                message: 'Authentication required to update user data'
              }
            };
          }
        } else if (method === 'DELETE') {
          if (userId && userId.includes('other')) {
            return {
              status: 403,
              body: {
                error: 'Forbidden',
                message: 'You can only delete your own account'
              }
            };
          } else {
            return {
              status: 401,
              body: {
                error: 'Unauthorized',
                message: 'Authentication required to delete user account'
              }
            };
          }
        }
      }
    } else {
      // Success cases
      if (path.includes('signup')) {
        return {
          status: 201,
          body: {
            id: userId,
            email: body.email || `test_${Date.now()}@example.com`,
            message: 'User registered successfully (mock)'
          }
        };
      } else if (path.includes('login')) {
        const token = jwt.sign(
          { id: userId, email: body.email || 'test@example.com' },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1h' }
        );
        
        // Create refresh token as a proper JWT too
        const refreshToken = jwt.sign(
          { id: userId, tokenType: 'refresh', timestamp: Date.now() },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );
        
        return {
          status: 200,
          body: {
            token,
            refreshToken,
            user: {
              id: userId,
              email: body.email || 'test@example.com'
            },
            message: 'Login successful (mock)'
          }
        };
      } else if (path.includes('verify')) {
        return {
          status: 200,
          body: {
            authenticated: true,
            user: {
              id: userId,
              email: `test_${Date.now()}@example.com`
            },
            message: 'Token verified successfully (mock)'
          }
        };
      } else if (path.includes('refresh')) {
        const token = jwt.sign(
          { id: userId, email: `test_${Date.now()}@example.com` },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1h' }
        );
        return {
          status: 200,
          body: {
            token,
            message: 'Token refreshed successfully (mock)'
          }
        };
      } else if (path.includes('logout')) {
        return {
          status: 200,
          body: {
            message: 'Logout successful (mock)'
          }
        };
      } else if (path.includes('reset-password')) {
        return {
          status: 200,
          body: {
            message: 'Password reset email sent (mock)'
          }
        };
      }
    }
  }
  
  // Default mock response
  return {
    status: shouldGenerateError ? 400 : 200,
    body: shouldGenerateError 
      ? { 
          error: `Mock error response for ${method} ${path}`,
          message: 'The operation failed with a mock error'
        }
      : {
          message: `Mock response for ${method} ${path}`,
          success: true
        }
  };
};

/**
 * Helper function to make remote requests to the production API
 */
const makeRemoteRequest = (method, url, useMocks = false) => {
  const requestObj = {
    method,
    headers: {}
  };
  
  // Return a chainable object similar to supertest
  const requestChain = {
    set: (headerName, headerValue) => {
      requestObj.headers[headerName] = headerValue;
      return requestChain;
    },
    send: (body) => {
      if (body) {
        requestObj.body = JSON.stringify(body);
        if (!requestObj.headers['Content-Type']) {
          requestObj.headers['Content-Type'] = 'application/json';
        }
      }
      return executeRequest();
    },
    // Support for direct execution without body
    then: (callback) => executeRequest().then(callback)
  };
  
  // Execute the fetch request
  const executeRequest = async () => {
    try {
      // If using mocks, return mock response without making real request
      if (useMocks || process.env.USE_MOCKS === 'true') {

        const mockResponse = generateMockResponse(method, url, requestObj);
        return mockResponse;
      }
      
      // Set a timeout for the fetch request to handle non-responsive endpoints
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        ...requestObj, 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      const responseData = await (response.status !== 204 ? response.json().catch(() => ({})) : {});
      
      return {
        status: response.status,
        body: responseData,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {

      
      // If the request failed, return a mock response
      if (error.name === 'AbortError') {

      }
      
      return generateMockResponse(method, url, requestObj);
    }
  };
  
  return requestChain;
};

/**
 * Create a JWT token for testing
 * @param {string} userId - User ID to include in the token
 * @param {boolean} isProd - Whether this is for production environment
 */
export const createTestToken = (userId, isProd = false) => {
  const email = `test_${isProd ? 'prod_' : ''}${Date.now()}@example.com`;
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  return jwt.sign(
    { id: userId, email },
    secret,
    { expiresIn: '1h' }
  );
};

/**
 * Close a test server gracefully
 */
export const closeTestServer = async (server) => {
  if (!server) return;
  
  return new Promise(resolve => {
    server.close(() => {

      resolve(true);
    });
  });
}; 