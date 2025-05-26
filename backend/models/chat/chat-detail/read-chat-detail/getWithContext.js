import logger from '../../../../services/logger.js';
import DbService from '../../../../services/dbService.js';
import { getConversationHistory, getConversationSummary } from './getConversation.js';
import { detectService } from '../chatbot-message/services/serviceDetector.js';
import { getAssessmentPattern } from '../shared/assessment/assessmentHelper.js';

/**
 * Get conversation with enhanced context and metadata
 * @param {string} conversationId - Conversation ID
 * @param {string} [userId] - User ID for ownership verification
 * @param {Object} [options] - Context options
 * @param {boolean} [options.includeServiceInfo=true] - Include service detection info
 * @param {boolean} [options.includeAssessmentInfo=true] - Include assessment details
 * @param {boolean} [options.includeStats=true] - Include conversation statistics
 * @returns {Promise<Object>} - Enhanced conversation data
 */
export const getConversationWithContext = async (conversationId, userId = null, options = {}) => {
  const { 
    includeServiceInfo = true, 
    includeAssessmentInfo = true, 
    includeStats = true 
  } = options;

  try {
    // Get base conversation data
    const conversation = await getConversationHistory(conversationId, userId);

    // Build enhanced context
    const enhancedConversation = { ...conversation };

    // Add service information
    if (includeServiceInfo) {
      const serviceType = await detectService();
      enhancedConversation.serviceInfo = {
        currentService: serviceType,
        isAiAvailable: serviceType === 'ai',
        isMockMode: serviceType === 'mock'
      };
    }

    // Add assessment information
    if (includeAssessmentInfo && conversation.assessment_id) {
      try {
        const assessmentPattern = await getAssessmentPattern(conversation.assessment_id);
        enhancedConversation.assessmentInfo = {
          hasAssessment: true,
          assessmentId: conversation.assessment_id,
          assessmentPattern: assessmentPattern || conversation.assessment_pattern,
          isAssessmentValid: !!assessmentPattern
        };
      } catch (error) {
        logger.warn('Error getting assessment info:', error);
        enhancedConversation.assessmentInfo = {
          hasAssessment: false,
          assessmentId: conversation.assessment_id,
          assessmentPattern: conversation.assessment_pattern,
          isAssessmentValid: false
        };
      }
    } else {
      enhancedConversation.assessmentInfo = {
        hasAssessment: false,
        assessmentId: null,
        assessmentPattern: null,
        isAssessmentValid: false
      };
    }

    // Add conversation statistics
    if (includeStats) {
      const summary = await getConversationSummary(conversationId);
      enhancedConversation.statistics = summary.statistics;
    }

    // Add metadata
    enhancedConversation.metadata = {
      retrievedAt: new Date().toISOString(),
      canContinue: true,
      hasMessages: conversation.messages.length > 0,
      lastActivity: conversation.updated_at,
      contextEnhanced: true
    };

    logger.info(`Retrieved enhanced conversation ${conversationId} with context`);
    return enhancedConversation;

  } catch (error) {
    logger.error('Error getting conversation with context:', error);
    throw error;
  }
};

/**
 * Get conversation for display (frontend-ready format)
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Display-ready conversation data
 */
export const getConversationForDisplay = async (conversationId, userId) => {
  try {
    const conversation = await getConversationWithContext(conversationId, userId, {
      includeServiceInfo: true,
      includeAssessmentInfo: true,
      includeStats: true
    });

    // Format for frontend display
    return {
      conversation: {
        id: conversation.id,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at,
        assessment: conversation.assessmentInfo.hasAssessment ? {
          id: conversation.assessmentInfo.assessmentId,
          pattern: conversation.assessmentInfo.assessmentPattern
        } : null
      },
      messages: conversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at,
        edited: !!msg.edited_at
      })),
      metadata: {
        messageCount: conversation.message_count,
        serviceType: conversation.serviceInfo.currentService,
        canRespond: conversation.serviceInfo.isAiAvailable || conversation.serviceInfo.isMockMode,
        statistics: conversation.statistics
      }
    };

  } catch (error) {
    logger.error('Error getting conversation for display:', error);
    throw error;
  }
};

/**
 * Get conversation context for AI processing
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - AI-ready conversation context
 */
export const getConversationContextForAI = async (conversationId) => {
  try {
    const conversation = await getConversationWithContext(conversationId, null, {
      includeServiceInfo: false,
      includeAssessmentInfo: true,
      includeStats: false
    });

    // Format for AI processing
    return {
      conversationId: conversation.id,
      assessmentPattern: conversation.assessmentInfo.assessmentPattern,
      messages: conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at
      })),
      context: {
        hasAssessment: conversation.assessmentInfo.hasAssessment,
        messageCount: conversation.message_count,
        lastActivity: conversation.updated_at
      }
    };

  } catch (error) {
    logger.error('Error getting conversation context for AI:', error);
    throw error;
  }
};

/**
 * Get lightweight conversation preview
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Conversation preview
 */
export const getConversationPreview = async (conversationId, userId) => {
  try {
    const summary = await getConversationSummary(conversationId);
    
    // Verify ownership
    if (summary.user_id !== userId) {
      throw new Error('User does not own this conversation');
    }

    // Get last message for preview
    const lastMessage = await DbService.query(`
      SELECT content, role, created_at 
      FROM chat_messages 
      WHERE conversation_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [conversationId]);

    const preview = lastMessage[0]?.content || 'No messages yet';
    
    return {
      id: summary.id,
      preview: preview.length > 100 ? preview.substring(0, 100) + '...' : preview,
      messageCount: summary.statistics.total_messages,
      lastActivity: summary.statistics.last_message_at || summary.created_at,
      hasAssessment: !!summary.assessment_id,
      assessmentPattern: summary.assessment_pattern
    };

  } catch (error) {
    logger.error('Error getting conversation preview:', error);
    throw error;
  }
}; 