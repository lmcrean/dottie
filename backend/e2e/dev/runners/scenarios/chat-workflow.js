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
  const message = chat.getTestUserMessage(0); // Use first test message
  
  // Create new conversation by sending initial message with assessment context
  const conversationResult = await chat.createConversation(request, authToken, assessmentId);
  
  expect(conversationResult).toHaveProperty('conversationId');
  expect(conversationResult.conversationId).toBeTruthy();
  expect(conversationResult.assessment_id).toBe(assessmentId);
  
  const conversationId = conversationResult.conversationId;
  console.log('✅ Created conversation with assessment context (DEV)');
  
  // Verify the conversation was properly linked to the assessment
  const linkValidation = await chat.validateAssessmentIdWasLinked(request, authToken, conversationId, assessmentId);
  expect(linkValidation.success).toBe(true);
  console.log('✅ Verified assessment-conversation link (DEV)');
  
  // Get conversation details without strict validation (since we just have initial messages)
  const conversationDetails = await chat.getConversationRaw(request, authToken, conversationId);
  expect(conversationDetails).toHaveProperty('id', conversationId);
  expect(conversationDetails).toHaveProperty('assessment_id', assessmentId);
  expect(conversationDetails).toHaveProperty('messages');
  expect(Array.isArray(conversationDetails.messages)).toBe(true);
  expect(conversationDetails.messages.length).toBeGreaterThan(0);
  console.log('✅ Verified conversation includes assessment data (DEV)');
  
  // Verify correct message ordering: user should ALWAYS message first
  expect(conversationDetails.messages[0].role).toBe("user");
  
  // Validate alternating pattern for initial messages (more flexible than fixed 4-message validation)
  const alternatingPatternValid = chat.validateAlternatingPattern(conversationDetails.messages);
  expect(alternatingPatternValid).toBe(true);
  console.log('✅ Initial message alternating pattern validated (DEV)');
  
  // Send a follow-up message to the same conversation (should maintain assessment context)
  const followUpMessage = chat.getTestUserMessage(1); // Use second test message
  const followUpResult = await chat.sendUserMessageFollowup(request, authToken, conversationId, 1);
  
  expect(followUpResult.success).toBe(true);
  expect(followUpResult.conversationId).toBe(conversationId);
  expect(followUpResult).toHaveProperty('message');
  console.log('✅ Follow-up message sent successfully (DEV)');
  
  // Now we should have 4 messages (2 user + 2 assistant), so we can use full validation
  const updatedConversationResponse = await chat.getConversation(request, authToken, conversationId, 4);
  expect(updatedConversationResponse.success).toBe(true);
  const updatedConversationDetails = updatedConversationResponse.conversation;
  
  const updatedMessageOrderValidation = await chat.validateMessageOrder(request, authToken, conversationId, updatedConversationDetails.messages.length);
  expect(updatedMessageOrderValidation.success).toBe(true);
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