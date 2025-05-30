import DbService from '../../../../services/dbService.js';
import logger from '../../../../services/logger.js';

/**
 * Retrieves conversation data for read operations
 * Simplified interface for common read patterns
 */
async function getConversation(conversationId, options = {}) {
    try {
        const defaultOptions = {
            includeMessages: true,
            limit: null,
            offset: 0
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        // Get the conversation by ID
        const conversation = await DbService.findByIdWithJson('conversations', conversationId, ['assessment_object']);
        
        if (!conversation) {
            return {
                success: false,
                error: 'Conversation not found',
                conversationId
            };
        }
        
        let messages = [];
        let messageCount = 0;
        
        if (mergedOptions.includeMessages) {
            // Get messages for the conversation
            const allMessages = await DbService.findByFieldWithJson(
                'chat_messages', 
                'conversation_id', 
                conversationId, 
                [], // content is plain text, not JSON
                [ // Order by creation time, then by ID as a tie-breaker, should always be 1. user message, 2. assistant message, 3. user message, etc.
                  { field: 'created_at', direction: 'ASC' },
                  { field: 'id', direction: 'ASC' }
                ]
            );
            
            messageCount = allMessages.length;
            
            // Apply pagination if specified
            if (mergedOptions.limit || mergedOptions.offset) {
                const startIndex = mergedOptions.offset || 0;
                const endIndex = mergedOptions.limit ? startIndex + mergedOptions.limit : undefined;
                messages = allMessages.slice(startIndex, endIndex);
            } else {
                messages = allMessages;
            }
        }
        
        return {
            success: true,
            conversation: {
                id: conversation.id,
                user_id: conversation.user_id,
                assessment_id: conversation.assessment_id,
                assessment_object: conversation.assessment_object,
                assessment_pattern: conversation.assessment_pattern,
                title: conversation.title || 'Assessment Conversation',
                created_at: conversation.created_at,
                updated_at: conversation.updated_at,
                messageCount
            },
            messages: messages.map(message => ({
                id: message.id,
                content: message.content,
                role: message.role,
                created_at: message.created_at
            })),
            pagination: {
                total: messageCount,
                offset: mergedOptions.offset || 0,
                limit: mergedOptions.limit,
                hasMore: mergedOptions.limit ? (mergedOptions.offset + mergedOptions.limit) < messageCount : false
            }
        };
        
    } catch (error) {
        logger.error('Error in getConversation:', error);
        return {
            success: false,
            error: error.message,
            conversationId
        };
    }
}

async function getConversationForUser(conversationId, userId) {
    try {
        const result = await getConversation(conversationId);
        
        if (!result.success) {
            return result;
        }
        
        // Verify the conversation belongs to the user
        if (result.conversation.user_id !== userId) {
            return {
                success: false,
                error: 'Conversation not found or access denied',
                conversationId
            };
        }
        
        return result;
        
    } catch (error) {
        logger.error('Error in getConversationForUser:', error);
        return {
            success: false,
            error: error.message,
            conversationId,
            userId
        };
    }
}

async function getConversationSummary(conversationId) {
    try {
        const conversation = await DbService.findByIdWithJson('conversations', conversationId, ['assessment_object']);
        
        if (!conversation) {
            return {
                success: false,
                error: 'Conversation not found',
                conversationId
            };
        }
        
        // Get message count
        const messages = await DbService.findByFieldWithJson('chat_messages', 'conversation_id', conversationId);
        const messageCount = messages.length;
        
        return {
            success: true,
            summary: {
                id: conversation.id,
                user_id: conversation.user_id,
                assessment_id: conversation.assessment_id,
                title: conversation.title || 'Assessment Conversation',
                messageCount,
                hasMessages: messageCount > 0,
                created_at: conversation.created_at,
                updated_at: conversation.updated_at
            }
        };
        
    } catch (error) {
        logger.error('Error in getConversationSummary:', error);
        return {
            success: false,
            error: error.message,
            conversationId
        };
    }
}

export {
    getConversation,
    getConversationForUser,
    getConversationSummary
}; 