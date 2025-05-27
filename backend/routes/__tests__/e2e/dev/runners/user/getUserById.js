/**
 * Get User By ID Utility for Integration Tests (Playwright)
 */

/**
 * Get user information by ID
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID (not used directly but kept for API compatibility)
 * @returns {Promise<Object>} User data
 */
export async function getUserById(request, token, userId) {
  // Use the /me endpoint which returns the current user based on the token
  const response = await request.get(`/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get response as text first
  const responseText = await response.text();

  if (response.status() !== 200) {
    throw new Error(`Failed to get user info: ${response.status()}`);
  }

  // Parse the JSON response
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse user info response: ${error.message}`);
  }
} 