import { test, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import process from 'process';

// Import all test modules
import { runLandingTests } from './runners/landing/index.ts';
import { runAuthTests } from './runners/auth/index.ts';
import { runUserTests } from './runners/user/index.ts';
import { runAssessmentTests, cleanupAssessments } from './runners/assessment/index.ts';
import { runChatTests, cleanupChatResources } from './runners/chat/index.ts';

/**
 * Master Integration Test for Frontend Pages
 *
 * This test suite runs all page integration tests in sequence to validate
 * the complete user journey through the application.
 *
 * Test flow:
 * 1. Landing Page - Basic page rendering and API health checks
 * 2. Authentication - Register, login, token verification
 * 3. User - Profile viewing and management
 * 4. Assessment - Create, view, and manage assessment data
 * 5. Chat - Conversation functionality
 * 6. Cleanup - Remove test resources
 */

// Configure tests to run in sequence
test.describe.configure({ mode: 'serial' });

// Create screenshot directory if it doesn't exist
const screenshotDir = path.join(process.cwd(), 'test_screenshots', 'page_integration');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Shared test state across all test modules
const testState = {
  userId: null,
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'Test1234!',
  authToken: null,
  assessmentIds: [],
  conversationId: null,
  screenshotCount: 0
};

test.describe('Frontend Pages Integration', () => {
  // Save screenshot with sequential numbering
  const saveScreenshot = async (page: Page, name: string) => {
    testState.screenshotCount++;
    const filename = `${screenshotDir}/${String(testState.screenshotCount).padStart(2, '0')}-${name}.png`;
    await page.screenshot({ path: filename, fullPage: true });
  };

  test('1. Setup and landing page tests', async ({ page }) => {
    // Setup console listeners for debugging
    page.on('console', (msg) => console.log(`PAGE LOG: ${msg.type()} - ${msg.text()}`));
    page.on('pageerror', (error) => console.error(`PAGE ERROR: ${error}`));

    // Run landing page tests
    await runLandingTests(page);
    await saveScreenshot(page, 'landing-page-complete');
  });

  test('2. Authentication tests', async ({ page }) => {
    // Run auth tests and update shared state
    const authState = await runAuthTests(page, testState);

    // Update global state
    testState.userId = authState.userId;
    testState.authToken = authState.authToken;

    await saveScreenshot(page, 'auth-complete');
  });

  test('3. User profile tests', async ({ page }) => {
    // Run user tests with auth state
    const userState = await runUserTests(page, testState);

    // Update with any changed profile info
    testState.username = userState.username;

    await saveScreenshot(page, 'user-complete');
  });

  test('4. Assessment tests', async ({ page }) => {
    // Run assessment tests with shared state
    const assessmentState = await runAssessmentTests(page, testState);

    // Update assessment IDs
    testState.assessmentIds = assessmentState.assessmentIds;

    await saveScreenshot(page, 'assessment-complete');
  });

  test('5. Chat functionality tests', async ({ page }) => {
    // Run chat tests
    const chatState = await runChatTests(page, testState);

    // Update conversation ID
    testState.conversationId = chatState.conversationId;

    await saveScreenshot(page, 'chat-complete');
  });

  test('6. Cleanup test resources', async ({ page }) => {
    // Delete all created resources
    await cleanupChatResources(page, testState);

    // Delete assessments
    if (testState.assessmentIds.length > 0) {
      await cleanupAssessments(page, testState);
    }

    await saveScreenshot(page, 'cleanup-complete');
  });
});
