import logger from '../../../../../services/logger.js';
import { withServiceCall } from '../../shared/utils/errorHandler.js';

/**
 * Base class for response generators (AI and Mock)
 * Provides common functionality and patterns
 */
export class BaseGenerator {
  
  /**
   * Generate initial response (to be overridden by subclasses)
   * @param {string} messageText - User's initial message
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Promise<Object>} - Generated response
   */
  static async generateInitialResponse(messageText, assessmentPattern = null) {
    throw new Error('generateInitialResponse must be implemented by subclass');
  }

  /**
   * Generate follow-up response (to be overridden by subclasses)
   * @param {string} messageText - User's follow-up message
   * @param {Array} conversationHistory - Previous messages
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Promise<Object>} - Generated response
   */
  static async generateFollowUpResponse(messageText, conversationHistory = [], assessmentPattern = null) {
    throw new Error('generateFollowUpResponse must be implemented by subclass');
  }

  /**
   * Generate response with fallback handling
   * @param {Function} primaryGenerator - Primary response generation function
   * @param {Function} fallbackGenerator - Fallback generation function
   * @param {string} context - Context for logging
   * @param {...any} args - Arguments to pass to generators
   * @returns {Promise<Object>} - Generated response
   */
  static async generateWithFallback(primaryGenerator, fallbackGenerator, context, ...args) {
    return withServiceCall(
      () => primaryGenerator.apply(this, args),
      this.getServiceName(),
      context,
      fallbackGenerator ? () => fallbackGenerator.apply(this, args) : null
    );
  }

  /**
   * Get service name (to be overridden by subclasses)
   * @returns {string} - Service name
   */
  static getServiceName() {
    return 'Unknown';
  }

  /**
   * Build standardized response metadata
   * @param {Object} specificMetadata - Service-specific metadata
   * @param {boolean} isInitial - Whether this is an initial response
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Object} - Standardized metadata
   */
  static buildResponseMetadata(specificMetadata, isInitial = false, assessmentPattern = null) {
    return {
      ...specificMetadata,
      service: this.getServiceName().toLowerCase(),
      is_initial: isInitial,
      is_follow_up: !isInitial,
      assessment_pattern: assessmentPattern,
      generated_at: new Date().toISOString(),
      context_aware: !isInitial
    };
  }

  /**
   * Validate message text input
   * @param {string} messageText - Message text to validate
   * @returns {Object} - Validation result
   */
  static validateMessageInput(messageText) {
    if (!messageText || typeof messageText !== 'string') {
      return {
        isValid: false,
        error: 'Message text must be a non-empty string'
      };
    }

    if (messageText.trim().length === 0) {
      return {
        isValid: false,
        error: 'Message text cannot be empty'
      };
    }

    return { isValid: true };
  }

  /**
   * Build assessment-aware system prompt
   * @param {string} basePrompt - Base system prompt
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {string} - Enhanced system prompt
   */
  static buildAssessmentAwarePrompt(basePrompt, assessmentPattern = null) {
    if (!assessmentPattern) {
      return basePrompt;
    }

    return `${basePrompt}\n\nThe user has completed a ${assessmentPattern} assessment and may want to discuss their results. Help them understand their results and explore what they mean for their personal and professional development.`;
  }

  /**
   * Format conversation history for processing
   * @param {Array} conversationHistory - Raw conversation history
   * @param {Object} [options] - Formatting options
   * @returns {Array} - Formatted conversation history
   */
  static formatConversationHistory(conversationHistory, options = {}) {
    const { maxHistory = 20, includeSystemMessage = false } = options;

    let messages = conversationHistory
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-maxHistory);

    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.created_at
    }));
  }

  /**
   * Analyze conversation context for better responses
   * @param {Array} conversationHistory - Previous messages
   * @returns {Object} - Context analysis
   */
  static analyzeConversationContext(conversationHistory) {
    const userMessages = conversationHistory.filter(msg => msg.role === 'user');
    
    return {
      messageCount: userMessages.length,
      isNewConversation: userMessages.length <= 1,
      hasAssessmentContext: conversationHistory.some(msg => 
        msg.content?.toLowerCase().includes('assessment') || 
        msg.content?.toLowerCase().includes('result')
      ),
      lastUserMessage: userMessages[userMessages.length - 1]?.content || '',
      conversationLength: conversationHistory.length
    };
  }

  /**
   * Generate contextual response based on conversation analysis
   * @param {Object} context - Conversation context analysis
   * @param {string} messageText - Current message text
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Object} - Context insights for response generation
   */
  static getContextualInsights(context, messageText, assessmentPattern = null) {
    const insights = {
      shouldPersonalize: context.messageCount > 3,
      shouldReferenceHistory: context.messageCount > 1,
      shouldFocusOnAssessment: context.hasAssessmentContext || !!assessmentPattern,
      responseStyle: context.isNewConversation ? 'welcoming' : 'conversational',
      confidenceBoost: context.messageCount > 5 ? 0.1 : 0
    };

    // Analyze current message for specific patterns
    const messageWords = messageText.toLowerCase();
    if (messageWords.includes('confused') || messageWords.includes('unclear')) {
      insights.needsClarification = true;
    }
    if (messageWords.includes('thank') || messageWords.includes('helpful')) {
      insights.userSatisfaction = 'positive';
    }
    if (messageWords.includes('question') || messageWords.includes('help')) {
      insights.userNeedsSupport = true;
    }

    return insights;
  }
} 