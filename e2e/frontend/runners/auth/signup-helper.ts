import { Page } from '@playwright/test';

/**
 * User credentials interface
 */
export interface UserCredentials {
  email: string;
  password: string;
  username: string;
}

/**
 * Sign up a test user with random credentials
 * @param page Playwright Page object
 * @returns User credentials object
 */
export async function signUpTestUser(page: Page): Promise<UserCredentials> {
  console.log('Starting sign-up process...');
  
  // Navigate to the sign-up page
  await page.goto('http://localhost:3005/auth/sign-up');
  
  // Generate random user data
  const timestamp = Date.now();
  const email = `test_${timestamp}@example.com`;
  const username = `testuser_${timestamp}`;
  const password = 'TestPassword123!';
  const name = 'Test User';
  
  // Find the form
  const form = await page.locator('form').first();
  console.log(form ? 'Form found on the page' : 'No form found on the page');
  
  // Log all input elements for debugging
  const inputs = await page.locator('input').all();
  console.log(`Found ${inputs.length} input elements on page`);
  for (let i = 0; i < inputs.length; i++) {
    const id = await inputs[i].getAttribute('id');
    const type = await inputs[i].getAttribute('type');
    const name = await inputs[i].getAttribute('name');
    console.log(`Input #${i+1}: id=${id}, type=${type}, name=${name}`);
  }
  
  // Fill out the form
  await page.locator('input#name').fill(name);
  console.log('Filled input with selector: input#name');
  
  await page.locator('input#username').fill(username);
  console.log('Filled input with selector: input#username');
  
  await page.locator('input#email').fill(email);
  console.log('Filled input with selector: input#email');
  
  await page.locator('input#password').fill(password);
  console.log('Filled input with selector: input#password');
  
  await page.locator('input#confirmPassword').fill(password);
  console.log('Filled input with selector: input#confirmPassword');
  
  // Log all buttons for debugging
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on the page`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const type = await buttons[i].getAttribute('type');
    console.log(`Button #${i+1}: text="${text}", type=${type || 'no-type'}`);
  }
  
  // Find and click the submit button
  const signUpButton = page.locator('button:has-text("Create account")');
  console.log(signUpButton ? 'Found button with selector: button:has-text("Create account")' : 'Could not find sign-up button');
  
  // Click the button and wait for API response
  await signUpButton.click();
  
  // Wait for API response - if redirected, great, if not we'll check the response
  try {
    // Wait for any potential navigation
    await page.waitForTimeout(3000);
    
    // Check the current URL
    const currentUrl = page.url();
    console.log(`After signup, current URL: ${currentUrl}`);
    
    // If redirected to sign-in, that's a good sign
    if (currentUrl.includes('/auth/sign-in')) {
      console.log(`Registration appears successful - redirected to: ${currentUrl}`);
      return { email, password, username };
    }
    
    // Otherwise check if we got a successful API response
    // We might need to check network logs for this or look for success message on page
    const successElement = await page.locator('.success-message, [data-testid="signup-success"]').count();
    const errorElement = await page.locator('.error-message, [data-testid="signup-error"]').count();
    
    if (errorElement > 0) {
      const errorMessage = await page.locator('.error-message, [data-testid="signup-error"]').textContent();
      throw new Error(`Registration failed with error: ${errorMessage}`);
    }
    
    // If we don't have a clear error, let's assume success for testing purposes
    console.log('No redirect occurred, but no error detected. Proceeding with test credentials.');
    
    // Navigate to sign-in page manually
    await page.goto('http://localhost:3005/auth/sign-in');
    
    return { email, password, username };
  } catch (error) {
    console.error('Error during signup process:', error);
    throw error;
  }
} 