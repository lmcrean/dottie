import { test, expect } from '@playwright/test';
import { signUpTestUser } from './runners/auth/signup-helper';
import { signInUser } from './runners/auth/signin-helper';
import { checkAssessmentPageRender } from './runners/assessment/RenderCheck';
import { runAgeVerificationStep } from './runners/assessment/1-ageVerification';
import { runCycleLengthStep } from './runners/assessment/2-cycleLength';
import { runPeriodDurationStep } from './runners/assessment/3-periodDuration';
import { runFlowStep } from './runners/assessment/4-flow';
import { runPainStep } from './runners/assessment/5-pain';
import { runSymptomsStep } from './runners/assessment/6-symptoms';
import { checkResultsPage } from './runners/assessment/7-results';

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

// Set a longer timeout for all tests since this is a comprehensive flow
test.setTimeout(300000); // 5 minutes

test.describe('Complete Assessment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Make sure the page is closed gracefully if there's an error
    page.on('crash', () => console.error('Page crashed'));
    page.on('pageerror', (error) => console.error('Page error:', error));
    
    // Take a screenshot at the start
    await page.goto('http://localhost:3005');
    await page.screenshot({ path: 'test_screenshots/complete-flow-start.png' });
  });

  test('should authenticate user and complete full assessment flow', async ({ page }) => {
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
          if (request.url().includes('/api/auth') || request.url().includes('/api/assessment')) {
            console.log(`API Request: ${request.method()} ${request.url()}`);
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
          if (response.url().includes('/api/auth') || response.url().includes('/api/assessment')) {
            console.log(`API Response: ${response.status()} ${response.statusText()} - ${response.url()}`);
          }
        }
      });

      // Step 2: Authentication Flow
      console.log('🔐 Starting authentication flow...');
      
      // Sign up a new random user
      console.log('Creating new user account...');
      const userCredentials = await signUpTestUser(page);
      
      expect(userCredentials).toBeDefined();
      expect(userCredentials.email).toBeTruthy();
      expect(userCredentials.password).toBeTruthy();
      expect(userCredentials.username).toBeTruthy();
      
      console.log(`✅ User created: ${userCredentials.email}`);

      // Sign in with the newly created user
      console.log('Signing in user...');
      const signInSuccess = await signInUser(page, userCredentials.email, userCredentials.password);
      expect(signInSuccess).toBe(true);
      
      // Verify authentication tokens
      const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
      const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
      expect(authToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();
      
      console.log('✅ Authentication successful');

      // Step 3: Navigate to Assessment
      console.log('📋 Starting assessment flow...');
      const assessmentPageLoaded = await checkAssessmentPageRender(page);
      expect(assessmentPageLoaded).toBe(true);
      
      // Step 4: Complete Assessment Steps
      console.log('Step 1: Age Verification...');
      await runAgeVerificationStep(page);
      console.log('✅ Age verification completed');

      console.log('Step 2: Cycle Length...');
      await runCycleLengthStep(page);
      console.log('✅ Cycle length completed');

      console.log('Step 3: Period Duration...');
      await runPeriodDurationStep(page);
      console.log('✅ Period duration completed');

      console.log('Step 4: Flow Assessment...');
      await runFlowStep(page);
      console.log('✅ Flow assessment completed');

      console.log('Step 5: Pain Assessment...');
      await runPainStep(page);
      console.log('✅ Pain assessment completed');

      console.log('Step 6: Symptoms Assessment...');
      await runSymptomsStep(page);
      console.log('✅ Symptoms assessment completed');

      // Step 5: View Results
      console.log('📊 Checking results page...');
      await checkResultsPage(page);
      console.log('✅ Results page verified');

      // Final verification
      const finalUrl = page.url();
      console.log(`Final URL: ${finalUrl}`);
      
      // Take final screenshot
      await page.screenshot({ path: 'test_screenshots/complete-flow-end.png', fullPage: true });
      
      console.log('🎉 Complete assessment flow test passed successfully!');
      
    } catch (error) {
      console.error('❌ Complete assessment flow test failed:', error);
      await page.screenshot({ path: 'test_screenshots/complete-flow-failure.png', fullPage: true });
      throw error;
    }
  });
}); 