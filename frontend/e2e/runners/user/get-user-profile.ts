/**
 * Get User Profile Runner
 * Tests getting user profile information
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

interface UserProfileResult {
  success: boolean;
  profile?: Record<string, unknown>;
  error?: string;
}

export async function getUserProfile(page: Page, state: TestState): Promise<UserProfileResult> {
  try {
    console.log('👤 Getting user profile...');

    // Navigate to user profile page
    await page.goto('http://localhost:3005/user/profile');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({
      path: `test_screenshots/user-profile-${Date.now()}.png`,
      fullPage: true
    });

    // Look for profile elements
    const profileContainer = page
      .locator('[data-testid="user-profile"]')
      .or(page.locator('.user-profile'))
      .or(page.locator('h1:has-text("Profile")'));

    const hasProfileContainer = (await profileContainer.count()) > 0;
    console.log(`Profile container found: ${hasProfileContainer}`);

    // Look for user information fields
    const usernameField = page
      .locator('[data-testid="username"]')
      .or(page.locator('input[name="username"]'));

    const emailField = page
      .locator('[data-testid="email"]')
      .or(page.locator('input[name="email"]'));

    const hasUserInfo = (await usernameField.count()) > 0 || (await emailField.count()) > 0;
    console.log(`User information fields found: ${hasUserInfo}`);

    // Extract profile data if available
    let profile = null;
    if (hasUserInfo) {
      try {
        const username = await usernameField.inputValue().catch(() => '');
        const email = await emailField.inputValue().catch(() => '');

        profile = {
          username: username || state.username,
          email: email || state.email
        };
      } catch (error) {
        console.log('Could not extract profile data:', error.message);
      }
    }

    return {
      success: true,
      profile
    };
  } catch (error) {
    console.error('❌ User profile retrieval failed:', error);

    return {
      success: false,
      error: error.message
    };
  }
}
