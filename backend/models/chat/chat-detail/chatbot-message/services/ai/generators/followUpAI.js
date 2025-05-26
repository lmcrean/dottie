import logger from '../../../../../../services/logger.js';
import { buildAIResponse, buildFallbackResponse } from '../../../shared/utils/responseBuilders.js';
import { formatMessagesForAI } from '../../../shared/utils/messageFormatters.js';

/**
 * Generate follow-up AI response for ongoing conversations
 * @param {string} messageText - User's follow-up message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {string} [assessmentPattern] - Assessment pattern for context
 * @returns {Promise<Object>} - AI response object
 */
export const generateFollowUpResponse = async (messageText, conversationHistory = [], assessmentPattern = null) => {
  try {
    logger.info('Generating follow-up AI response');

    // Format conversation history for AI
    const formattedHistory = formatMessagesForAI(conversationHistory, {
      includeSystemMessage: true,
      systemMessage: buildSystemPrompt(assessmentPattern),
      maxHistory: 20
    });

    // Add current user message
    formattedHistory.push({
      role: 'user',
      content: messageText
    });

    // TODO: Implement actual AI integration with Gemini
    const aiResponse = await callGeminiAPI(formattedHistory, assessmentPattern);
    
    const metadata = {
      model: 'gemini-pro',
      assessment_pattern: assessmentPattern,
      conversation_length: conversationHistory.length,
      is_follow_up: true,
      context_aware: true,
      generated_at: new Date().toISOString(),
      ...aiResponse.metadata
    };

    return buildAIResponse(aiResponse.content, metadata);

  } catch (error) {
    logger.error('Error generating follow-up AI response:', error);
    
    // Fallback to mock-style response
    const fallbackContent = generateFallbackFollowUpResponse(messageText, conversationHistory, assessmentPattern);
    return buildFallbackResponse(fallbackContent);
  }
};

/**
 * Build system prompt for follow-up conversations
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {string} - System prompt
 */
const buildSystemPrompt = (assessmentPattern = null) => {
  let basePrompt = `You are a helpful AI conversation partner continuing an ongoing discussion. 
Be contextually aware of the conversation history and build upon previous exchanges.
Provide thoughtful, relevant responses that advance the conversation meaningfully.
Ask insightful follow-up questions to deepen understanding.`;

  if (assessmentPattern) {
    basePrompt += `\n\nThis conversation involves the user's ${assessmentPattern} assessment results. 
Continue to help them explore and understand their results in the context of our ongoing discussion.`;
  }

  return basePrompt;
};

/**
 * Call Gemini API for follow-up responses (placeholder implementation)
 * @param {Array} conversationHistory - Formatted conversation history
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<Object>} - AI response
 */
const callGeminiAPI = async (conversationHistory, assessmentPattern = null) => {
  try {
    // TODO: Implement actual Gemini API integration
    // const { GoogleGenerativeAI } = await import('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // For now, return a structured placeholder response
    logger.warn('Using placeholder AI follow-up response - implement actual Gemini integration');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Get the last user message for context
    const lastUserMessage = conversationHistory
      .filter(msg => msg.role === 'user')
      .slice(-1)[0]?.content || '';

    let responseContent = "That's a really interesting perspective! I appreciate you sharing that with me. ";
    
    // Simple context-aware response generation
    if (lastUserMessage.toLowerCase().includes('question')) {
      responseContent += "Let me help address your question and explore this topic further with you.";
    } else if (lastUserMessage.toLowerCase().includes('confused')) {
      responseContent += "I can understand how this might feel confusing. Let's break it down step by step.";
    } else if (assessmentPattern) {
      responseContent += `Building on your ${assessmentPattern} assessment context, what aspects resonate most with your experience?`;
    } else {
      responseContent += "What are your thoughts on this, and how does it connect to what we've been discussing?";
    }
    
    return {
      content: responseContent,
      metadata: {
        tokens_used: 65,
        response_time: 1200,
        confidence: 0.75,
        context_used: conversationHistory.length
      }
    };

  } catch (error) {
    logger.error('Error calling Gemini API for follow-up:', error);
    throw error;
  }
};

/**
 * Generate fallback follow-up response when AI fails
 * @param {string} messageText - User message
 * @param {Array} conversationHistory - Conversation history
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {string} - Fallback response content
 */
const generateFallbackFollowUpResponse = (messageText, conversationHistory, assessmentPattern) => {
  const messageCount = conversationHistory.length;
  
  if (assessmentPattern) {
    return `I appreciate you continuing our discussion about your ${assessmentPattern} assessment. Based on what you've shared, I'd like to explore this further with you. What aspects would you like to dive deeper into?`;
  }
  
  if (messageCount < 5) {
    return "Thank you for sharing that with me. I'm interested to learn more about your perspective on this. Can you tell me more about what you're thinking?";
  } else {
    return "Our conversation has been really insightful so far. Building on what we've discussed, I'm curious to hear more about your thoughts on this topic.";
  }
};

/**
 * Generate contextual AI response based on conversation patterns
 * @param {string} messageText - Current user message
 * @param {Array} conversationHistory - Previous messages
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<Object>} - Contextual AI response
 */
export const generateContextualAIResponse = async (messageText, conversationHistory, assessmentPattern = null) => {
  try {
    // Analyze conversation for patterns and context
    const patterns = analyzeConversationPatterns(conversationHistory);
    
    const enhancedSystemPrompt = buildSystemPrompt(assessmentPattern) + 
      `\n\nConversation context: ${patterns.summary}`;

    const formattedHistory = formatMessagesForAI(conversationHistory, {
      includeSystemMessage: true,
      systemMessage: enhancedSystemPrompt,
      maxHistory: 15
    });

    formattedHistory.push({
      role: 'user',
      content: messageText
    });

    const aiResponse = await callGeminiAPI(formattedHistory, assessmentPattern);
    
    const metadata = {
      ...aiResponse.metadata,
      conversation_patterns: patterns,
      enhanced_context: true
    };

    return buildAIResponse(aiResponse.content, metadata);

  } catch (error) {
    logger.error('Error generating contextual AI response:', error);
    throw error;
  }
};

/**
 * Analyze conversation for patterns and context
 * @param {Array} conversationHistory - Previous messages
 * @returns {Object} - Analysis results
 */
const analyzeConversationPatterns = (conversationHistory) => {
  const userMessages = conversationHistory.filter(msg => msg.role === 'user');
  const topics = extractTopics(userMessages);
  const sentiment = analyzeSentiment(userMessages);
  
  return {
    summary: `${userMessages.length} user messages, topics: ${topics.join(', ')}, sentiment: ${sentiment}`,
    topics,
    sentiment,
    messageCount: userMessages.length
  };
};

/**
 * Extract topics from user messages
 * @param {Array} userMessages - User messages
 * @returns {Array<string>} - Detected topics
 */
const extractTopics = (userMessages) => {
  const topicKeywords = {
    'career': ['career', 'job', 'work', 'profession'],
    'assessment': ['assessment', 'test', 'result', 'score'],
    'personal': ['personal', 'myself', 'identity', 'who am i'],
    'skills': ['skill', 'ability', 'talent', 'strength']
  };

  const allText = userMessages.map(msg => msg.content).join(' ').toLowerCase();
  const detectedTopics = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      detectedTopics.push(topic);
    }
  }

  return detectedTopics.length > 0 ? detectedTopics : ['general'];
};

/**
 * Analyze overall sentiment of user messages
 * @param {Array} userMessages - User messages
 * @returns {string} - Overall sentiment
 */
const analyzeSentiment = (userMessages) => {
  const positive = ['good', 'great', 'love', 'like', 'awesome', 'helpful'];
  const negative = ['bad', 'confused', 'frustrated', 'difficult', 'unclear'];
  
  const allText = userMessages.map(msg => msg.content).join(' ').toLowerCase();
  const hasPositive = positive.some(word => allText.includes(word));
  const hasNegative = negative.some(word => allText.includes(word));

  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}; 