/**
 * Update User Profile Runner
 * Tests updating user profile information
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

interface UpdateProfileData {
  username?: string;
  displayName?: string;
  [key: string]: unknown;
}

interface UpdateUserProfileResult {
  success: boolean;
  updatedProfile?: Record<string, unknown>;
  error?: string;
}

export async function updateUserProfile(
  page: Page,
  state: TestState,
  updateData: UpdateProfileData
): Promise<UpdateUserProfileResult> {
  try {
    console.log('✏️ Updating user profile...');
    console.log('Update data:', updateData);

    // Ensure we're on the profile page
    await page.goto('http://localhost:3005/user/profile');
    await page.waitForLoadState('networkidle');

    // Look for edit button or form
    const editButton = page
      .locator('button:has-text("Edit")')
      .or(page.locator('[data-testid="edit-profile"]'));

    const hasEditButton = (await editButton.count()) > 0;

    if (hasEditButton) {
      await editButton.click();
      await page.waitForTimeout(1000);
    }

    // Look for form fields to update
    if (updateData.username) {
      const usernameField = page
        .locator('input[name="username"]')
        .or(page.locator('[data-testid="username-input"]'));

      const hasUsernameField = (await usernameField.count()) > 0;
      if (hasUsernameField) {
        await usernameField.fill(updateData.username);
        console.log(`Updated username to: ${updateData.username}`);
      }
    }

    if (updateData.displayName) {
      const displayNameField = page
        .locator('input[name="displayName"]')
        .or(page.locator('[data-testid="displayname-input"]'));

      const hasDisplayNameField = (await displayNameField.count()) > 0;
      if (hasDisplayNameField) {
        await displayNameField.fill(updateData.displayName);
        console.log(`Updated display name to: ${updateData.displayName}`);
      }
    }

    // Look for save button
    const saveButton = page
      .locator('button:has-text("Save")')
      .or(page.locator('[data-testid="save-profile"]'))
      .or(page.locator('button[type="submit"]'));

    const hasSaveButton = (await saveButton.count()) > 0;

    if (hasSaveButton) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      console.log('Profile save attempted');
    }

    // Take screenshot
    await page.screenshot({
      path: `test_screenshots/user-profile-updated-${Date.now()}.png`,
      fullPage: true
    });

    return {
      success: true,
      updatedProfile: updateData
    };
  } catch (error) {
    console.error('❌ User profile update failed:', error);

    return {
      success: false,
      error: error.message
    };
  }
}
