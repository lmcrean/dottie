/**
 * Create Assessment Runner
 * Tests creating a new assessment by going through the complete assessment flow
 */

import type { Page } from '@playwright/test';

interface TestState {
  userId: string | null;
  username: string;
  email: string;
  password: string;
  authToken: string | null;
  assessmentIds: string[];
  conversationId: string | null;
  screenshotCount: number;
}

interface CreateAssessmentResult {
  success: boolean;
  assessmentId?: string;
  error?: string;
}

export async function createAssessment(
  page: Page,
  state: TestState
): Promise<CreateAssessmentResult> {
  try {
    console.log('➕ Starting assessment creation...');

    // Check if we're already on the age verification page (which we should be after sign-in)
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // If not on age verification, navigate there
    if (!currentUrl.includes('/assessment/age-verification')) {
      console.log('📍 Navigating to age verification page...');
      await page.goto('http://localhost:3005/assessment/age-verification');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    } else {
      console.log('✅ Already on age verification page');
    }

    // Check if we're redirected to login (shouldn't happen if authenticated)
    if (page.url().includes('/auth/sign-in')) {
      throw new Error('Redirected to login page - authentication may have failed');
    }

    // Take screenshot of assessment start
    await page.screenshot({
      path: `test_screenshots/assessment-flow-start-${Date.now()}.png`,
      fullPage: true
    });

    // Import the assessment step runners
    const { runAgeVerificationStep } = await import('./1-ageVerification');
    const { runCycleLengthStep } = await import('./2-cycleLength');
    const { runPeriodDurationStep } = await import('./3-periodDuration');
    const { runFlowStep } = await import('./4-flow');
    const { runPainStep } = await import('./5-pain');
    const { runSymptomsStep } = await import('./6-symptoms');
    // Note: checkResultsPage import available but not used in this test flow
    // const { checkResultsPage } = await import('./7-results');

    // Execute assessment steps sequentially
    console.log('📝 Step 1: Age Verification...');
    await runAgeVerificationStep(page);

    console.log('📝 Step 2: Cycle Length...');
    await runCycleLengthStep(page);

    console.log('📝 Step 3: Period Duration...');
    await runPeriodDurationStep(page);

    console.log('📝 Step 4: Flow Assessment...');
    await runFlowStep(page);

    console.log('📝 Step 5: Pain Assessment...');
    await runPainStep(page);

    console.log('📝 Step 6: Symptoms Assessment...');
    await runSymptomsStep(page);

    // Results page verification is already done in runSymptomsStep
    console.log('✅ Assessment complete - results page loaded');

    // Wait for assessment to be fully processed
    console.log('⏳ Waiting for assessment creation to complete...');
    await page.waitForTimeout(2000);

    // Try to extract assessment ID from URL or generate one for tracking
    const finalUrl = page.url();
    console.log(`Current URL after assessment completion: ${finalUrl}`);

    let assessmentId = null;

    // Try to extract ID from URL patterns like /assessment/results/123 or similar
    const urlMatch = finalUrl.match(/\/assessment\/(?:results|detail)\/(\w+)/);
    if (urlMatch) {
      assessmentId = urlMatch[1];
      console.log(`Extracted assessment ID from URL: ${assessmentId}`);
    } else {
      // Generate a tracking ID based on timestamp
      assessmentId = `assessment_${Date.now()}`;
      console.log(`Generated tracking assessment ID: ${assessmentId}`);
    }

    // Add to state for cleanup later
    if (assessmentId && !state.assessmentIds.includes(assessmentId)) {
      state.assessmentIds.push(assessmentId);
    }

    // Take screenshot of completion
    await page.screenshot({
      path: `test_screenshots/assessment-flow-complete-${Date.now()}.png`,
      fullPage: true
    });

    console.log('✅ Assessment flow completed successfully');

    return {
      success: true,
      assessmentId
    };
  } catch (error) {
    console.error('❌ Assessment creation failed:', error);

    // Take error screenshot
    await page.screenshot({
      path: `test_screenshots/assessment-flow-error-${Date.now()}.png`,
      fullPage: true
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
