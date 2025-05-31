import logger from '../../../../../../services/logger.js';
import { buildMockResponse } from '../../../shared/utils/responseBuilders.js';

/**
 * Generate mock response for any conversation stage
 * @param {string} messageText - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation (empty for initial)
 * @param {Object} [assessmentData] - Full assessment data (for initial conversations)
 * @param {string} [assessmentPattern] - Assessment pattern for context (for follow-ups)
 * @returns {Promise<Object>} - Mock response object
 */
export const generateMockResponse = async (messageText, conversationHistory = [], assessmentData = null, assessmentPattern = null) => {
  try {
    const isInitial = conversationHistory.length === 0;
    logger.info(`Generating ${isInitial ? 'initial' : 'follow-up'} mock response`);

    let responseContent;
    let category;
    let metadata;

    if (isInitial) {
      if (!assessmentData || typeof assessmentData !== 'object') {
        throw new Error('Assessment data is required for initial conversations');
      }
      
      const result = generateInitialMockResponse(messageText, assessmentData);
      responseContent = result.content;
      category = result.category;
      
      metadata = {
        response_category: category,
        assessment_pattern: assessmentData.pattern,
        assessment_data: assessmentData,
        is_initial: true,
        generated_at: new Date().toISOString()
      };
    } else {
      const result = generateFollowUpMockResponse(messageText, conversationHistory, assessmentPattern);
      responseContent = result.content;
      category = result.category;
      
      metadata = {
        pattern_matched: null,
        keyword_matched: extractKeywords(messageText.toLowerCase()),
        response_category: category,
        assessment_pattern: assessmentPattern,
        conversation_length: conversationHistory.length,
        is_follow_up: true,
        context_aware: true,
        generated_at: new Date().toISOString()
      };
    }

    return buildMockResponse(responseContent, metadata);

  } catch (error) {
    logger.error('Error generating mock response:', error);
    
    // Fallback response
    const isInitial = conversationHistory.length === 0;
    const fallbackContent = isInitial 
      ? "Hello! I'm here to have a conversation with you. How can I help you today?"
      : "I appreciate you continuing our conversation. Could you tell me more about what you're thinking?";
    
    const fallbackMetadata = {
      response_category: 'fallback',
      error: error.message,
      is_initial: isInitial,
      is_follow_up: !isInitial
    };
    
    return buildMockResponse(fallbackContent, fallbackMetadata);
  }
};

/**
 * Generate initial mock response for new conversations
 * @param {string} messageText - User's initial message
 * @param {Object} assessmentData - Full assessment data
 * @returns {Object} - Response content and category
 */
const generateInitialMockResponse = (messageText, assessmentData) => {
  // Generate personalized response based on assessment data
  const { pattern, pain_level, cycle_length, physical_symptoms, emotional_symptoms } = assessmentData;
  
  const responseContent = `Hello! I see you've shared your menstrual health assessment results showing a ${pattern} pattern. With a ${pain_level}/10 pain level and ${cycle_length}-day cycles, there's definitely valuable information we can explore together. What aspects of your results would you like to discuss first?`;
  const category = 'assessment-detailed';

  return { content: responseContent, category };
};

/**
 * Generate follow-up mock response for ongoing conversations
 * @param {string} messageText - User's follow-up message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {string} [assessmentPattern] - Assessment pattern for context
 * @returns {Object} - Response content and category
 */
const generateFollowUpMockResponse = (messageText, conversationHistory, assessmentPattern) => {
  const lowerMessage = messageText.toLowerCase();
  let responseContent;
  let category = 'follow-up';

  // Analyze conversation context
  const messageCount = conversationHistory.length;

  // Determine response based on message content and context
  if (lowerMessage.includes('thank')) {
    responseContent = "You're very welcome! I'm glad I could help. Is there anything else you'd like to explore or discuss?";
    category = 'acknowledgment';
  }
  else if (lowerMessage.includes('yes') || lowerMessage.includes('yeah') || lowerMessage.includes('sure')) {
    responseContent = "Great! I'm excited to continue our conversation. What would you like to dive deeper into?";
    category = 'affirmation';
  }
  else if (lowerMessage.includes('no') || lowerMessage.includes('not really')) {
    responseContent = "That's perfectly fine. Would you like to shift our focus to something else that interests you?";
    category = 'redirect';
  }
  else if (lowerMessage.includes('explain') || lowerMessage.includes('tell me more') || lowerMessage.includes('elaborate')) {
    responseContent = "I'd be happy to elaborate! Let me break that down further for you and provide some additional context.";
    category = 'explanation';
  }
  else if (lowerMessage.includes('example') || lowerMessage.includes('instance') || lowerMessage.includes('show me')) {
    responseContent = "That's a great question! Let me give you a concrete example to illustrate this concept better.";
    category = 'example';
  }
  else if (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('suggest')) {
    responseContent = "I'm here to help! Based on our conversation so far, I have some thoughts that might be useful for you.";
    category = 'support';
  }
  else if (assessmentPattern && (lowerMessage.includes('assessment') || lowerMessage.includes('result'))) {
    responseContent = `Based on your ${assessmentPattern} assessment, this is an interesting area to explore. What specific aspects resonate most with your experience?`;
    category = 'assessment-follow-up';
  }
  // Question-based responses
  else if (lowerMessage.includes('?') || lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why')) {
    responseContent = "That's a thoughtful question! Let me share some insights that might help address what you're asking about.";
    category = 'question-response';
  }
  // Emotional expressions
  else if (lowerMessage.includes('confused') || lowerMessage.includes('unclear') || lowerMessage.includes('don\'t understand')) {
    responseContent = "I understand that this might feel confusing. Let me try to clarify and approach it from a different angle that might be clearer.";
    category = 'clarification';
  }
  else if (lowerMessage.includes('interesting') || lowerMessage.includes('cool') || lowerMessage.includes('fascinating')) {
    responseContent = "I'm glad you find this interesting! There's so much more we could explore in this area. What specifically caught your attention?";
    category = 'engagement';
  }
  // Default contextual response
  else {
    if (messageCount < 3) {
      responseContent = "I appreciate you sharing that with me. Building on what you've said, let's explore this topic further together.";
    } else if (messageCount < 10) {
      responseContent = "It's great that we're developing this conversation! Your perspective is adding valuable depth to our discussion.";
    } else {
      responseContent = "Our conversation has been really rich so far. I'm curious to hear more about your thoughts on this.";
    }
    category = 'contextual';
  }

  return { content: responseContent, category };
};

/**
 * Generate contextual response based on conversation patterns
 * @param {string} messageText - Current user message
 * @param {Array} conversationHistory - Previous messages
 * @param {Object} [assessmentData] - Assessment data for initial conversations
 * @param {string} [assessmentPattern] - Assessment pattern for follow-ups
 * @returns {Promise<Object>} - Enhanced mock response
 */
export const generateContextualMockResponse = async (messageText, conversationHistory, assessmentData = null, assessmentPattern = null) => {
  try {
    const isInitial = conversationHistory.length === 0;
    
    if (isInitial) {
      return await generateMockResponse(messageText, conversationHistory, assessmentData);
    }

    // Analyze conversation patterns for follow-up
    const userMessages = conversationHistory.filter(msg => msg.role === 'user');
    const topics = extractTopics(userMessages);
    const sentiment = analyzeSentiment(messageText);

    let responseContent;
    let category = 'contextual';

    if (topics.includes('assessment') && topics.includes('career')) {
      responseContent = "I notice we've been discussing how your assessment results relate to career possibilities. This connection between self-understanding and career direction is really valuable to explore.";
      category = 'pattern-career';
    } else if (topics.includes('confused') || topics.includes('unclear')) {
      responseContent = "It sounds like some aspects of this are feeling unclear. That's completely normal - let's take a step back and approach this in a way that makes more sense.";
      category = 'pattern-confusion';
    } else if (sentiment === 'positive') {
      responseContent = "I can sense your enthusiasm about this topic! That energy is wonderful - let's channel it into deeper exploration.";
      category = 'pattern-positive';
    } else if (sentiment === 'negative') {
      responseContent = "I hear that this might be challenging or frustrating. These feelings are valid, and we can work through this together.";
      category = 'pattern-support';
    } else {
      responseContent = "Building on our conversation so far, I think there are some interesting directions we could take this discussion.";
      category = 'pattern-general';
    }

    const metadata = {
      response_category: category,
      detected_topics: topics,
      detected_sentiment: sentiment,
      context_aware: true,
      conversation_length: conversationHistory.length,
      assessment_pattern: assessmentPattern,
      is_follow_up: true,
      generated_at: new Date().toISOString()
    };

    return buildMockResponse(responseContent, metadata);

  } catch (error) {
    logger.error('Error generating contextual mock response:', error);
    throw error;
  }
};

/**
 * Generate assessment-specific initial response
 * @param {string} assessmentPattern - Assessment pattern
 * @returns {Promise<Object>} - Assessment-specific mock response
 */
export const generateAssessmentMockResponse = async (assessmentPattern) => {
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
      is_initial: true,
      generated_at: new Date().toISOString()
    };

    return buildMockResponse(responseContent, metadata);

  } catch (error) {
    logger.error('Error generating assessment mock response:', error);
    throw error;
  }
};

/**
 * Extract keywords from user message
 * @param {string} message - User message
 * @returns {Array<string>} - Extracted keywords
 */
const extractKeywords = (message) => {
  const keywords = ['thank', 'yes', 'no', 'explain', 'example', 'help', 'advice', 'assessment', 'confused', 'interesting'];
  const words = message.toLowerCase().split(/\s+/);
  return words.filter(word => keywords.includes(word));
};

/**
 * Extract topics from conversation history
 * @param {Array} messages - User messages
 * @returns {Array<string>} - Detected topics
 */
const extractTopics = (messages) => {
  const topicKeywords = {
    'assessment': ['assessment', 'test', 'result', 'score'],
    'career': ['career', 'job', 'work', 'profession'],
    'confused': ['confused', 'unclear', 'don\'t understand'],
    'learning': ['learn', 'study', 'education', 'skill']
  };

  const allText = messages.map(msg => msg.content).join(' ').toLowerCase();
  const detectedTopics = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      detectedTopics.push(topic);
    }
  }

  return detectedTopics;
};

/**
 * Basic sentiment analysis
 * @param {string} message - User message
 * @returns {string} - Detected sentiment
 */
const analyzeSentiment = (message) => {
  const positive = ['good', 'great', 'awesome', 'love', 'like', 'excellent', 'amazing', 'helpful'];
  const negative = ['bad', 'terrible', 'hate', 'confused', 'frustrated', 'difficult', 'hard'];
  
  const lowerMessage = message.toLowerCase();
  const hasPositive = positive.some(word => lowerMessage.includes(word));
  const hasNegative = negative.some(word => lowerMessage.includes(word));

  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}; 