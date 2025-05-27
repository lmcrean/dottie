/**
 * Development Test Scenarios Index
 * 
 * This file exports all available test workflow scenarios for development tests
 * using the granular utility functions for sqlite localhost testing.
 */

// Import dev-specific workflows
import { runChatWorkflow, deleteAndVerifyConversation } from './chat-workflow.js';
import { runAuthWorkflow, runAuthErrorTest } from './auth-workflow.js';
import { runAssessmentCreationWorkflow, runCleanupWorkflow } from './assessment-workflow.js';
import { runUserManagementWorkflow, runUserDeletionWorkflow } from './user-workflow.js';

// Export all scenarios
export {
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
  runChatWorkflow,
  deleteAndVerifyConversation
}; 