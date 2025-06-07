import { test, expect } from "@playwright/test";
import axios, { AxiosError } from "axios";
import * as fs from "fs";
import * as path from "path";

// Ensure screenshots directory exists
const screenshotsDir = path.join(
  process.cwd(),
  "test-results",
  "setup-endpoints"
);
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Helper function to make reliable API calls
async function makeApiCall(url: string) {
  try {
    return await axios.get(url);
  } catch (error: unknown) {
    console.error(
      `Error calling ${url}:`,
      error instanceof Error ? error.message : "Unknown error"
    );
    if (error instanceof AxiosError && error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}

// Function to save response to a screenshot file
function saveResponseScreenshot(testName: string, response: any) {
  const screenshotPath = path.join(screenshotsDir, `${testName}.json`);
  fs.writeFileSync(screenshotPath, JSON.stringify(response.data, null, 2));
}

// Test for Health Hello Endpoint
test("should call health/hello endpoint successfully", async ({ page }) => {
  try {
    const response = await makeApiCall(
      "http://localhost:3001/api/setup/health/hello"
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: "Hello World from Dottie API!",
    });

    // Save screenshot of the response
    saveResponseScreenshot("health-hello-endpoint", response);

    // Take a screenshot of the page for visual confirmation
    await page.goto("http://localhost:3001/test_page");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(screenshotsDir, "health-hello-page.png"),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    test.fail(false, errorMessage);
  }
});

// Test for Database Status Endpoint
test("should call database/status endpoint successfully", async ({ page }) => {
  try {
    const response = await makeApiCall(
      "http://localhost:3001/api/setup/database/status"
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: "connected",
    });

    // Save screenshot of the response
    saveResponseScreenshot("database-status-endpoint", response);

    // Take a screenshot of the page for visual confirmation
    await page.goto("http://localhost:3001/test_page");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(screenshotsDir, "database-status-page.png"),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    test.fail(false, errorMessage);
  }
});

// Test for Database Hello Endpoint
test("should call database/hello endpoint successfully", async ({ page }) => {
  try {
    const response = await makeApiCall(
      "http://localhost:3001/api/setup/database/hello"
    );

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: "Hello World from SQLite!",
      dbType: "sqlite3",
      isConnected: true,
    });

    // Save screenshot of the response
    saveResponseScreenshot("database-hello-endpoint", response);

    // Take a screenshot of the page for visual confirmation
    await page.goto("http://localhost:3001/test_page");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(screenshotsDir, "database-hello-page.png"),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    test.fail(false, errorMessage);
  }
});
