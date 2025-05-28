/**
 * Development Test Scenarios Index
 * 
 * This file exports all available test workflow scenarios for development tests
 * using the granular utility functions for sqlite localhost testing.
 */

// Import dev-specific workflows
import { runChatWithAssessmentWorkflow, deleteAndVerifyConversation } from './chat-workflow.js';
import { runAuthWorkflow, runAuthErrorTest } from './auth-workflow.js';
import { runAssessmentCreationWorkflow, runCleanupWorkflow } from './assessment-workflow.js';
import { runUserManagementWorkflow, runUserDeletionWorkflow } from './user-workflow.js';
import { runSetupWorkflow, runIndividualSetupTests } from './setup-workflow.js';

// Export all scenarios
export {
  // Setup workflows
  runSetupWorkflow,
  runIndividualSetupTests,
  
  // Auth workflows
  runAuthWorkflow,
  runAuthErrorTest,
  
  // Assessment workflows
  runAssessmentCreationWorkflow,
  runCleanupWorkflow,
  
  // User workflows
  runUserManagementWorkflow,
  runUserDeletionWorkflow,
  
  // Chat workflows
  // Note: ALL conversations require assessment_id - there is only one valid chat workflow
  runChatWithAssessmentWorkflow,
  deleteAndVerifyConversation
}; 