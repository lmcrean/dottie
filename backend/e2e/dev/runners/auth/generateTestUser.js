/**
 * Generate Test User Utility for Integration Tests
 */

/**
 * Generate unique test user data
 * @returns {Object} User data for registration
 */
export function generateTestUser() {
  const timestamp = Date.now();
  return {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: "TestPassword123!",
  };
} 