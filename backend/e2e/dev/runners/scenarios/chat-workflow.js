/**
 * Chat Workflow Scenarios for Development Tests
 * Uses granular chat utility functions
 * 
 * IMPORTANT: ALL conversations MUST have an assessment_id linked.
 * There is no distinction between conversations with and without assessments.
 */

import * as chat from '../chat/index.js';

/**
 * Run complete chat conversation workflow with assessment context
 * 
 * NOTE: This is the ONLY valid way to create conversations.
 * ALL conversations MUST have an assessment_id linked.
 * 
 * @param {Object} request - Playwright request object
 * @param {Function} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} assessmentId - Assessment ID for context (REQUIRED)
 * @returns {Promise<string>} Conversation ID
 */
export async function runChatWithAssessmentWorkflow(request, expect, authToken, assessmentId) {
  console.log('💬🩺 Starting Chat with Assessment Workflow (DEV)...');
  
  // Generate a test message that references assessment data
  const message = chat.generateAssessmentAwareMessage();
  
  // Create new conversation and send initial message with assessment context
  const result = await chat.createConversationAndSendInitialMessage(request, authToken, message, assessmentId);
  
  expect(result).toHaveProperty('message');
  expect(result).toHaveProperty('conversationId');
  expect(result.conversationId).toBeTruthy();
  expect(result.assessment_id).toBe(assessmentId);
  
  const conversationId = result.conversationId;
  console.log('✅ Created conversation with assessment context (DEV)');
  
  // Verify the conversation was properly linked to the assessment
  const isLinked = await chat.verifyConversationAssessmentLink(request, authToken, conversationId, assessmentId);
  expect(isLinked).toBe(true);
  console.log('✅ Verified assessment-conversation link (DEV)');
  
  // Get conversation details to verify assessment data is included
  const conversationDetails = await chat.getConversation(request, authToken, conversationId);
  expect(conversationDetails).toHaveProperty('id', conversationId);
  expect(conversationDetails).toHaveProperty('assessment_id', assessmentId);
  expect(conversationDetails).toHaveProperty('messages');
  expect(Array.isArray(conversationDetails.messages)).toBe(true);
  expect(conversationDetails.messages.length).toBeGreaterThan(0);
  console.log('✅ Verified conversation includes assessment data (DEV)');
  
  // Verify correct message ordering: user should ALWAYS message first
  expect(conversationDetails.messages[0].role).toBe("user");
  
  // Validate the initial chatbot response
  chat.validateChatbotResponseAfterUserMessage(conversationDetails, expect);
  console.log('✅ Initial chatbot response validated (DEV)');
  
  // Send a follow-up message to the same conversation (should maintain assessment context)
  const followUpMessage = chat.generateAssessmentFollowUpMessage();
  const followUpResult = await chat.sendFollowUpMessage(request, authToken, followUpMessage, conversationId);
  
  expect(followUpResult).toHaveProperty('conversationId', conversationId);
  expect(followUpResult).toHaveProperty('message');
  console.log('✅ Follow-up message sent successfully (DEV)');
  
  // Get updated conversation details and validate the follow-up chatbot response
  const updatedConversationDetails = await chat.getConversation(request, authToken, conversationId);
  chat.validateChatbotResponseAfterUserMessage(updatedConversationDetails, expect);
  console.log('✅ Follow-up chatbot response validated (DEV)');
  
  // Verify conversation history shows the assessment-linked conversation
  const conversations = await chat.getConversationHistory(request, authToken);
  const ourConversation = conversations.find(conv => conv.id === conversationId);
  expect(ourConversation).toBeTruthy();
  expect(ourConversation.assessment_id).toBe(assessmentId);
  console.log('✅ Conversation appears in history with assessment link (DEV)');
  
  console.log('🎉 Chat with Assessment Workflow completed successfully (DEV)!');
  return conversationId;
}

/**
 * Delete conversation and verify it's removed
 * @param {Object} request - Playwright request object
 * @param {Function} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} conversationId - Conversation ID to delete
 */
export async function deleteAndVerifyConversation(request, expect, authToken, conversationId) {
  // Delete the conversation
  const deleteResult = await chat.deleteConversation(request, authToken, conversationId);
  expect(deleteResult).toBe(true);
  
  // Verify conversation is no longer in history
  const conversationsAfterDelete = await chat.getConversationHistory(request, authToken);
  const deletedConversation = conversationsAfterDelete.find(conv => conv.id === conversationId);
  expect(deletedConversation).toBeFalsy();
} 