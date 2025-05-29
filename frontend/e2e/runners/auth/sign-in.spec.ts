import { Page } from '@playwright/test';

/**
 * Signs in a user with provided credentials
 * @param page The Playwright page object
 * @param email User's email
 * @param password User's password
 * @returns Boolean indicating if sign-in was successful
 */
export const signInUser = async (page: Page, email: string, password: string) => {
  // Navigate to login page
  await page.goto('http://localhost:3005/auth/sign-in');
  await page.waitForLoadState('networkidle');

  console.log(`Attempting to sign in with email: ${email}`);

  try {
    console.log('Starting sign-in process...');
    
    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('Form found on sign-in page');
    
    // Take a screenshot of the form
    await page.screenshot({ path: 'test_screenshots/signin-form.png' });
    
    // Log all input elements to help debug
    const inputs = await page.locator('input').all();
    console.log(`Found ${inputs.length} input elements on page`);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const id = await input.getAttribute('id') || 'no-id';
      const type = await input.getAttribute('type') || 'no-type';
      const name = await input.getAttribute('name') || 'no-name';
      console.log(`Input #${i+1}: id=${id}, type=${type}, name=${name}`);
    }

    // Fill in login form using multiple selector strategies
    await fillInputField(page, 'input#email, input[name="email"], input[type="email"], input[placeholder*="email" i]', email);
    await fillInputField(page, 'input#password, input[name="password"], input[type="password"], input[placeholder*="password" i]', password);

    // Wait a moment for form validation if any
    await page.waitForTimeout(500);

    // Take screenshot before submission for debugging
    await page.screenshot({ path: 'test_screenshots/before-signin-submit.png' });

    // Find all buttons on the page
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on the page`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const type = await button.getAttribute('type') || 'no-type';
      console.log(`Button #${i+1}: text="${text?.trim()}", type=${type}`);
    }

    // Click login button - try multiple selectors
    const buttonSelectors = [
      'button:has-text("Sign in")',
      'button:has-text("Login")',
      'button:has-text("Log in")',
      'button[type="submit"]',
      'form button'
    ];
    
    let buttonClicked = false;
    for (const selector of buttonSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        console.log(`Found button with selector: ${selector}`);
        await button.click();
        buttonClicked = true;
        break;
      }
    }
    
    if (!buttonClicked) {
      console.error('Could not find submit button with any of the expected selectors');
      // As a last resort, try to submit the form directly
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) form.submit();
      });
      console.log('Attempted form submission via JavaScript');
    }

    // Wait longer for navigation to complete
    console.log('Waiting for navigation to complete...');
    await page.waitForLoadState('networkidle');
    console.log('Network is idle, waiting additional time...');
    
    // Increased wait time to 5 seconds
    await page.waitForTimeout(5000);
    console.log('Finished waiting for navigation');

    // Take screenshot after submission for debugging
    await page.screenshot({ path: 'test_screenshots/after-signin-submit.png' });

    // Check localStorage for auth tokens
    const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
    const userData = await page.evaluate(() => localStorage.getItem('auth_user'));
    
    console.log('Auth token present:', !!authToken);
    console.log('Refresh token present:', !!refreshToken);
    console.log('User data present:', !!userData);
    
    if (userData) {
      console.log('User data:', userData);
    }

    // Verify we're logged in
    const currentUrl = page.url();
    console.log(`After signin, current URL: ${currentUrl}`);

    // Check if auth token is present - primary indicator of successful authentication
    if (authToken) {
      console.log('Auth token is present, considering login successful');
      return true;
    }

    // If no auth token, check for redirection as a fallback indicator
    const isRedirected = !currentUrl.includes('/sign-in') && !currentUrl.includes('/sign-up');
    
    if (!isRedirected) {
      console.error('Failed to authenticate - still on sign-in page and no auth token present');

      // Check for any error messages
      const errorMessages = await page.locator('[role="alert"], .text-red-500, [class*="error" i]').all();
      for (const error of errorMessages) {
        const errorText = await error.textContent();
        console.error(`Error message found: "${errorText}"`);
      }

      // Check if there are form validation errors
      const formErrors = await page.locator('input:invalid').all();
      if (formErrors.length > 0) {
        console.error(`Found ${formErrors.length} invalid form fields`);
      }
      
      // Try to extract any relevant error messages from the page
      const pageText = await page.textContent('body');
      if (pageText.includes('error') || pageText.includes('failed') || pageText.includes('invalid')) {
        console.error('Page contains error-related text. Body text excerpt:', 
          pageText.substring(0, 500) + '...');
      }

      return false;
    }

    console.log('Sign-in appears successful - redirected to:', currentUrl);
    return true;
  } catch (error) {
    console.error('Error during sign-in process:', error);
    // Take error screenshot
    await page.screenshot({ path: 'test_screenshots/signin-error.png' });
    return false;
  }
};

/**
 * Helper function to fill an input field using multiple selectors
 */
async function fillInputField(page: Page, selectors: string, value: string) {
  const selectorList = selectors.split(',').map(s => s.trim());
  let filled = false;
  
  for (const selector of selectorList) {
    const locator = page.locator(selector);
    if (await locator.count() > 0) {
      await locator.fill(value);
      console.log(`Filled input with selector: ${selector}`);
      filled = true;
      break;
    }
  }
  
  if (!filled) {
    console.error(`Could not find input field with any of these selectors: ${selectors}`);
  }
}
