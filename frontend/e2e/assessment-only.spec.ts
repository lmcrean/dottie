/**
 * Assessment-Only E2E Test
 *
 * Simplified test that only runs authentication and assessment flow
 * Perfect for quick validation that SQLite backend is working
 */

import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Import operations controllers
import { AssessmentOperations } from './runners/operations/Assessment';

// Import auth functionality
import { runAuthTests } from './runners/auth/index';

// Create screenshot directory
const screenshotDir = path.join(process.cwd(), 'test_screenshots', 'assessment_only');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Shared test state
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

test.describe('Assessment-Only E2E Test with SQLite', () => {
  // Screenshot helper
  const saveScreenshot = async (page: Page, name: string) => {
    testState.screenshotCount++;
    const filename = `${screenshotDir}/${String(testState.screenshotCount).padStart(2, '0')}-${name}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
  };

  test('Authentication and Assessment Flow', async ({ page }) => {
    console.log('🔐 ==> STARTING AUTHENTICATION');

    // Setup error handling
    page.on('console', (msg) => console.log(`PAGE LOG: ${msg.type()} - ${msg.text()}`));
    page.on('pageerror', (error) => console.error(`PAGE ERROR: ${error}`));

    try {
      // Step 1: Authentication
      const authResult = await runAuthTests(page, testState);

      // Update global state
      testState.userId = authResult.userId;
      testState.authToken = authResult.authToken;

      console.log(`✅ Authentication successful - User ID: ${testState.userId}`);
      await saveScreenshot(page, 'auth-complete');

      // Step 2: Assessment Operations
      console.log('📋 ==> STARTING ASSESSMENT OPERATIONS');

      const assessmentOps = new AssessmentOperations(page, testState);
      const result = await assessmentOps.runCompleteFlow();

      if (!result.success) {
        console.error(`Assessment operations failed: ${result.error}`);
        await saveScreenshot(page, 'assessment-failed');
        throw new Error(`Assessment operations failed: ${result.error}`);
      } else {
        console.log('✅ Assessment operations completed successfully!');
        await saveScreenshot(page, 'assessment-complete');
      }

      testState.assessmentIds = result.assessmentIds;

      console.log('🎉 TEST COMPLETE - All operations passed!');
      console.log(`   User created: ${testState.email}`);
      console.log(`   Assessments: ${testState.assessmentIds.length} created`);
      console.log(`   Screenshots: ${testState.screenshotCount} saved to ${screenshotDir}`);
    } catch (error) {
      console.error('❌ Test failed:', error);
      await saveScreenshot(page, 'test-failed');
      throw error;
    }
  });
});
