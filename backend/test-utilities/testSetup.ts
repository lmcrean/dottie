import { setupTestClient, closeTestServer } from './setup.js';
import jwt from 'jsonwebtoken';
import { runAllMigrations } from '../db/runAllMigrations.js';
import jwtConfig from '../config/jwt.js';

/**
 * Setup a test server for e2e tests with retry logic for port conflicts
 * @param {number} port - The port to run the test server on
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @returns {Promise<Object>} Object containing server, app, and request
 */
export const setupTestServer = async (port = 5001, maxRetries = 3) => {
  // First, run all migrations in the test database
  try {
    if (process.env.TEST_MODE === 'true') {
      await runAllMigrations();
    }
  } catch (error) {
    console.warn('Warning: Failed to run migrations:', error.message);
  }

  // Retry logic for port conflicts
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const setup = await setupTestClient({ port });
      return {
        server: setup.server,
        app: setup.app,
        request: setup.request,
        isRemote: setup.isRemote,
        apiUrl: setup.apiUrl
      };
    } catch (error) {
      lastError = error;

      // Check if it's a port conflict error
      if (error.code === 'EADDRINUSE' || error.message?.includes('EADDRINUSE')) {
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = attempt * 200;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // If it's not a port conflict or we're out of retries, throw
      throw error;
    }
  }

  // If we exhausted all retries, throw the last error
  throw lastError;
};

/**
 * Create a JWT token for testing
 * @param {string} userId - User ID to include in the token
 * @param {boolean} isProd - Whether this is for production environment
 */
export const createMockToken = (userId, isProd = false) => {
  const email = `test_${isProd ? 'prod_' : ''}${Date.now()}@example.com`;
  // Use jwtConfig.JWT_SECRET to ensure we use the same secret as the server
  const secret = jwtConfig.JWT_SECRET;

  return jwt.sign(
    { userId: userId, email },
    secret,
    { expiresIn: '1h' }
  );
};

export { closeTestServer }; 