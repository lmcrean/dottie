/**
 * Generate Profile Update Data Utility for Integration Tests
 */

/**
 * Generate random profile data for updating user
 * @param {string} usernamePrefix - Prefix for username
 * @returns {Object} Profile update data
 */
export function generateProfileUpdate(usernamePrefix = "updated") {
  const timestamp = Date.now();
  return {
    username: `${usernamePrefix}_${timestamp}`,
    age: "25_34",
  };
} 