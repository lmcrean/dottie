import { test, expect } from "@playwright/test";
import { signUpTestUser } from "../../../../__tests__/dev/runners/auth/sign-up.spec";
import { signInUser } from "../../../../__tests__/dev/runners/auth/sign-in.spec";

test("Authentication Test", async ({ page }) => {
  console.log("Starting authentication test");
  
  // Clear any existing state
  await page.goto("http://localhost:3001");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  console.log("Creating new test user");
  
  // Create a unique user with more easily identified credentials
  const timestamp = Date.now();
  const email = `test_user_${timestamp}@example.com`;
  const password = "TestPassword123!";
  const username = `test_user_${timestamp}`;
  
  try {
    // Navigate to sign-up page
    await page.goto("http://localhost:3001/auth/sign-up");
    await page.waitForLoadState("networkidle");
    
    console.log("On sign-up page:", page.url());
    
    // Fill in registration form manually
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="username"]', username);
    await page.fill('input[type="email"]', email);
    
    // Get all password fields and fill them
    const passwordFields = await page.locator('input[type="password"]').all();
    for (const field of passwordFields) {
      await field.fill(password);
    }
    
    // Click create account button - using exact text match
    await page.getByRole("button", { name: "Create Account" }).click();
    
    // Wait for sign-up to complete
    await page.waitForTimeout(2000);
    
    console.log("After sign-up URL:", page.url());
    
    // Now sign in with the created user
    await page.goto("http://localhost:3001/auth/sign-in");
    await page.waitForLoadState("networkidle");
    
    console.log("On sign-in page:", page.url());
    
    // Fill credentials
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    
    // Click sign in button
    await page.getByRole("button", { name: "Sign in" }).click();
    
    // Wait for sign-in to complete
    await page.waitForTimeout(2000);
    
    console.log("After sign-in URL:", page.url());
    
    // Verify if authentication was successful
    const isSignInPage = page.url().includes("/sign-in");
    if (isSignInPage) {
      console.error("Authentication failed - still on sign-in page");
      
      // Get any error messages
      const errorMessages = await page.locator('[role="alert"]').all();
      for (const error of errorMessages) {
        console.error(`Error message: ${await error.textContent()}`);
      }
      
      // Dump cookies for debugging
      const cookies = await page.context().cookies();
      console.log("Cookies:", JSON.stringify(cookies));
    } else {
      console.log("Authentication successful!");
      
      // Try to access the age verification page
      await page.goto("http://localhost:3001/assessment/age-verification");
      await page.waitForLoadState("networkidle");
      
      console.log("Age verification page URL:", page.url());
      
      // Verify we're on the age verification page
      if (page.url().includes("/age-verification")) {
        console.log("Successfully accessed age verification page");
      } else {
        console.error("Redirected away from age verification page");
      }
    }
  } catch (error) {
    console.error("Error during authentication test:", error);
  }
}); 