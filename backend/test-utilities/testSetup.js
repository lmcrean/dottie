import { setupTestClient, closeTestServer } from './setup.js';
import jwt from 'jsonwebtoken';
import { runAllMigrations } from '../db/runAllMigrations.js';

/**
 * Setup a test server for e2e tests
 * @param {number} port - The port to run the test server on
 * @returns {Promise<Object>} Object containing server, app, and request
 */
export const setupTestServer = async (port = 5001) => {
  // First, run all migrations in the test database
  try {
    if (process.env.TEST_MODE === 'true') {
      await runAllMigrations();
    }
  } catch (error) {
    console.warn('Warning: Failed to run migrations:', error.message);
  }
  
  const setup = await setupTestClient({ port });
  return {
    server: setup.server,
    app: setup.app,
    request: setup.request,
    isRemote: setup.isRemote,
    apiUrl: setup.apiUrl
  };
};

/**
 * Create a JWT token for testing
 * @param {string} userId - User ID to include in the token
 * @param {boolean} isProd - Whether this is for production environment
 */
export const createMockToken = (userId, isProd = false) => {
  const email = `test_${isProd ? 'prod_' : ''}${Date.now()}@example.com`;
  const secret = process.env.JWT_SECRET || 'dev-jwt-secret';
  
  return jwt.sign(
    { userId: userId, email },
    secret,
    { expiresIn: '1h' }
  );
};

export { closeTestServer }; 