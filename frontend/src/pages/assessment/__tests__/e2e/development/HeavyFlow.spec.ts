import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, setupSessionStorage } from './utils/test-utils';

test.describe('Heavy Flow Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Heavy Flow path', async ({ page }) => {
    // Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Select 18-24 years option and continue
    await page.getByText('18-24 years').click();
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Cycle Length - direct navigation
    await page.goto(assessmentPaths.cycleLength);
    await page.waitForLoadState('networkidle');
    
    // Period Duration - direct navigation
    await page.goto(assessmentPaths.periodDuration);
    await page.waitForLoadState('networkidle');
    
    // Select 8+ days
    await page.getByText('8+ days').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-heavy-flow-duration-selected.png') });
    
    // Flow page - direct navigation
    await page.goto(assessmentPaths.flow);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15-heavy-flow-selected.png') });
    
    // Pain page - direct navigation
    await page.goto(assessmentPaths.pain);
    await page.waitForLoadState('networkidle');
    
    // Symptoms page - direct navigation
    await page.goto(assessmentPaths.symptoms);
    await page.waitForLoadState('networkidle');
    
    // Select multiple symptoms
    await page.getByText('Fatigue').click();
    await page.getByText('Bloating').click();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16-heavy-flow-symptoms-selected.png') });
    
    // Results page - using session storage to simulate completion
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '8+ days',
      flowLevel: 'Heavy',
      painLevel: 'Moderate',
      symptoms: ['Fatigue', 'Bloating']
    };
    
    await setupSessionStorage(page, sessionData);
    
    await page.goto(assessmentPaths.results);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17-results-heavy-flow.png') });
  });
}); 