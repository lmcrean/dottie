import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Get Setup Health Hello Endpoint E2E Test with Real API", () => {
  // Configure screenshot directories
  const baseScreenshotDir = path.join(process.cwd(), "test_screenshots");
  const screenShotDir = path.join(
    baseScreenshotDir,
    "development",
    "test_page",
    "api-connection",
    "real"
  );

  // Create directory if it doesn't exist
  test.beforeAll(() => {
    if (!fs.existsSync(screenShotDir)) {
      fs.mkdirSync(screenShotDir, { recursive: true });
    }
  });

  test("health hello endpoint returns a response", async ({ page }) => {
    // Navigate to the test page
    await page.goto("/test");

    // Wait for the page to load completely
    await page.waitForLoadState("networkidle");

    // Find the setup category
    const setupSection = page.getByText("Setup Endpoints", { exact: false });
    await setupSection.scrollIntoViewIfNeeded();

    // Take screenshot of the initial state
    await page.screenshot({
      path: path.join(screenShotDir, "setup-health-hello-before-click.png"),
      fullPage: false,
    });

    // Find and click the health/hello endpoint button
    const healthHelloButton = page.getByRole("button", {
      name: /GET \/api\/setup\/health\/hello/i,
    });
    await healthHelloButton.scrollIntoViewIfNeeded();
    await healthHelloButton.click();

    // Wait for any response to appear (whether success or error)
    await page.waitForResponse(/\/api\/setup\/health\/hello/, {
      timeout: 15000,
    });

    // Wait for the UI to update (giving it time to display either success or error)
    await page.waitForTimeout(1000);

    // Take a screenshot of the response (whether success or error)
    await page.screenshot({
      path: path.join(screenShotDir, "setup-health-hello-response.png"),
      fullPage: false,
    });

    // Get the status cell
    const statusCell = page.locator(".status-column");
    await expect(statusCell).toBeVisible();

    // Get response column
    const responseColumn = page.locator(".response-column");
    await expect(responseColumn).toBeVisible();

    // Get the actual response and status text
    const statusText = (await statusCell.textContent()) || "";
    const responseText = (await responseColumn.textContent()) || "";

    // Check if we got a success or error
    if (statusText.toLowerCase().includes("success")) {
      // Verify the success response contains expected message structure
      expect(responseText.includes("message")).toBeTruthy();
    }

    // Take screenshot of the final result
    await page.screenshot({
      path: path.join(screenShotDir, "setup-health-hello-after-click.png"),
      fullPage: false,
    });
  });
});
