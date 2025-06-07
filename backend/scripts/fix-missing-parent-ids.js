#!/usr/bin/env node

/**
 * Utility script to fix missing parent_message_id values in existing chat messages
 * 
 * Usage: node backend/scripts/fix-missing-parent-ids.js
 */

import logger from '../services/logger.js';
import DbService from '../services/dbService.js';
import { updateMessageWithParentId } from '../models/chat/message/1-user-message/add-message/database/linkParentMessageId.js';

// Configure logging
logger.level = 'info';

/**
 * Find all messages with missing parent_message_id (except first messages in conversations)
 */
async function findMessagesWithMissingParentIds() {
  try {
    // Get all conversations
    const conversations = await DbService.findAll('conversations');
    logger.info(`Found ${conversations.length} conversations to check`);
    
    let messagesFixed = 0;
    
    // Process each conversation
    for (const conversation of conversations) {
      const conversationId = conversation.id;
      
      // Get all messages in this conversation, sorted by created_at
      const messages = await DbService.findWhere(
        'chat_messages', 
        { conversation_id: conversationId },
        { orderBy: 'created_at', order: 'asc' }
      );
      
      if (messages.length === 0) {
        logger.info(`Conversation ${conversationId} has no messages, skipping`);
        continue;
      }
      
      // First message in conversation should have null parent_message_id
      const firstMessage = messages[0];
      if (firstMessage.parent_message_id !== null) {
        logger.info(`Fixing first message ${firstMessage.id} in conversation ${conversationId} - should have null parent_message_id`);
        await DbService.update('chat_messages', firstMessage.id, { parent_message_id: null });
        messagesFixed++;
      }
      
      // All subsequent messages should have a parent_message_id
      for (let i = 1; i < messages.length; i++) {
        const message = messages[i];
        
        if (!message.parent_message_id) {
          logger.info(`Message ${message.id} in conversation ${conversationId} is missing parent_message_id, fixing...`);
          await updateMessageWithParentId(conversationId, message.id);
          messagesFixed++;
        }
      }
    }
    
    logger.info(`Fix operation completed. Fixed ${messagesFixed} messages.`);
    return messagesFixed;
    
  } catch (error) {
    logger.error('Error fixing missing parent message IDs:', error);
    throw error;
  }
}

// Execute the fix operation
(async () => {
  try {
    logger.info('Starting to fix missing parent_message_id values in chat messages...');
    const messagesFixed = await findMessagesWithMissingParentIds();
    logger.info(`Operation completed successfully. Fixed ${messagesFixed} messages.`);
    process.exit(0);
  } catch (error) {
    logger.error('Error running fix script:', error);
    process.exit(1);
  }
})(); 