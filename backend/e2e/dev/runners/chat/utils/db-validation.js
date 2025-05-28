/**
 * Database Validation Utilities for Chat Tests
 * For direct database validation in production tests
 */

import { db } from '../../../../../db/index.js';

/**
 * Directly check the database to verify if a conversation's preview is actually saved
 * This only works for local testing, as we can't directly access the production database
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
      
      // For remote testing, we need to explain why this is happening
      const isProdTest = process.env.NODE_ENV === 'production' || process.env.TEST_ENV === 'prod';
      if (isProdTest) {
        console.log(`[DB-CHECK] NOTE: This is expected in production tests. We're testing against a remote API but using a local database.`);
        console.log(`[DB-CHECK] The API returned a preview, but our local DB query can't access the remote production database.`);
        console.log(`[DB-CHECK] This suggests the preview is being generated dynamically by getConversationsWithPreviews.js.`);
      }
      
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
 * This only works for local testing, as we can't directly access the production database
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
      
      // For remote testing, we need to explain why this is happening
      const isProdTest = process.env.NODE_ENV === 'production' || process.env.TEST_ENV === 'prod';
      if (isProdTest) {
        console.log(`[DB-CHECK] NOTE: This is expected in production tests. We're testing against a remote API but using a local database.`);
      }
      
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

/**
 * Explain the false pass situation - this function doesn't query the database
 * It just logs the explanation of what's happening
 */
export function explainFalsePassInProduction() {
  console.log(`\n====== FALSE PASS EXPLANATION ======`);
  console.log(`⚠️ FALSE PASS LIKELY DETECTED IN PRODUCTION`);
  console.log(`The preview field in the database is NULL (as seen in the screenshot),`);
  console.log(`but the API is returning preview text for conversations.`);
  console.log(`This indicates that getConversationsWithPreviews.js is generating`);
  console.log(`the preview dynamically from the assistant message when the API is called.`);
  console.log(`This is why the tests pass even though the database updates are failing.`);
  console.log(`=======================================\n`);
} 