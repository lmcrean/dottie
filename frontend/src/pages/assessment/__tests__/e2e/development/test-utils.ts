import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { Page } from "@playwright/test";

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the output directory for screenshots
export const SCREENSHOT_DIR = path.join(
  process.cwd(),
  "test_screenshots/assessment"
);

// Ensure the directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Base assessment paths
const assessmentBasePath = "/assessment";

// Different assessment paths to test
export const assessmentPaths = {
  login: "/auth/sign-in",
  ageVerification: `${assessmentBasePath}/age-verification`,
  cycleLength: `${assessmentBasePath}/cycle-length`,
  periodDuration: `${assessmentBasePath}/period-duration`,
  flow: `${assessmentBasePath}/flow`,
  pain: `${assessmentBasePath}/pain`,
  symptoms: `${assessmentBasePath}/symptoms`,
  results: `${assessmentBasePath}/results`,
};

// Authentication helper
export const authenticateUser = async (page: Page) => {
  console.log("Starting authentication process...");
  
  const email = `test_${Date.now()}@example.com`;
  const password = "TestPassword123!";
  const username = `testuser_${Date.now()}`;
  
  // First register a new user
  console.log("Creating a new test user account");
  
  // Navigate to sign-up page
  await page.goto("/auth/sign-up");
  await page.waitForLoadState("networkidle");
  
  // Fill in registration form
  await page.getByLabel(/full name/i).fill("Test User");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/email/i).fill(email);
  
  // Find password fields
  const passwordFields = await page.locator('input[type="password"]').all();
  if (passwordFields.length >= 2) {
    await passwordFields[0].fill(password);
    await passwordFields[1].fill(password);
  } else {
    // Try with label
    await page.getByLabel(/password/i).fill(password);
    await page.getByLabel(/confirm password/i).fill(password);
  }
  
  // Click create account button
  await page.getByRole("button", { name: /create account/i }).click();
  await page.waitForLoadState("networkidle");
  
  // Now sign in with the new account
  console.log("Signing in with new account");
  
  // Navigate to login page
  await page.goto(assessmentPaths.login);
  await page.waitForLoadState("networkidle");
  
  // Log the current state
  console.log("Current URL:", page.url());
  console.log("Page title:", await page.title());
  
  // Fill in login form
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  
  // Click login button
  await page.getByRole("button", { name: /sign in/i }).click();
  
  // Wait for navigation to complete
  await page.waitForLoadState("networkidle");
  
  // Verify we're logged in
  const currentUrl = page.url();
  console.log("Post-login URL:", currentUrl);
  
  // If we're still on the login page, something went wrong
  if (currentUrl.includes("/sign-in")) {
    throw new Error("Failed to authenticate - still on sign-in page");
  }
  
  console.log("Authentication successful");
};

// Debug helper
export const debugPage = async (page: Page) => {
  // Log all text content
  const textContent = await page.evaluate(() => document.body.textContent);
  console.log("Page content:", textContent);

  // Log all buttons
  const buttons = await page.locator("button").all();
  console.log("\nButtons found:", buttons.length);
  for (const button of buttons) {
    const text = await button.textContent();
    const role = await button.getAttribute('role');
    const value = await button.getAttribute('value');
    console.log(`Button: text="${text}", role=${role}, value=${value}`);
  }
};

// Setup session storage with test data
export const setupSessionStorage = async (
  page: Page,
  data: Record<string, any>
) => {
  await page.evaluate((sessionData) => {
    Object.entries(sessionData).forEach(([key, value]) => {
      if (typeof value === "object") {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } else {
        window.sessionStorage.setItem(key, String(value));
      }
    });
  }, data);
};

// Clear session storage
export const clearSessionStorage = async (page: Page) => {
  await page.addInitScript(() => {
    window.sessionStorage.clear();
  });
};
