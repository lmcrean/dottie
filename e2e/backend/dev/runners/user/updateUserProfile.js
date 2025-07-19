/**
 * Update User Profile Utility for Integration Tests (Playwright)
 */

/**
 * Update user profile information
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} userId - User ID (not used directly but kept for API compatibility)
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(request, token, userId, profileData) {
  // Use the /me endpoint which updates the current user based on the token
  const response = await request.put(`/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: profileData,
  });

  const responseText = await response.text();

  if (response.status() !== 200) {
    throw new Error(`Failed to update user profile: ${response.status()}`);
  }

  // Parse the JSON response
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse update response: ${error.message}`);
  }
} 