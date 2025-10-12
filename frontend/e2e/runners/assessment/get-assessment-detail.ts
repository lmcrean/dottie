/**
 * Assessment Detail Runner
 * Tests viewing assessment detail page
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

interface AssessmentDetailResult {
  success: boolean;
  hasResults: boolean;
  error?: string;
}

export async function getAssessmentDetail(
  page: Page,
  state: TestState,
  assessmentId?: string
): Promise<AssessmentDetailResult> {
  try {
    console.log('👀 Starting assessment detail view...');

    // Try different URL patterns for assessment detail
    let targetUrl = 'http://localhost:3005/assessment/detail';

    if (assessmentId && assessmentId !== `assessment_${Date.now()}`) {
      // If we have a real assessment ID, use it
      targetUrl = `http://localhost:3005/assessment/detail/${assessmentId}`;
    }

    console.log(`Navigating to: ${targetUrl}`);

    // Navigate to assessment detail page
    await page.goto(targetUrl);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({
      path: `test_screenshots/assessment-detail-${Date.now()}.png`,
      fullPage: true
    });

    // Check if we're on the assessment detail page
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);

    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Look for assessment detail elements
    const detailContainer = page
      .locator('[data-testid="assessment-detail"]')
      .or(page.locator('.assessment-detail'))
      .or(page.locator('h1:has-text("Assessment")'))
      .or(page.locator('h1:has-text("Results")'));

    // Wait for the detail container to be visible
    try {
      await detailContainer.waitFor({ timeout: 10000 });
      console.log('✅ Assessment detail container found');
    } catch {
      console.log('⚠️ Assessment detail container not found, checking for other indicators...');
    }

    // Check for results rendering (this is the bug mentioned in the problem statement)
    console.log('🔍 Checking for assessment results rendering...');

    const resultsContainer = page
      .locator('[data-testid="assessment-results"]')
      .or(page.locator('.assessment-results'))
      .or(page.locator('.results-summary'))
      .or(page.locator('[data-testid="results"]'));

    const hasResults = (await resultsContainer.count()) > 0;
    console.log(`Assessment results container found: ${hasResults}`);

    if (!hasResults) {
      console.log('🐛 BUG DETECTED: No assessment results rendering on results detail page');

      // Look for error messages or empty states
      const errorMessage = page
        .locator('text=Error')
        .or(page.locator('text=Failed'))
        .or(page.locator('text=No data'));

      const hasErrorMessage = (await errorMessage.count()) > 0;
      if (hasErrorMessage) {
        const errorText = await errorMessage.first().textContent();
        console.log(`Error message found: ${errorText}`);
      }

      // Check for loading states that might be stuck
      const loadingIndicator = page
        .locator('text=Loading')
        .or(page.locator('.spinner'))
        .or(page.locator('[data-testid="loading"]'));

      const isLoading = (await loadingIndicator.count()) > 0;
      if (isLoading) {
        console.log('⏳ Page appears to be stuck in loading state');
      }
    }

    // Check for assessment data elements
    const dataElements = [
      page.locator('text=Age'),
      page.locator('text=Cycle'),
      page.locator('text=Period'),
      page.locator('text=Flow'),
      page.locator('text=Pain'),
      page.locator('text=Symptoms')
    ];

    let foundDataElements = 0;
    for (const element of dataElements) {
      const count = await element.count();
      if (count > 0) {
        foundDataElements++;
      }
    }

    console.log(`Found ${foundDataElements} out of ${dataElements.length} expected data elements`);

    // Take final screenshot
    await page.screenshot({
      path: `test_screenshots/assessment-detail-final-${Date.now()}.png`,
      fullPage: true
    });

    return {
      success: true,
      hasResults
    };
  } catch (error) {
    console.error('❌ Assessment detail view failed:', error);

    // Take error screenshot
    await page.screenshot({
      path: `test_screenshots/assessment-detail-error-${Date.now()}.png`,
      fullPage: true
    });

    return {
      success: false,
      hasResults: false,
      error: error.message
    };
  }
}
