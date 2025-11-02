/**
 * Register User Utility for Integration Tests (Playwright)
 */

/**
 * Register a new user
 * @param {Object} request - Playwright request object
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Result with user ID and token
 */
export async function registerUser(request, userData) {
  const response = await request.post("/api/auth/signup", {
    data: userData,
  });

  const data = await response.json();

  if (response.status() !== 201) {
    console.error("Registration failed:", data);
    throw new Error(`Failed to register user: ${response.status()}`);
  }

  // The API directly returns the user object and doesn't wrap it in a 'user' property
  // and the token is generated separately - we'll handle this by logging in after registration
  return {
    userId: data.id, // Use the user ID directly from the response
    userData: data,
    // We'll need to log in to get the token
    token: null,
  };
} 