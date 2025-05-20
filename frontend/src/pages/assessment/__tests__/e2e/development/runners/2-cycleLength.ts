import { Page } from "@playwright/test";
import path from "path";
import { SCREENSHOT_DIR, debugPage } from "../utils/test-utils";

/**
 * Runs the cycle length step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runCycleLengthStep = async (page: Page): Promise<void> => {
  // Now on cycle length page
  console.log("Running cycle length step");
  
  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `02-cycle-length.png`),
    fullPage: true,
  });
  
  // Debug the page structure
  await debugPage(page);
  
  // Select a cycle length option
  console.log("Selecting cycle length option");
  try {
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
    throw error;
  }
};