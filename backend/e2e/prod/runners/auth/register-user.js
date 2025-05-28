/**
 * Register User Endpoint Runner
 * 
 * Handles user registration for integration tests.
 */

/**
 * Register a new user
 * @param {Object} request - Playwright request object
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Result with user ID and token
 */
export async function registerUser(request, userData) {
  try {
    const response = await request.post("/api/auth/signup", {
      data: userData,
    });
    
    let responseText;
    try {
      responseText = await response.text();
    } catch (error) {
      console.error("Failed to get response text:", error);
    }

    let data;
    try {
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      throw new Error(`Failed to parse registration response: ${error.message}`);
    }

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
  } catch (error) {
    console.error("Registration request failed with error:", error);
    throw error;
  }
} 