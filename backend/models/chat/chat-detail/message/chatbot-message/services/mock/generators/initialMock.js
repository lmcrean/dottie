import logger from '../../../../../../../../services/logger.js';
import { buildMockResponse } from '../../../../shared/utils/responseBuilders.js';

/**
 * Generate initial mock response for new conversations
 * @param {string} messageText - User's initial message
 * @param {string} [assessmentPattern] - Assessment pattern for context
 * @returns {Promise<Object>} - Mock response object
 */
export const generateInitialResponse = async (messageText, assessmentPattern = null) => {
  try {
    logger.info('Generating initial mock response');

    // Simple keyword-based response selection
    const lowerMessage = messageText.toLowerCase();
    let responseContent;
    let category = 'general';

    // Assessment-specific responses
    if (assessmentPattern) {
      responseContent = `Hello! I see you'd like to discuss your ${assessmentPattern} assessment. I'm here to help you understand your results and explore what they mean for you. What specific aspects would you like to dive into?`;
      category = 'assessment';
    }
    // Greeting responses
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      responseContent = "Hello! I'm glad you're here. I'm your AI conversation partner, ready to help you explore topics, answer questions, or just have a meaningful chat. What's on your mind today?";
      category = 'greeting';
    }
    // Help/question responses
    else if (lowerMessage.includes('help') || lowerMessage.includes('question') || lowerMessage.includes('how')) {
      responseContent = "I'm here to help! Feel free to ask me anything you'd like to discuss or explore. Whether it's about assessments, personal development, or general topics, I'm ready to assist you.";
      category = 'help';
    }
    // Problem/concern responses
    else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('concern')) {
      responseContent = "I understand you might be dealing with something challenging. I'm here to listen and help you work through it. Can you tell me more about what's on your mind?";
      category = 'support';
    }
    // Default response
    else {
      responseContent = "Thank you for starting this conversation! I'm here to support you in exploring ideas, discussing topics, or working through questions you might have. What would you like to talk about?";
      category = 'general';
    }

    const metadata = {
      pattern_matched: null,
      keyword_matched: extractKeywords(lowerMessage),
      response_category: category,
      assessment_pattern: assessmentPattern,
      is_initial: true,
      generated_at: new Date().toISOString()
    };

    return buildMockResponse(responseContent, metadata);

  } catch (error) {
    logger.error('Error generating initial mock response:', error);
    
    // Fallback response
    const fallbackContent = "Hello! I'm here to have a conversation with you. How can I help you today?";
    const fallbackMetadata = {
      response_category: 'fallback',
      error: error.message,
      is_initial: true
    };
    
    return buildMockResponse(fallbackContent, fallbackMetadata);
  }
};

/**
 * Extract keywords from user message
 * @param {string} message - User message
 * @returns {Array<string>} - Extracted keywords
 */
const extractKeywords = (message) => {
  const commonKeywords = ['hello', 'hi', 'help', 'question', 'how', 'problem', 'issue', 'concern', 'assessment', 'test', 'result'];
  const words = message.toLowerCase().split(/\s+/);
  return words.filter(word => commonKeywords.includes(word));
};

/**
 * Generate contextual initial response based on assessment pattern
 * @param {string} assessmentPattern - Assessment pattern
 * @returns {Promise<Object>} - Contextual mock response
 */
export const generateAssessmentInitialResponse = async (assessmentPattern) => {
  try {
    const responses = {
      'personality': "I see you've completed a personality assessment! These results can offer valuable insights into your natural tendencies, preferences, and behavioral patterns. What aspects of your personality results would you like to explore together?",
      'skills': "Great! Your skills assessment provides a snapshot of your current capabilities and areas for development. I'd love to help you understand these results and discuss how they might guide your learning and career goals. Where would you like to start?",
      'values': "Your values assessment reveals what's most important to you in life and work. These insights can be incredibly powerful for making decisions and finding fulfillment. What stood out to you in your results?",
      'interests': "Your interests assessment shows what energizes and motivates you. This can be really helpful for career exploration and personal development. What patterns or surprises did you notice in your results?"
    };

    const responseContent = responses[assessmentPattern] || 
      `I see you've completed an assessment! I'm here to help you understand and explore your results. What questions do you have about your ${assessmentPattern} assessment?`;

    const metadata = {
      response_category: 'assessment-initial',
      assessment_pattern: assessmentPattern,
      is_contextual: true,
      is_initial: true
    };

    return buildMockResponse(responseContent, metadata);

  } catch (error) {
    logger.error('Error generating assessment initial response:', error);
    throw error;
  }
}; 