import { Page } from '@playwright/test';

/**
 * Signs in a user with the provided credentials
 * @param page Playwright Page object
 * @param email User's email
 * @param password User's password
 * @returns Boolean indicating if sign-in was successful
 */
export async function signInUser(page: Page, email: string, password: string): Promise<boolean> {
  console.log(`Attempting to sign in with email: ${email}`);
  console.log('Starting sign-in process...');
  
  // Navigate to the sign-in page if not already there
  if (!page.url().includes('/auth/sign-in')) {
    await page.goto('http://localhost:3005/auth/sign-in');
  }
  
  // Find the form
  const form = await page.locator('form').first();
  console.log(form ? 'Form found on sign-in page' : 'No form found on sign-in page');
  
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
  await page.locator('input#email').fill(email);
  console.log('Filled input with selector: input#email');
  
  await page.locator('input#password').fill(password);
  console.log('Filled input with selector: input#password');
  
  // Log all buttons for debugging
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on the page`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const type = await buttons[i].getAttribute('type');
    console.log(`Button #${i+1}: text="${text}", type=${type || 'no-type'}`);
  }
  
  // Find and click the submit button
  const signInButton = page.locator('button:has-text("Sign in")');
  console.log(signInButton ? 'Found button with selector: button:has-text("Sign in")' : 'Could not find sign-in button');
  
  // Click the button and wait for navigation
  await signInButton.click();
  
  // Wait for potential navigation to complete
  console.log('Waiting for navigation to complete...');
  await page.waitForTimeout(2000); // Wait for potential redirects
  
  console.log('Network is idle, waiting additional time...');
  await page.waitForTimeout(2000); // Additional wait to ensure localStorage is populated
  
  console.log('Finished waiting for navigation');
  
  // Check for auth token in localStorage to confirm successful sign-in
  const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
  const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
  const userData = await page.evaluate(() => localStorage.getItem('userData'));
  
  console.log(`Auth token present: ${!!authToken}`);
  console.log(`Refresh token present: ${!!refreshToken}`);
  console.log(`User data present: ${!!userData}`);
  
  // Log current URL to debug redirection
  const currentUrl = page.url();
  console.log(`After signin, current URL: ${currentUrl}`);
  
  // Consider sign-in successful if auth token is present
  if (authToken) {
    console.log('Auth token is present, considering login successful');
    return true;
  } else {
    console.log('Auth token not found, login appears to have failed');
    return false;
  }
} 