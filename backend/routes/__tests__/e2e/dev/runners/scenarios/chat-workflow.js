/**
 * Chat Workflow Scenarios for Development Tests
 * Uses granular chat utility functions
 */

import { sendMessage } from '../chat/sendMessage.js';
import { getConversationHistory } from '../chat/getConversationHistory.js';
import { getConversation } from '../chat/getConversation.js';
import { deleteConversation } from '../chat/deleteConversation.js';
import { generateTestMessage } from '../chat/generateTestMessage.js';

/**
 * Run complete chat conversation workflow
 * @param {Object} request - Playwright request object
 * @param {Function} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @returns {Promise<string>} Conversation ID
 */
export async function runChatWorkflow(request, expect, authToken) {
  // Generate a test message
  const message = generateTestMessage();
  
  // Send initial message (creates new conversation)
  const result = await sendMessage(request, authToken, message);
  
  expect(result).toHaveProperty('message');
  expect(result).toHaveProperty('conversationId');
  expect(result.conversationId).toBeTruthy();
  
  const conversationId = result.conversationId;
  
  // Get conversation history to verify the conversation exists
  const conversations = await getConversationHistory(request, authToken);
  expect(Array.isArray(conversations)).toBe(true);
  
  // Find our conversation in the list
  const ourConversation = conversations.find(conv => conv.id === conversationId);
  expect(ourConversation).toBeTruthy();
  
  // Get specific conversation details
  const conversationDetails = await getConversation(request, authToken, conversationId);
  expect(conversationDetails).toHaveProperty('id', conversationId);
  expect(conversationDetails).toHaveProperty('messages');
  expect(Array.isArray(conversationDetails.messages)).toBe(true);
  expect(conversationDetails.messages.length).toBeGreaterThan(0);
  
  // Verify correct message ordering: user should ALWAYS message first
  expect(conversationDetails.messages[0].role).toBe("user");
  
  // Send a follow-up message to the same conversation
  const followUpMessage = "Can you provide more specific advice based on my assessment?";
  const followUpResult = await sendMessage(request, authToken, followUpMessage, conversationId);
  
  expect(followUpResult).toHaveProperty('conversationId', conversationId);
  expect(followUpResult).toHaveProperty('message');
  
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
  const deleteResult = await deleteConversation(request, authToken, conversationId);
  expect(deleteResult).toBe(true);
  
  // Verify conversation is no longer in history
  const conversationsAfterDelete = await getConversationHistory(request, authToken);
  const deletedConversation = conversationsAfterDelete.find(conv => conv.id === conversationId);
  expect(deletedConversation).toBeFalsy();
} 