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
  ageVerification: `${assessmentBasePath}/age-verification`,
  cycleLength: `${assessmentBasePath}/cycle-length`,
  periodDuration: `${assessmentBasePath}/period-duration`,
  flow: `${assessmentBasePath}/flow`,
  pain: `${assessmentBasePath}/pain`,
  symptoms: `${assessmentBasePath}/symptoms`,
  results: `${assessmentBasePath}/results`,
};

// Debug helper
export const debugPage = async (page: Page) => {
  // Log all text content
  const textContent = await page.evaluate(() => document.body.textContent);

  // Log all buttons
  const buttons = await page.locator("button").all();

  const radioButtons = await page.locator('button[role="radio"]').all();

  const radioContainers = await page
    .locator("div.space-y-4 > div, div.space-y-3 > div")
    .all();

  for (let i = 0; i < radioContainers.length; i++) {
    const container = radioContainers[i];
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
