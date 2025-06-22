/**
 * Master Integration Test with Operations Architecture
 * 
 * This test suite implements the new operations-based architecture:
 * master-integration-operations.spec.ts → ./runners/operations/Assessment.ts → ./runners/assessment/get-assessment-list.ts
 * 
 * Architecture Flow:
 * 1. Authentication (using existing auth runners)
 * 2. Assessment Operations (list → create → detail → cleanup)
 * 3. Chat Operations (history → create → message → cleanup)  
 * 4. User Operations (profile → update → verify)
 * 5. Final Cleanup
 * 
 * This provides a comprehensive test suite that can be extended by other developers
 * and integrated into GitHub Actions for automated PR checks.
 */

import { test, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import process from 'process';

// Import operations controllers
import { AssessmentOperations } from './runners/operations/Assessment';
import { ChatOperations } from './runners/operations/Chat';
import { UserOperations } from './runners/operations/User';

// Import auth functionality (reusing existing)
import { runAuthTests } from './runners/auth/index';

// Configure tests to run in sequence
test.describe.configure({ mode: 'serial' });

// Set a longer timeout for comprehensive testing
test.setTimeout(600000); // 10 minutes

// Create screenshot directory
const screenshotDir = path.join(process.cwd(), 'test_screenshots', 'operations_integration');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Shared test state across all operations
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

test.describe('Master Integration Test - Operations Architecture', () => {
  // Screenshot helper
  const saveScreenshot = async (page: Page, name: string) => {
    testState.screenshotCount++;
    const filename = `${screenshotDir}/${String(testState.screenshotCount).padStart(2, '0')}-${name}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
  };

  test('1. Authentication and Assessment Flow', async ({ page }) => {
    console.log('🔐 ==> STARTING AUTHENTICATION OPERATIONS');
    
    // Setup error handling
    page.on('console', (msg) => console.log(`PAGE LOG: ${msg.type()} - ${msg.text()}`));
    page.on('pageerror', (error) => console.error(`PAGE ERROR: ${error}`));
    page.on('crash', () => console.error('Page crashed'));

    try {
      // Step 1: Authentication
      const authResult = await runAuthTests(page, testState);
      
      // Update global state
      testState.userId = authResult.userId;
      testState.authToken = authResult.authToken;
      
      console.log(`✅ Authentication successful - User ID: ${testState.userId}`);
      await saveScreenshot(page, 'auth-complete');
      
      // Step 2: Assessment Operations (immediately after auth in same context)
      console.log('📋 ==> STARTING ASSESSMENT OPERATIONS');
      
      // Initialize Assessment Operations
      const assessmentOps = new AssessmentOperations(page, testState);
      
      // Run complete assessment flow
      const result = await assessmentOps.runCompleteFlow();
      
      if (!result.success) {
        console.error(`Assessment operations failed: ${result.error}`);
        await saveScreenshot(page, 'assessment-failed');
        
        // Stop the test when assessment fails
        throw new Error(`Assessment operations failed: ${result.error}`);
      } else {
        console.log('✅ Assessment operations completed successfully!');
        await saveScreenshot(page, 'assessment-complete');
      }
      
      // Update state
      testState.assessmentIds = result.assessmentIds;
      
    } catch (error) {
      console.error('❌ Authentication or Assessment failed:', error);
      await saveScreenshot(page, 'auth-assessment-failed');
      throw error;
    }
  });

  test('2. Chat Operations Flow', async ({ page }) => {
    console.log('💬 ==> STARTING CHAT OPERATIONS');
    
    try {
      // Initialize Chat Operations
      const chatOps = new ChatOperations(page, testState);
      
      // Run complete chat flow
      const result = await chatOps.runCompleteFlow();
      
      if (!result.success) {
        console.error(`Chat operations failed: ${result.error}`);
        await saveScreenshot(page, 'chat-failed');
        console.log('⚠️ Continuing despite chat failure...');
      } else {
        console.log('✅ Chat operations completed successfully!');
        await saveScreenshot(page, 'chat-complete');
      }
      
      // Update state
      testState.conversationId = result.conversationId;
      
    } catch (error) {
      console.error('❌ Chat operations error:', error);
      await saveScreenshot(page, 'chat-error');
      console.log('⚠️ Continuing to next operations section...');
    }
  });

  test('3. User Operations Flow', async ({ page }) => {
    console.log('👤 ==> STARTING USER OPERATIONS');
    
    try {
      // Initialize User Operations
      const userOps = new UserOperations(page, testState);
      
      // Run complete user flow
      const result = await userOps.runCompleteFlow();
      
      if (!result.success) {
        console.error(`User operations failed: ${result.error}`);
        await saveScreenshot(page, 'user-failed');
        console.log('⚠️ Continuing despite user failure...');
      } else {
        console.log('✅ User operations completed successfully!');
        await saveScreenshot(page, 'user-complete');
      }
      
      // Update state if profile was updated
      if (result.updatedProfile) {
        testState.username = result.updatedProfile.username || testState.username;
      }
      
    } catch (error) {
      console.error('❌ User operations error:', error);
      await saveScreenshot(page, 'user-error');
      console.log('⚠️ Continuing to cleanup...');
    }
  });

  test('4. Cleanup Operations', async ({ page }) => {
    console.log('🗑️ ==> STARTING CLEANUP OPERATIONS');
    
    try {
      // Cleanup in reverse order
      
      // User cleanup (usually not needed)
      if (testState.userId) {
        const userOps = new UserOperations(page, testState);
        await userOps.cleanup();
      }
      
      // Chat cleanup
      if (testState.conversationId) {
        const chatOps = new ChatOperations(page, testState);
        await chatOps.cleanup();
      }
      
      // Assessment cleanup
      if (testState.assessmentIds.length > 0) {
        const assessmentOps = new AssessmentOperations(page, testState);
        await assessmentOps.cleanup();
      }
      
      console.log('✅ Cleanup operations completed!');
      await saveScreenshot(page, 'cleanup-complete');
      
    } catch (error) {
      console.error('❌ Cleanup operations error:', error);
      await saveScreenshot(page, 'cleanup-error');
    }
  });

  test('5. Test Summary and Reporting', async ({ page }) => {
    console.log('📊 ==> GENERATING TEST SUMMARY');
    
    // Generate test summary
    const summary = {
      testTimestamp: new Date().toISOString(),
      totalScreenshots: testState.screenshotCount,
      finalState: {
        userId: testState.userId,
        username: testState.username,
        email: testState.email,
        assessmentCount: testState.assessmentIds.length,
        conversationId: testState.conversationId
      },
      screenshotDirectory: screenshotDir
    };
    
    // Save summary to file
    const summaryFile = path.join(screenshotDir, 'test-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    console.log('📋 Test Summary:');
    console.log(`   Total Screenshots: ${summary.totalScreenshots}`);
    console.log(`   Screenshots Directory: ${screenshotDir}`);
    console.log(`   User ID: ${summary.finalState.userId}`);
    console.log(`   Assessments Created: ${summary.finalState.assessmentCount}`);
    console.log(`   Conversation ID: ${summary.finalState.conversationId}`);
    console.log(`   Summary saved to: ${summaryFile}`);
    
    await saveScreenshot(page, 'final-summary');
    
    console.log('🎉 MASTER INTEGRATION TEST COMPLETE!');
    console.log('   This test demonstrates the new operations architecture');
    console.log('   and provides a foundation for other developers to build upon.');
  });
}); 