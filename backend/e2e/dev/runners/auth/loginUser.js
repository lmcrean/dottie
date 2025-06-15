/**
 * Login User Utility for Integration Tests (Playwright)
 */

/**
 * Login with existing user credentials
 * @param {Object} request - Playwright request object
 * @param {Object} credentials - Login credentials
 * @returns {Promise<string>} Authentication token
 */
export async function loginUser(request, credentials) {
  const response = await request.post("/api/auth/login", {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  const data = await response.json();

  if (response.status() !== 200) {
    console.error("Login failed:", data);
    throw new Error(`Failed to login: ${response.status()}`);
  }

  if (!data.token) {
    console.error("No token in login response:", data);
    throw new Error("Invalid login response format");
  }

  return data.token;
} 