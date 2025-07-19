/**
 * Assessment List Runner
 * Tests the assessment list page functionality
 */

import { Page, expect } from '@playwright/test';

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

interface AssessmentListResult {
  success: boolean;
  assessmentCount: number;
  error?: string;
}

export async function getAssessmentList(page: Page, state: TestState): Promise<AssessmentListResult> {
  try {
    console.log('📋 Navigating to assessment list page...');
    
    // Navigate to assessment list page
    await page.goto('http://localhost:3005/assessment/list');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ 
      path: `test_screenshots/assessment-list-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Check if we're on the assessment list page
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
    
    // Look for assessment list elements
    const assessmentListContainer = page.locator('[data-testid="assessment-list"]').or(
      page.locator('.assessment-list')
    ).or(
      page.locator('h1:has-text("Assessment")')
    );
    
    // Wait for the assessment list to be visible
    try {
      await assessmentListContainer.waitFor({ timeout: 10000 });
      console.log('✅ Assessment list container found');
    } catch (error) {
      console.log('⚠️ Assessment list container not found, checking URL...');
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      // Check if we're redirected to login (authentication issue)
      if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
        throw new Error('Authentication required - redirected to login page');
      }
    }
    
    // Count assessments on the page
    const assessmentItems = page.locator('[data-testid="assessment-item"]').or(
      page.locator('.assessment-item')
    ).or(
      page.locator('[data-testid*="assessment"]')
    );
    
    const assessmentCount = await assessmentItems.count();
    console.log(`Found ${assessmentCount} assessments on the page`);
    
    // Check for "No assessments" message if count is 0
    if (assessmentCount === 0) {
      const noAssessmentsMessage = page.locator('text=No assessments').or(
        page.locator('text=No data')
      ).or(
        page.locator('text=Empty')
      );
      
      const hasNoAssessmentsMessage = await noAssessmentsMessage.count() > 0;
      if (hasNoAssessmentsMessage) {
        console.log('ℹ️ No assessments found - empty state displayed');
      }
    }
    
    // Verify page elements
    const hasCreateButton = await page.locator('button:has-text("Create")').or(
      page.locator('button:has-text("New")').or(
        page.locator('[data-testid="create-assessment"]')
      )
    ).count() > 0;
    
    console.log(`Create button present: ${hasCreateButton}`);
    
    return {
      success: true,
      assessmentCount
    };
    
  } catch (error) {
    console.error('❌ Assessment list retrieval failed:', error);
    
    // Take error screenshot
    await page.screenshot({ 
      path: `test_screenshots/assessment-list-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    return {
      success: false,
      assessmentCount: 0,
      error: error.message
    };
  }
} 