/**
 * Assessment Operations Controller
 *
 * This controller orchestrates all assessment-related test operations
 * It delegates to specific assessment runners for different actions
 */

import type { Page } from '@playwright/test';

// Import specific assessment runners
import { createAssessment } from '../assessment/create-assessment';
import { getAssessmentDetail } from '../assessment/get-assessment-detail';
import { deleteAssessment } from '../assessment/delete-assessment';

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

interface AssessmentOperationResult {
  success: boolean;
  assessmentIds: string[];
  error?: string;
}

export class AssessmentOperations {
  private page: Page;
  private state: TestState;

  constructor(page: Page, state: TestState) {
    this.page = page;
    this.state = state;
  }

  /**
   * Run the complete assessment operation flow
   * 1. Create new assessment (user is already on age verification after sign-in)
   * 2. View assessment detail
   * 3. Cleanup (delete assessment)
   */
  async runCompleteFlow(): Promise<AssessmentOperationResult> {
    try {
      console.log('🔄 Starting Assessment Operations Flow...');

      // Skip Step 1 (assessment list) since user is already positioned on age verification
      // after sign-in. Going to the list page would lose authentication context.

      // Step 1: Create new assessment (user should already be on age verification)
      console.log('➕ Step 1: Creating new assessment...');
      const createResult = await createAssessment(this.page, this.state);
      if (!createResult.success) {
        throw new Error(`Assessment creation failed: ${createResult.error}`);
      }

      // Update state with new assessment ID
      if (createResult.assessmentId) {
        this.state.assessmentIds.push(createResult.assessmentId);
      }
      console.log('✅ Assessment created successfully');

      // Step 2: View assessment detail
      console.log('👀 Step 2: Viewing assessment detail...');
      const detailResult = await getAssessmentDetail(
        this.page,
        this.state,
        createResult.assessmentId
      );
      if (!detailResult.success) {
        console.warn(`⚠️ Assessment detail view failed: ${detailResult.error}`);
        // Don't fail the entire flow for detail view issues
      } else {
        console.log('✅ Assessment detail viewed successfully');
      }

      console.log('🎉 Assessment Operations Flow completed successfully!');

      return {
        success: true,
        assessmentIds: this.state.assessmentIds
      };
    } catch (error) {
      console.error('❌ Assessment Operations Flow failed:', error);

      return {
        success: false,
        assessmentIds: this.state.assessmentIds,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Cleanup assessment resources
   */
  async cleanup(): Promise<void> {
    console.log('🗑️ Cleaning up assessment resources...');

    for (const assessmentId of this.state.assessmentIds) {
      try {
        await deleteAssessment(this.page, this.state, assessmentId);
        console.log(`✅ Deleted assessment: ${assessmentId}`);
      } catch (error) {
        console.error(`❌ Failed to delete assessment ${assessmentId}:`, error);
      }
    }

    // Clear assessment IDs from state
    this.state.assessmentIds = [];
  }
}
