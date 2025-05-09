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
  login: "/login",
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
  
  // Navigate to login page
  await page.goto(assessmentPaths.login);
  await page.waitForLoadState("networkidle");
  
  // Log the current state
  console.log("Current URL:", page.url());
  console.log("Page title:", await page.title());
  
  // Fill in login form
  await page.getByLabel(/email/i).fill("test@example.com");
  await page.getByLabel(/password/i).fill("password123");
  
  // Click login button
  await page.getByRole("button", { name: /login/i }).click();
  
  // Wait for navigation to complete
  await page.waitForLoadState("networkidle");
  
  // Verify we're logged in
  const currentUrl = page.url();
  console.log("Post-login URL:", currentUrl);
  
  // If we're still on the login page, something went wrong
  if (currentUrl.includes("/login")) {
    throw new Error("Failed to authenticate - still on login page");
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
