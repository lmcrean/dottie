/**
 * Auth Test Data Generators
 * 
 * Provides functions to generate test user data for integration tests.
 */

/**
 * Generate unique test user data
 * @returns {Object} User data for registration
 */
export function generateTestUser() {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  return {
    username: `prod_test_${randomId}_${timestamp}`,  // Highly unique username with prefix
    email: `prod.test.${randomId}.${timestamp}@testmail.com`,  // Use testmail.com domain
    password: "TestPassword123!#@",  // Add even more special characters for stronger password
  };
} 