import { test, expect } from '@playwright/test';
import { signUpTestUser } from './runners/auth/signup-helper';
import { signInUser } from './runners/auth/signin-helper';
import { checkAssessmentPageRender } from './runners/assessment/RenderCheck';

interface NetworkRequest {
  url: string;
  method: string;
  postData: string | null;
  headers: Record<string, string>;
}

interface NetworkResponse {
  url: string;
  status: number;
  statusText: string;
}

// Set a longer timeout for all tests
test.setTimeout(120000);

test.describe('User Authentication Flow', () => {
  // Create a fixture for the monitoring
  test.beforeEach(async ({ page }) => {
    // Make sure the page is closed gracefully if there's an error
    page.on('crash', () => console.error('Page crashed'));
    page.on('pageerror', (error) => console.error('Page error:', error));
    
    // Take a screenshot at the start
    await page.goto('http://localhost:3005');
    await page.screenshot({ path: 'test_screenshots/test-start.png' });
  });

  test('should allow user to sign up and then sign in with random user', async ({ page }) => {
    try {
      // Step 1: Set up network monitoring
      const responses: NetworkResponse[] = [];
      const requests: NetworkRequest[] = [];

      page.on('request', (request) => {
        if (request.url().includes('/api/')) {
          requests.push({
            url: request.url(),
            method: request.method(),
            postData: request.postData(),
            headers: request.headers()
          });

          // Log API requests for debugging
          if (request.url().includes('/api/auth')) {
            console.log(`Auth Request: ${request.method()} ${request.url()}`);
            if (request.postData()) {
              console.log(`Request Data: ${request.postData()}`);
            }
          }
        }
      });

      page.on('response', async (response) => {
        if (response.url().includes('/api/')) {
          const respData = {
            url: response.url(),
            status: response.status(),
            statusText: response.statusText()
          };
          responses.push(respData);

          // Log API responses for debugging
          if (response.url().includes('/api/auth')) {
            console.log(`Auth Response: ${response.status()} ${response.statusText()} - ${response.url()}`);
            try {
              if (response.status() !== 200 && response.status() !== 204) {
                const responseBody = await response.text();
                console.log(`Response Body: ${responseBody}`);
              }
            } catch (err) {
              console.log('Could not read response body');
            }
          }
        }
      });

      // Step 2: Sign up a new random user with longer timeout
      console.log('Starting sign-up process...');
      const userCredentials = await signUpTestUser(page);

      // Verify that sign-up returned valid credentials
      expect(userCredentials).toBeDefined();
      expect(userCredentials.email).toBeTruthy();
      expect(userCredentials.password).toBeTruthy();
      expect(userCredentials.username).toBeTruthy();

      // Log the credentials that were used
      console.log(`Test credentials: Email=${userCredentials.email}, Username=${userCredentials.username}`);

      // Clear network logs for sign-in
      requests.length = 0;
      responses.length = 0;

      // Step 3: Sign in with the newly created user
      console.log('Starting sign-in process...');
      const signInSuccess = await signInUser(page, userCredentials.email, userCredentials.password);

      // Take screenshot after sign-in attempt
      await page.screenshot({ path: 'test_screenshots/post-signin.png' });

      // Verify that sign-in was successful
      expect(signInSuccess).toBe(true);

      // Verify auth tokens are present in localStorage
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
      
      // Auth token should exist
      expect(authToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();
      
      console.log('Authentication successful - tokens were properly set');
      
      // Check if we can navigate to assessment page after sign-in
      console.log('Checking navigation to assessment page...');
      const assessmentPageLoaded = await checkAssessmentPageRender(page);
      
      // Take screenshot of assessment page navigation result
      await page.screenshot({ path: 'test_screenshots/assessment/final-state.png' });
      
      console.log(`Assessment page navigation result: ${assessmentPageLoaded}`);
      
      // Verify that we can actually navigate to the assessment page
      // This is important to ensure users can access protected routes after login
      expect(assessmentPageLoaded).toBe(true);
      
      // Verify we're on the assessment page URL
      const finalUrl = page.url();
      expect(finalUrl).toContain('/assessment');
      
      console.log('Test successful - user authenticated and navigation to assessment page verified');
      
    } catch (error) {
      console.error('Test failed with error:', error);
      await page.screenshot({ path: 'test_screenshots/test-failure.png' });
      throw error;
    }
  });
});
