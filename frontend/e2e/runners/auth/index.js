/**
 * Authentication Test Runner
 * Coordinates user registration and login tests
 */

import { signUpTestUser } from './sign-up.spec.js';
import { signInUser } from './sign-in.spec.js';

export async function runAuthTests(page, testState) {
  // Use credentials from test state
  const { username, email, password } = testState;

  // Create new user account
  const signUpResult = await signUpTestUser(page);

  // Sign in with the created user
  const signInSuccess = await signInUser(page, email, password);

  if (!signInSuccess) {
    throw new Error('Authentication tests failed - could not sign in');
  }

  // Extract user info from local storage or page context if available
  let userId = null;
  let authToken = null;

  try {
    // Try to get user data from localStorage
    const userData = await page.evaluate(() => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const user = localStorage.getItem('user') || localStorage.getItem('userId');
      return { token, user };
    });

    authToken = userData.token;
    userId = userData.user;
  } catch (error) {
    console.log('Could not extract auth data from localStorage:', error.message);
  }

  return {
    userId: userId || `user_${Date.now()}`, // fallback if not found
    authToken: authToken || `token_${Date.now()}`, // fallback if not found
    success: true
  };
}
