import { Page } from "@playwright/test";

/**
 * Signs in a user with provided credentials
 * @param page The Playwright page object
 * @param email User's email
 * @param password User's password
 * @returns Boolean indicating if sign-in was successful
 */
export const signInUser = async (page: Page, email: string, password: string) => {
  console.log("Starting sign-in process...");
  console.log(`Using credentials: ${email} (password not logged)`);
  
  // Navigate to login page
  await page.goto("/auth/sign-in");
  await page.waitForLoadState("networkidle");
  
  // Log the current state
  console.log("Current URL:", page.url());
  console.log("Page title:", await page.title());
  
  // Debug form elements
  const emailInputs = await page.locator('input[type="email"]').all();
  console.log(`Found ${emailInputs.length} email input fields`);
  
  const passwordInputs = await page.locator('input[type="password"]').all();
  console.log(`Found ${passwordInputs.length} password input fields`);
  
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons`);
  for (const button of buttons) {
    console.log(`Button text: "${await button.textContent()}"`);
  }
  
  // Fill in login form
  try {
    console.log("Filling email field");
    await page.getByLabel(/email/i).fill(email);
    
    console.log("Filling password field");
    await page.getByLabel(/password/i).fill(password);
    
    // Wait a moment for form validation if any
    await page.waitForTimeout(500);
    
    // Click login button
    console.log("Clicking sign in button");
    const signInButton = await page.getByRole("button", { name: /sign in/i });
    await signInButton.waitFor({ state: "visible" });
    await signInButton.click();
    
    // Wait for navigation to complete
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Additional wait to ensure redirection completes
    
    // Verify we're logged in
    const currentUrl = page.url();
    console.log("Post-login URL:", currentUrl);
    
    // If we're still on the login page, something went wrong
    if (currentUrl.includes("/sign-in")) {
      console.error("Failed to authenticate - still on sign-in page");
      
      // Check for any error messages
      const errorMessages = await page.locator('.error-message, [role="alert"]').all();
      for (const error of errorMessages) {
        console.error(`Error message found: "${await error.textContent()}"`);
      }
      
      // Check page content for clues
      const pageText = await page.evaluate(() => document.body.textContent);
      console.log("Page content after login attempt:", pageText);
      
      return false;
    }
    
    console.log("Authentication successful");
    return true;
  } catch (error) {
    console.error("Error during sign-in process:", error);
    return false;
  }
};
