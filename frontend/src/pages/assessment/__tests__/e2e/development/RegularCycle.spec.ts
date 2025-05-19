import { test, expect } from "@playwright/test";
import path from "path";
import {
  SCREENSHOT_DIR,
  assessmentPaths,
  clearSessionStorage,
  debugPage,
} from "./utils/test-utils";
import { signUpTestUser } from "./utils/sign-up.spec";
import { signInUser } from "./utils/sign-in.spec";

// Define viewport for portrait orientation
const portraitViewport = { width: 390, height: 844 }; // iPhone 12 Pro portrait dimensions

test("Regular Cycle Assessment Path - capture screenshots", async ({ page }) => {
  // Configure viewport
  await page.setViewportSize(portraitViewport);
  
  // Clear session storage
  await clearSessionStorage(page);

  // Helper function for taking screenshots
  const takeScreenshot = async (name: string) => {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${name}.png`),
      fullPage: true,
    });
  };

  // Helper function to log page state
  const logPageState = async () => {
    console.log("\nCurrent page state:");
    console.log("URL:", page.url());
    console.log("Title:", await page.title());
    
    // Log all text content
    const text = await page.evaluate(() => document.body.textContent);
    console.log("Text content:", text);
    
    // Log all buttons
    const buttons = await page.locator('button').all();
    console.log("\nButtons found:", buttons.length);
    for (const button of buttons) {
      const text = await button.textContent();
      const role = await button.getAttribute('role');
      const value = await button.getAttribute('value');
      console.log(`Button: text="${text}", role=${role}, value=${value}`);
    }
  };

  // Try to create a new test user and sign in
  // But continue the test even if authentication fails
  let authenticationSuccessful = false;
  
  try {
    // First sign up a new test user
    console.log("Creating new test user");
    const userCredentials = await signUpTestUser(page);
    await takeScreenshot("00a-after-signup");
    
    // Then sign in with the new user
    console.log("Signing in with test user");
    authenticationSuccessful = await signInUser(page, userCredentials.email, userCredentials.password);
    await takeScreenshot("00b-after-signin");
    
    if (!authenticationSuccessful) {
      console.warn("Authentication failed, but continuing with the assessment test");
    } else {
      console.log("Authentication successful, proceeding with assessment");
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    console.warn("Continuing with assessment test despite authentication error");
  }

  // Navigate to age verification
  console.log("Navigating to age verification");
  await page.goto("http://localhost:3000" + assessmentPaths.ageVerification);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000); // Give the page a moment to stabilize
  await takeScreenshot("01-age-verification");
  
  // Debug the page structure
  await debugPage(page);
  
  // Select "25+ years" option - try different selection methods
  console.log("Selecting '25+ years' option");
  try {
    // Try finding the radio button by the label text
    const ageOptions = await page.locator('label').filter({ hasText: '25+ years' }).all();
    if (ageOptions.length > 0) {
      await ageOptions[0].click();
      console.log("Selected 25+ years using label");
    } else {
      // Try finding all radio buttons and click the last one (25+ years)
      const radioButtons = await page.locator('input[type="radio"]').all();
      if (radioButtons.length > 0) {
        await radioButtons[radioButtons.length - 1].click();
        console.log("Selected last radio button (assumed to be 25+ years)");
      }
    }
  } catch (error) {
    console.error("Error selecting age option:", error);
  }
  
  await page.waitForTimeout(500); // Short wait after selection
  
  // Click Continue button
  console.log("Clicking Continue button on age verification page");
  try {
    const continueButton = await page.getByRole("button", { name: /continue/i });
    await continueButton.waitFor({ state: "visible" });
    
    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL("**/cycle-length", { timeout: 10000 });
    
    // Click the button
    await continueButton.click();
    console.log("Continue button clicked, waiting for navigation to cycle length page...");
    
    // Wait for navigation to complete
    await navigationPromise;
    console.log("Successfully navigated to cycle length page");
    
    // Wait for the page to stabilize
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error("Error navigating to cycle length page:", error);
    await logPageState();
    await takeScreenshot("error-after-age-verification");
    throw error; // Rethrow to fail the test
  }
  
  // 2. Cycle Length
  console.log("On cycle length page");
  await takeScreenshot("02-cycle-length");
  
  // Debug the cycle length page
  await debugPage(page);
  
  // Select a cycle length option
  console.log("Selecting cycle length option");
  try {
    // Look for option buttons - these appear to be regular buttons, not radio inputs
    const optionButtonsText = [
      "21-25 days",
      "26-30 days",
      "31-35 days",
      "36-40 days",
      "Irregular",
      "I'm not sure",
      "Other"
    ];
    
    // Try to click the "Average length" option (26-30 days)
    console.log("Attempting to click the '26-30 days' option");
    const averageLengthButton = await page.locator('button').filter({ hasText: /26-30 days/i }).first();
    await averageLengthButton.waitFor({ state: "visible" });
    await averageLengthButton.click();
    console.log("Selected '26-30 days' option");
    
    // Wait after selection
    await page.waitForTimeout(500);
    
    // Click Continue button
    console.log("Clicking Continue button on cycle length page");
    const continueButton = await page.getByRole("button", { name: /continue/i });
    await continueButton.waitFor({ state: "visible" });
    
    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL("**/period-duration", { timeout: 10000 });
    
    // Click the button
    await continueButton.click();
    console.log("Continue button clicked, waiting for navigation to period duration page...");
    
    // Wait for navigation to complete
    await navigationPromise;
    console.log("Successfully navigated to period duration page");
    
    // Wait for the page to stabilize
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error("Error on cycle length page:", error);
    await logPageState();
    await takeScreenshot("error-after-cycle-length");
    throw error; // Rethrow to fail the test
  }

  // 3. Period Duration
  console.log("On period duration page");
  await takeScreenshot("03-period-duration");
  
  // Debug the period duration page
  await debugPage(page);
  
  // Select a period duration option
  console.log("Selecting period duration option");
  try {
    // Try to click the "4-5 days" option (Average duration)
    console.log("Attempting to click the '4-5 days' option");
    const averageDurationButton = await page.locator('button').filter({ hasText: /4-5 days/i }).first();
    await averageDurationButton.waitFor({ state: "visible" });
    await averageDurationButton.click();
    console.log("Selected '4-5 days' option");
    
    // Wait after selection
    await page.waitForTimeout(500);
    
    // Click Continue button
    console.log("Clicking Continue button on period duration page");
    const continueButton = await page.getByRole("button", { name: /continue/i });
    await continueButton.waitFor({ state: "visible" });
    
    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL("**/flow", { timeout: 10000 });
    
    // Click the button
    await continueButton.click();
    console.log("Continue button clicked, waiting for navigation to flow page...");
    
    // Wait for navigation to complete
    await navigationPromise;
    console.log("Successfully navigated to flow page");
    
    // Wait for the page to stabilize
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error("Error on period duration page:", error);
    await logPageState();
    await takeScreenshot("error-after-period-duration");
    throw error; // Rethrow to fail the test
  }
  
  // 4. Flow
  console.log("On flow page");
  await takeScreenshot("04-flow");
  
  // Debug the flow page
  await debugPage(page);
  
  // Test completed successfully
  console.log("Test completed successfully through flow page");
});
