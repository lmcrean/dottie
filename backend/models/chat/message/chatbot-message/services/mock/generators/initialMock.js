import logger from '../../../../../../../../services/logger.js';
import { buildMockResponse } from '../../../../shared/utils/responseBuilders.js';

/**
 * Generate initial mock response for new conversations
 * @param {string} messageText - User's initial message
 * @param {Object} assessmentData - Full assessment data (required)
 * @returns {Promise<Object>} - Mock response object
 */
export const generateInitialResponse = async (messageText, assessmentData) => {
  if (!assessmentData || typeof assessmentData !== 'object') {
    throw new Error('Assessment data is required - system error if missing');
  }
  try {
    logger.info('Generating initial mock response');

    // Generate personalized response based on assessment data
    const { pattern, pain_level, cycle_length, physical_symptoms, emotional_symptoms } = assessmentData;
    
    const responseContent = `Hello! I see you've shared your menstrual health assessment results showing a ${pattern} pattern. With a ${pain_level}/10 pain level and ${cycle_length}-day cycles, there's definitely valuable information we can explore together. What aspects of your results would you like to discuss first?`;
    const category = 'assessment-detailed';

    const metadata = {
      response_category: category,
      assessment_pattern: assessmentData.pattern,
      assessment_data: assessmentData,
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