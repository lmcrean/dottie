import { test, expect } from '@playwright/test';
import { runSetupTests } from './runners/setup.js';
import { runAuthTests } from './runners/auth.js';
import { runAssessmentTests, testDeleteAssessments } from './runners/assessment.js';

/**
 * Frontend Test Page Master Integration E2E Test
 * 
 * Orchestrates all of the test runners in sequence:
 * 1. Setup Endpoints (health check, database status)
 * 2. Authentication (register, login)
 * 3. Assessment Endpoints (create, list, get, delete)
 * 4. User Endpoints (get info, update profile) - to be implemented
 * 5. Chat Endpoints (send message, get history, delete) - to be implemented
 */

// Configure tests to run in sequence
test.describe.configure({ mode: 'serial' });

// Define types for state objects
interface AuthState {
  userId: string;
  username: string;
  email: string;
  [key: string]: unknown;
}

interface AssessmentState {
  assessmentIds: string[];
  [key: string]: unknown;
}

// Main test state object shared between all tests
const testState = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'Test1234!',
  userId: null as string | null,
  assessmentIds: [] as string[],
  conversationId: null as string | null,
};

test.describe('Test Page Integration', () => {
  
  test('1. Navigate to test page', async ({ page }) => {
    // Add console listener
    page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.type()} - ${msg.text()}`));
    page.on('pageerror', error => console.error(`BROWSER PAGE ERROR: ${error}`));

    // Navigate to the test page
    await page.goto('/test-page');
    
    // Wait for the body element to be present before taking screenshot
    await page.waitForSelector('body', { state: 'attached', timeout: 10000 });
    await page.waitForTimeout(500); // Small extra delay
    
    // Take screenshot
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/01-test-page-loaded.png' });

    
    // Verify page title
    const title = await page.locator('h1').textContent();
    expect(title).toContain('DEVELOPMENT');
  });
  
  // =====================
  // Setup Endpoints Tests
  // =====================
  test('2. Test setup endpoints', async ({ page }) => {
    await runSetupTests(page);
  });
  
  // =====================
  // Authentication Tests
  // =====================
  test('3. Test authentication endpoints', async ({ page }) => {
    // Run auth tests and update shared test state
    const authState = await runAuthTests(page) as AuthState;
    
    // Update global test state with user ID
    testState.userId = authState.userId;
    testState.username = authState.username;
    testState.email = authState.email;
    

  });
  
  // =====================
  // Assessment Tests
  // =====================
  test('4. Test assessment endpoints', async ({ page }) => {
    // Run assessment tests with shared state
    const updatedState = await runAssessmentTests(page, testState) as AssessmentState;
    
    // Update global state with assessment IDs
    testState.assessmentIds = updatedState.assessmentIds;
    

  });
  
  // =====================
  // Cleanup Tests
  // =====================
  test('5. Cleanup created resources', async ({ page }) => {
    // Delete all assessments
    await testDeleteAssessments(page, testState);
    

    
    // Final screenshot
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/99-tests-completed.png' });
  });
}); 