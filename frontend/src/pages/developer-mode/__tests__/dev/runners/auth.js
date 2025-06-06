import { expect } from '@playwright/test';

/**
 * Test runner for authentication endpoints
 * 
 * Handles testing auth-related endpoints:
 * - Register
 * - Login
 * - Logout
 */

/**
 * Captures screenshots for the auth endpoints tests
 * @param {string} testName 
 * @returns {string} Screenshot path
 */
const getScreenshotPath = (testName) => `./test_screenshots/test_page/frontend-integration/auth/${testName}.png`;

/**
 * Helper to get API response data from UI
 * @param {Object} page Playwright page
 * @returns {Promise<object|null>} Parsed response data
 */
export async function getResponseData(page) {
  const responseText = await page.locator('.api-response pre').textContent();
  try {
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error('Failed to parse response:', responseText);
    return null;
  }
}

/**
 * Helper to fill form data for endpoints
 * @param {Object} page Playwright page
 * @param {object} data Form data to fill
 */
export async function fillRequestData(page, data) {
  // Fill the request body JSON input
  await page.locator('.json-input').fill(JSON.stringify(data, null, 2));
  await page.getByRole('button', { name: 'Send Request' }).click();
  
  // Wait for response after submitting
  await page.waitForSelector('.api-response', { timeout: 15000 });
}

/**
 * Runs all auth endpoint tests
 * @param {Object} page Playwright page
 * @returns {object} Test state with user data
 */
export async function runAuthTests(page) {
  const testState = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test1234!',
    userId: null
  };
  
  await testRegister(page, testState);
  await testLogin(page, testState);
  
  return testState;
}

/**
 * Tests the register endpoint
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testRegister(page, testState) {

  
  // Navigate to the test page if needed
  const url = page.url();
  if (!url.includes('/test-page')) {
    await page.goto('/test-page');
  }
  
  // Take screenshot before attempting to find the button
  await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-before.png` });
  
  // Try multiple approaches to find the register button
  let registerButton;
  
  try {
    // First try by text 
    registerButton = page.getByRole('button', { name: /register/i });
    if (!(await registerButton.isVisible({ timeout: 2000 }))) {
      // Try by partial API path
      registerButton = page.getByRole('button', { name: /\/api\/auth\/register/i });
      if (!(await registerButton.isVisible({ timeout: 2000 }))) {
        // Try by role + text
        registerButton = page.getByRole('button').filter({ hasText: /register/i });
        if (!(await registerButton.isVisible({ timeout: 2000 }))) {
          // Try by role + text
          registerButton = page.getByRole('button').filter({ hasText: /signup/i });
        }
      }
    }
  } catch (error) {
    console.error('Error finding register button:', error);
    // Try one more approach - find all buttons and click the one with register/signup text
    const allButtons = await page.getByRole('button').all();

    for (const button of allButtons) {
      const text = await button.textContent();

      if (text.toLowerCase().includes('register') || 
          text.toLowerCase().includes('signup') || 
          text.toLowerCase().includes('auth')) {
        registerButton = button;
        break;
      }
    }
  }
  
  if (!registerButton) {
    console.error('Could not find register button');
    await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-button-not-found.png` });
    throw new Error('Register button not found');
  }
  
  // Ensure the button is visible
  try {
    await registerButton.scrollIntoViewIfNeeded();
  } catch (error) {

  }
  
  await page.waitForTimeout(500); // Small wait for animations
  
  // Take screenshot before clicking
  await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-before-click.png` });
  
  // Click the button
  try {
    await registerButton.click();

  } catch (error) {
    console.error('Error clicking register button:', error);
    throw error;
  }
  
  // Wait for form to appear - look for JSON input
  let jsonInput;
  try {
    jsonInput = page.locator('.json-input');
    await jsonInput.waitFor({ timeout: 5000 });

  } catch (error) {
    console.error('Error waiting for JSON input:', error);
    await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-form-not-found.png` });
    throw error;
  }
  
  // Fill registration form
  try {
    await jsonInput.fill(JSON.stringify({
      username: testState.username,
      email: testState.email,
      password: testState.password
    }, null, 2));
    
    // Find and click send request button
    const sendButton = page.getByRole('button', { name: 'Send Request' });
    await sendButton.click();

    
    // Wait for response
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-response.png` });
  } catch (error) {
    console.error('Error filling registration form:', error);
    await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-form-fill-error.png` });
    throw error;
  }
  
  // Try to get response in a flexible way similar to the setup endpoints
  let responseText = '';
  let responseData = null;
  
  try {
    // Try finding response in various ways
    const successIndicator = page.locator('text=Success');
    if (await successIndicator.isVisible({ timeout: 1000 })) {

    }
    
    // Look for pre tag or api-response
    try {
      const apiResponse = page.locator('.api-response pre');
      if (await apiResponse.isVisible({ timeout: 1000 })) {
        responseText = await apiResponse.textContent() || '';
      } else {
        // Try any pre tag in the third column
        const preTags = page.locator('pre');
        const count = await preTags.count();

        
        for (let i = 0; i < count; i++) {
          const preTag = preTags.nth(i);
          if (await preTag.isVisible()) {
            responseText = await preTag.textContent() || '';
            if (responseText) break;
          }
        }
      }
    } catch (error) {

    }
    
    if (responseText) {

      
      // Try to parse the response text into JSON
      try {
        // Find the JSON in the response text (looking for {...})
        const jsonPattern = /{[\s\S]*}/;
        const match = responseText.match(jsonPattern);
        
        if (match) {
          responseData = JSON.parse(match[0]);

        }
      } catch (error) {
        console.error('Failed to parse response JSON:', error);
      }
    }
  } catch (error) {
    console.error('Error getting response:', error);
  }
  
  // If we have a response, check if it has the expected properties
  if (responseData) {

    
    // Verify response content
    if (responseData.user && responseData.user.id) {
      // Save user ID for later tests
      testState.userId = responseData.user.id;


    } else {

      throw new Error('Response doesn\'t contain user ID');
    }
  } else {
    // Take a screenshot of the full page for debugging
    await page.screenshot({ path: `./test_screenshots/test_page/frontend-integration/auth/register-no-response.png`, fullPage: true });

    throw new Error('Could not parse response data');
  }
}

/**
 * Tests the login endpoint
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testLogin(page, testState) {

  
  // Find the login button
  const loginButton = page.getByRole('button', { name: /POST \/api\/auth\/login/i });
  
  // Ensure the button is visible
  await loginButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Click the button
  await loginButton.click();

  
  // Fill login form
  await fillRequestData(page, {
    email: testState.email,
    password: testState.password
  });
  
  await page.screenshot({ path: getScreenshotPath('login-endpoint') });
  
  // Verify response content
  const responseData = await getResponseData(page);
  expect(responseData).toHaveProperty('token');
  
  // Verify UI shows logged in status
  await expect(page.locator('.auth-status')).toContainText('Logged in');
  

} 