/**
 * Database Validation Utilities for Chat Tests
 * For direct database validation in production tests
 */

import { db } from '../../../../../db/index.js';

/**
 * Directly check the database to verify if a conversation's preview is actually saved
 * @param {string} conversationId - The conversation ID to check
 * @returns {Promise<Object>} - The raw database record
 */
export async function checkConversationPreviewInDatabase(conversationId) {
  try {
    console.log(`[DB-CHECK] Directly querying database for conversation: ${conversationId}`);
    
    // Get the raw database record
    const records = await db('conversations')
      .where('id', conversationId)
      .select('*');
      
    const record = records[0];
    
    if (!record) {
      console.log(`[DB-CHECK] No record found for conversation: ${conversationId}`);
      return { found: false };
    }
    
    console.log(`[DB-CHECK] Found record for conversation: ${conversationId}`);
    console.log(`[DB-CHECK] Preview in database: "${record.preview || 'NULL'}"`);
    console.log(`[DB-CHECK] Assessment ID: ${record.assessment_id}`);
    console.log(`[DB-CHECK] Created at: ${record.created_at}`);
    console.log(`[DB-CHECK] Updated at: ${record.updated_at}`);
    
    return { 
      found: true, 
      record,
      previewIsNull: record.preview === null,
      previewValue: record.preview
    };
  } catch (error) {
    console.error(`[DB-CHECK] Error querying database:`, error);
    return { found: false, error: error.message };
  }
}

/**
 * Check if the latest messages for a conversation are stored properly
 * @param {string} conversationId - The conversation ID to check
 * @returns {Promise<Object>} - The messages query result
 */
export async function checkConversationMessagesInDatabase(conversationId) {
  try {
    console.log(`[DB-CHECK] Querying messages for conversation: ${conversationId}`);
    
    // Get the latest messages
    const messages = await db('chat_messages')
      .where('conversation_id', conversationId)
      .orderBy('created_at', 'desc')
      .limit(5)
      .select('*');
      
    if (!messages || messages.length === 0) {
      console.log(`[DB-CHECK] No messages found for conversation: ${conversationId}`);
      return { found: false };
    }
    
    console.log(`[DB-CHECK] Found ${messages.length} messages for conversation: ${conversationId}`);
    
    // Find the latest assistant message
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    const latestAssistantMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;
    
    if (latestAssistantMessage) {
      console.log(`[DB-CHECK] Latest assistant message content: "${latestAssistantMessage.content.substring(0, 50)}..."`);
    } else {
      console.log(`[DB-CHECK] No assistant messages found`);
    }
    
    return {
      found: true,
      messages,
      assistantMessages,
      latestAssistantMessage
    };
  } catch (error) {
    console.error(`[DB-CHECK] Error querying messages:`, error);
    return { found: false, error: error.message };
  }
} 