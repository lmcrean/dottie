/**
 * User Operations Controller
 *
 * This controller orchestrates all user-related test operations
 * It delegates to specific user runners for different actions
 */

import type { Page } from '@playwright/test';

// Import specific user runners (these will be created)
import { getUserProfile } from '../user/get-user-profile';
import { updateUserProfile } from '../user/update-user-profile';

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

interface UserOperationResult {
  success: boolean;
  updatedProfile?: Record<string, unknown>;
  error?: string;
}

export class UserOperations {
  private page: Page;
  private state: TestState;

  constructor(page: Page, state: TestState) {
    this.page = page;
    this.state = state;
  }

  /**
   * Run the complete user operation flow
   * 1. Get user profile
   * 2. Update user profile
   * 3. Verify profile changes
   */
  async runCompleteFlow(): Promise<UserOperationResult> {
    try {
      console.log('👤 Starting User Operations Flow...');

      // Step 1: Get user profile
      console.log('📋 Step 1: Getting user profile...');
      const profileResult = await getUserProfile(this.page, this.state);
      if (!profileResult.success) {
        throw new Error(`User profile retrieval failed: ${profileResult.error}`);
      }
      console.log('✅ User profile retrieved successfully');

      // Step 2: Update user profile
      console.log('✏️ Step 2: Updating user profile...');
      const updateData = {
        username: `${this.state.username}_updated`,
        displayName: 'Test User Updated'
      };

      const updateResult = await updateUserProfile(this.page, this.state, updateData);
      if (!updateResult.success) {
        throw new Error(`User profile update failed: ${updateResult.error}`);
      }

      // Update state with new profile info
      if (updateResult.updatedProfile) {
        this.state.username = updateResult.updatedProfile.username || this.state.username;
      }
      console.log('✅ User profile updated successfully');

      console.log('🎉 User Operations Flow completed successfully!');

      return {
        success: true,
        updatedProfile: updateResult.updatedProfile
      };
    } catch (error) {
      console.error('❌ User Operations Flow failed:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cleanup user resources (if needed)
   */
  async cleanup(): Promise<void> {
    console.log('🗑️ User cleanup - no resources to clean');
    // User cleanup typically not needed as user accounts are reused
  }
}
