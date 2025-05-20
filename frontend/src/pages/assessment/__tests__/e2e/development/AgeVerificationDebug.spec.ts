import { test, expect } from "@playwright/test";
import { Page } from "@playwright/test";
import { signUpTestUser } from "../../../../__tests__/dev/runners/auth/sign-up.spec";
import { signInUser } from "../../../../__tests__/dev/runners/auth/sign-in.spec";

// Define viewport for portrait orientation
const portraitViewport = { width: 390, height: 844 }; // iPhone 12 Pro portrait dimensions

test("Debug Age Verification Step", async ({ page }) => {
  // Configure viewport
  await page.setViewportSize(portraitViewport);
  
  console.log("Running age verification debug test");
  
  // First, authenticate the user
  try {
    console.log("Creating new test user");
    const userCredentials = await signUpTestUser(page);
    
    console.log("Signing in with test user");
    await signInUser(page, userCredentials.email, userCredentials.password);
    
    // Verify we're logged in
    console.log("Current URL after sign-in attempt:", page.url());
  } catch (error) {
    console.error("Error during authentication:", error);
    console.warn("Will continue with test but it may fail if authentication is required");
  }
  
  // Navigate to age verification
  console.log("Navigating to age verification page");
  await page.goto("http://localhost:3001/assessment/age-verification");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000); // Give the page a moment to stabilize
  
  // Take a screenshot before any interaction
  await page.screenshot({ path: 'age-verification-initial.png' });
  
  // Debug the page structure
  console.log("Debug: Page title:", await page.title());
  console.log("Debug: Current URL:", page.url());
  
  // List available data-testid elements
  const testIds = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-testid]'))
      .map(el => el.getAttribute('data-testid'));
  });
  console.log("Available data-testid elements:", testIds);
  
  // List all buttons
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on the page`);
  for (const button of buttons) {
    const text = await button.textContent();
    const role = await button.getAttribute('role');
    const dataTestId = await button.getAttribute('data-testid');
    console.log(`Button: text="${text}", role=${role}, data-testid=${dataTestId}`);
  }
  
  // Try clicking the 25+ option using different approaches
  try {
    // First check if we're on the age verification page or still on the login page
    if (page.url().includes("/auth/sign-in")) {
      console.log("Still on login page - authentication may have failed");
      return;
    }
    
    console.log("Attempting to select 25+ years option");
    
    // Approach 1: Using data-testid
    const ageOptionByTestId = page.getByTestId('option-25-plus');
    const isOptionVisible = await ageOptionByTestId.isVisible();
    console.log("Is 25+ option visible by test-id?", isOptionVisible);
    
    if (isOptionVisible) {
      await ageOptionByTestId.click();
      console.log("Selected 25+ years using data-testid");
    } else {
      // Approach 2: Using text content
      const ageOptionByText = page.getByText('25+ years');
      const isTextOptionVisible = await ageOptionByText.isVisible();
      console.log("Is 25+ option visible by text?", isTextOptionVisible);
      
      if (isTextOptionVisible) {
        await ageOptionByText.click();
        console.log("Selected 25+ years using text content");
      } else {
        console.error("Could not find 25+ years option using any approach");
      }
    }
    
    // Take another screenshot after selecting the option
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'age-verification-selected.png' });
    
    // Now try to find the continue button
    console.log("Attempting to find and click the Continue button");
    
    // First, check if the continue button is visible by test-id
    const continueButton = page.getByTestId('continue-button');
    const isContinueVisible = await continueButton.isVisible();
    console.log("Is continue button visible by test-id?", isContinueVisible);
    
    if (isContinueVisible) {
      // Click it and wait for navigation
      const navigationPromise = page.waitForURL("**/cycle-length", { timeout: 10000 });
      await continueButton.click();
      await navigationPromise;
      console.log("Successfully navigated to next page");
    } else {
      // Try alternative approach - find by text
      const continueByText = page.getByText('Continue', { exact: true });
      const isContinueTextVisible = await continueByText.isVisible();
      console.log("Is continue button visible by text?", isContinueTextVisible);
      
      if (isContinueTextVisible) {
        const navigationPromise = page.waitForURL("**/cycle-length", { timeout: 10000 });
        await continueByText.click();
        await navigationPromise;
        console.log("Successfully navigated using text button");
      } else {
        console.error("Could not find Continue button using any approach");
        
        // Dump the entire page HTML for debugging
        const pageHtml = await page.content();
        console.log("Page HTML:", pageHtml.substring(0, 500) + "... [truncated]");
      }
    }
    
    // Final screenshot
    await page.screenshot({ path: 'age-verification-final.png' });
    
  } catch (error) {
    console.error("Error in debug test:", error);
    await page.screenshot({ path: 'age-verification-error.png' });
  }
}); 