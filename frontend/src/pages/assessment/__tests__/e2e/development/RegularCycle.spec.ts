import { test, expect } from "@playwright/test";
import path from "path";
import {
  SCREENSHOT_DIR,
  assessmentPaths,
  clearSessionStorage,
  debugPage,
} from "./test-utils";

// Define viewport for portrait orientation
const portraitViewport = { width: 390, height: 844 }; // iPhone 12 Pro portrait dimensions

test.describe("Regular Cycle Assessment Path", () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
    // Set viewport to portrait dimensions
    await page.setViewportSize(portraitViewport);
  });

  test("capture screenshots for Regular Cycle path", async ({ page }) => {
    // 1. Age Verification

    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState("networkidle");

    // Debug page state

    await debugPage(page);

    // Wait for the page title to be visible
    try {
      await page.waitForSelector('h1:has-text("What is your age range?")', {
        timeout: 10000,
      });
    } catch (e) {
      await debugPage(page);
      throw e;
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "01-age-verification.png"),
      fullPage: true,
    });

    // Select 18-24 years by clicking the radio button directly
    try {
      await page.locator('button[role="radio"][value="18-24"]').click();
      await page.waitForTimeout(500);
    } catch (e) {
      await debugPage(page);
      throw e;
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "02-age-selected.png"),
      fullPage: true,
    });

    // Click continue button once it's enabled
    await page.waitForSelector('a[href="/assessment/cycle-length"] button', {
      timeout: 5000,
    });
    await page.locator('a[href="/assessment/cycle-length"] button').click();

    // 2. Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "03-cycle-length.png"),
      fullPage: true,
    });

    // Select 26-30 days
    await page.locator('button[role="radio"][value="26-30"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "04-cycle-length-selected.png"),
      fullPage: true,
    });

    // Click continue
    await page.waitForSelector('a[href="/assessment/period-duration"] button', {
      timeout: 5000,
    });
    await page.locator('a[href="/assessment/period-duration"] button').click();

    // 3. Period Duration
    await page.waitForURL(`**${assessmentPaths.periodDuration}**`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "05-period-duration.png"),
      fullPage: true,
    });

    // Select 4-5 days
    await page.locator('button[role="radio"][value="4-5"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "06-period-duration-selected.png"),
      fullPage: true,
    });

    // Click continue
    await page.waitForSelector('a[href="/assessment/flow"] button', {
      timeout: 5000,
    });
    await page.locator('a[href="/assessment/flow"] button').click();

    // 4. Flow
    await page.waitForURL(`**${assessmentPaths.flow}**`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "07-flow.png"),
      fullPage: true,
    });

    // Select Moderate
    await page.locator('button[role="radio"][value="moderate"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "08-flow-selected.png"),
      fullPage: true,
    });

    // Click continue
    await page.waitForSelector('a[href="/assessment/pain"] button', {
      timeout: 5000,
    });
    await page.locator('a[href="/assessment/pain"] button').click();

    // 5. Pain
    await page.waitForURL(`**${assessmentPaths.pain}**`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "09-pain.png"),
      fullPage: true,
    });

    // Select Mild
    await page.locator('button[role="radio"][value="mild"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "10-pain-selected.png"),
      fullPage: true,
    });

    // Click continue
    await page.waitForSelector('a[href="/assessment/symptoms"] button', {
      timeout: 5000,
    });
    await page.locator('a[href="/assessment/symptoms"] button').click();

    // 6. Symptoms
    await page.waitForURL(`**${assessmentPaths.symptoms}**`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "11-symptoms.png"),
      fullPage: true,
    });

    // Wait for the symptoms page to be fully loaded
    await page.waitForSelector(".grid", { timeout: 10000 });

    // Try to click directly on a visible symptom card (Fatigue)
    try {
      // Wait and then force click on the card containing the text "Fatigue"

      await page.waitForTimeout(1000); // Give the page a moment to stabilize

      // Try to find and click on the visible div containing Fatigue text
      const fatigueCard = page.locator("div", { hasText: "Fatigue" }).first();
      await fatigueCard.waitFor({ state: "visible", timeout: 10000 });
      await fatigueCard.click({ force: true });
    } catch (e) {
      console.error(
        "Failed to click on Fatigue, trying an alternative symptom",
        e
      );

      // Try clicking on a different symptom as a fallback
      const alternativeSymptom = page
        .locator("div", { hasText: "Bloating" })
        .first();
      await alternativeSymptom.waitFor({ state: "visible", timeout: 5000 });
      await alternativeSymptom.click({ force: true });
    }

    // Give the page time to register the selection
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "12-symptoms-selected.png"),
      fullPage: true,
    });

    // Ensure the Complete Assessment button is visible and clickable

    const completeButton = page
      .locator("button", { hasText: "Complete Assessment" })
      .first();
    await completeButton.waitFor({ state: "visible", timeout: 10000 });
    await completeButton.click({ force: true });

    // 7. Results
    await page.waitForURL(`**${assessmentPaths.results}**`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "13-results-regular-cycle.png"),
      fullPage: true,
    });
  });
});
