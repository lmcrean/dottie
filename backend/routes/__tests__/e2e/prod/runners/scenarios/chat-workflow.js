/**
 * Chat Workflow Scenario
 * 
 * Handles complete chat conversation lifecycle.
 */

import * as chat from '../chat/index.js';

/**
 * Complete chat workflow with conversation management
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @returns {Promise<string>} Conversation ID for cleanup
 */
export async function runChatWorkflow(request, expect, authToken) {
  // Send initial message to start new conversation
  const initialMessage = chat.generateTestMessage();
  const initialResult = await chat.sendMessage(request, authToken, initialMessage);
  expect(initialResult.message).toBeTruthy();
  expect(initialResult.conversationId).toBeTruthy();
  
  const conversationId = initialResult.conversationId;

  // Verify conversation appears in history
  let conversations = await chat.getConversationHistory(request, authToken);
  expect(conversations.length).toBeGreaterThanOrEqual(1);
  expect(conversations.some(c => c.id === conversationId)).toBeTruthy();

  // Get specific conversation and verify structure
  let conversation = await chat.getConversation(request, authToken, conversationId);
  expect(conversation.id).toBe(conversationId);
  expect(conversation.messages.length).toBeGreaterThanOrEqual(2);
  expect(conversation.messages[0].role).toBe("user");

  // Send follow-up message to existing conversation
  const followUpMessage = "Tell me more about managing menstrual symptoms";
  const followUpResult = await chat.sendMessage(
    request, 
    authToken, 
    followUpMessage, 
    conversationId
  );
  expect(followUpResult.conversationId).toBe(conversationId);

  // Verify conversation now has more messages
  const updatedConversation = await chat.getConversation(request, authToken, conversationId);
  expect(updatedConversation.messages.length).toBeGreaterThanOrEqual(4);

  return conversationId;
}

/**
 * Delete conversation and verify deletion
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} conversationId - Conversation ID to delete
 */
export async function deleteAndVerifyConversation(request, expect, authToken, conversationId) {
  // Delete the conversation
  const deleted = await chat.deleteConversation(request, authToken, conversationId);
  expect(deleted).toBeTruthy();

  // Verify conversation was deleted (should fail to fetch)
  try {
    await chat.getConversation(request, authToken, conversationId);
    expect(false).toBeTruthy("Conversation should have been deleted");
  } catch (error) {
    expect(error.message).toContain("Failed to get conversation: 404");
  }

  // Verify conversation no longer in history
  const conversations = await chat.getConversationHistory(request, authToken);
  expect(conversations.some(c => c.id === conversationId)).toBeFalsy();
} 