const { getConversationWithMessages } = require('../shared/database/operations');
const { handleChatError } = require('../shared/alerts/errorHandler');

/**
 * Retrieves conversation data for read operations
 * Simplified interface for common read patterns
 */
async function getConversation(chatId, options = {}) {
    try {
        const defaultOptions = {
            includeMetadata: false,
            includeSystemMessages: false,
            limit: null,
            offset: 0,
            sortOrder: 'ASC'
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        const result = await getConversationWithMessages(chatId, mergedOptions);
        
        // Simplify response for read operations
        return {
            success: true,
            chat: {
                id: result.chat.id,
                title: result.chat.title,
                createdAt: result.chat.formattedCreatedAt,
                messageCount: result.chat.messageCount
            },
            messages: result.messages.map(message => ({
                id: message.id,
                content: message.content,
                role: message.role,
                displayName: message.displayName,
                time: message.formattedTime
            })),
            pagination: result.pagination
        };
        
    } catch (error) {
        return handleChatError(error, 'getConversation', { chatId, options });
    }
}

async function getConversationForUser(chatId, userId) {
    try {
        // Add user validation here if needed
        const options = {
            includeMetadata: false,
            includeSystemMessages: false
        };
        
        return await getConversation(chatId, options);
        
    } catch (error) {
        return handleChatError(error, 'getConversationForUser', { chatId, userId });
    }
}

async function getConversationSummary(chatId) {
    try {
        const options = {
            includeMetadata: false,
            includeSystemMessages: false,
            limit: 1
        };
        
        const result = await getConversationWithMessages(chatId, options);
        
        return {
            success: true,
            summary: {
                id: result.chat.id,
                title: result.chat.title,
                messageCount: result.chat.messageCount,
                lastActivity: result.chat.formattedUpdatedAt,
                hasMessages: result.chat.hasMessages
            }
        };
        
    } catch (error) {
        return handleChatError(error, 'getConversationSummary', { chatId });
    }
}

module.exports = {
    getConversation,
    getConversationForUser,
    getConversationSummary
}; 
