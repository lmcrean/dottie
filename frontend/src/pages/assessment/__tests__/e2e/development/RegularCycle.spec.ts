import { test, expect } from "@playwright/test";
import path from "path";
import {
  SCREENSHOT_DIR,
  assessmentPaths,
  clearSessionStorage,
  debugPage,
  authenticateUser,
} from "./test-utils";

// Define viewport for portrait orientation
const portraitViewport = { width: 390, height: 844 }; // iPhone 12 Pro portrait dimensions

test("Regular Cycle Assessment Path - capture screenshots", async ({ page }) => {
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

  // First, authenticate the user
  console.log("Starting authentication...");
  await authenticateUser(page);
  await takeScreenshot("00-authenticated");

  // 1. Age Verification
  console.log("Navigating to age verification");
  await page.goto(assessmentPaths.ageVerification);
  await page.waitForLoadState("networkidle");
  
  // Log initial page state
  await logPageState();
  
  // Take initial screenshot
  await takeScreenshot("01-age-verification");

  // Wait for and verify the heading
  const heading = page.getByRole('heading');
  await expect(heading).toBeVisible();
  console.log("Found heading:", await heading.textContent());

  // Try to find any clickable elements
  const allButtons = await page.locator('button').all();
  console.log("\nAll buttons:");
  for (const button of allButtons) {
    console.log("Button text:", await button.textContent());
  }
});
