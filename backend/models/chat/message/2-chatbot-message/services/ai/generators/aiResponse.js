import logger from '../../../../../../services/logger.js';
import { buildAIResponse, buildFallbackResponse } from '../../../shared/utils/responseBuilders.js';
import { formatMessagesForAI } from '../../../shared/utils/messageFormatters.js';

/**
 * Generate AI response for any conversation stage
 * @param {string} messageText - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation (empty for initial)
 * @param {Object} [assessmentData] - Full assessment data (for initial conversations)
 * @param {string} [assessmentPattern] - Assessment pattern for context (for follow-ups)
 * @returns {Promise<Object>} - AI response object
 */
export const generateAIResponse = async (messageText, conversationHistory = [], assessmentData = null, assessmentPattern = null) => {
  try {
    const isInitial = conversationHistory.length === 0;
    logger.info(`Generating ${isInitial ? 'initial' : 'follow-up'} AI response`);

    let aiResponse;
    let metadata;

    if (isInitial) {
      if (!assessmentData || typeof assessmentData !== 'object') {
        throw new Error('Assessment data is required for initial conversations');
      }
      aiResponse = await generateInitialAIResponse(messageText, assessmentData);
      metadata = {
        model: 'gemini-pro',
        assessment_pattern: assessmentData.pattern,
        assessment_data: assessmentData,
        is_initial: true,
        system_prompt_used: true,
        generated_at: new Date().toISOString()
      };
    } else {
      aiResponse = await generateFollowUpAIResponse(messageText, conversationHistory, assessmentPattern);
      metadata = {
        model: 'gemini-pro',
        assessment_pattern: assessmentPattern,
        conversation_length: conversationHistory.length,
        is_follow_up: true,
        context_aware: true,
        generated_at: new Date().toISOString(),
        ...aiResponse.metadata
      };
    }

    return buildAIResponse(aiResponse.content, metadata);

  } catch (error) {
    logger.error('Error generating AI response:', error);
    
    // Generate appropriate fallback
    const isInitial = conversationHistory.length === 0;
    const fallbackContent = isInitial 
      ? generateFallbackInitialResponse(messageText, assessmentData)
      : generateFallbackFollowUpResponse(messageText, conversationHistory, assessmentPattern);
    
    return buildFallbackResponse(fallbackContent);
  }
};

/**
 * Generate initial AI response for new conversations
 * @param {string} messageText - User's initial message
 * @param {Object} assessmentData - Full assessment data
 * @returns {Promise<Object>} - AI response
 */
const generateInitialAIResponse = async (messageText, assessmentData) => {
  const systemPrompt = buildInitialSystemPrompt(assessmentData);
  const userPrompt = `Initial message: ${messageText}`;

  return await callGeminiAPI(systemPrompt, userPrompt);
};

/**
 * Generate follow-up AI response for ongoing conversations
 * @param {string} messageText - User's follow-up message
 * @param {Array} conversationHistory - Previous messages
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<Object>} - AI response
 */
const generateFollowUpAIResponse = async (messageText, conversationHistory, assessmentPattern) => {
  // Format conversation history for AI
  const formattedHistory = formatMessagesForAI(conversationHistory, {
    includeSystemMessage: true,
    systemMessage: buildFollowUpSystemPrompt(assessmentPattern),
    maxHistory: 20
  });

  // Add current user message
  formattedHistory.push({
    role: 'user',
    content: messageText
  });

  return await callGeminiAPI(formattedHistory, assessmentPattern);
};

/**
 * Build system prompt for initial conversations
 * @param {Object} assessmentData - Full assessment data
 * @returns {string} - System prompt
 */
const buildInitialSystemPrompt = (assessmentData) => {
  const { pattern, cycle_length, period_duration, pain_level, physical_symptoms, emotional_symptoms } = assessmentData;
  
  return `You are a helpful AI conversation partner specializing in menstrual health and wellness. 
You should be empathetic, insightful, and encourage deeper exploration of health topics.
Always ask follow-up questions to keep the conversation engaging.

The user has completed a menstrual health assessment with the following results:
- Pattern: ${pattern}
- Cycle length: ${cycle_length} days
- Period duration: ${period_duration} days  
- Pain level: ${pain_level}/10
- Physical symptoms: ${physical_symptoms?.join(', ') || 'none reported'}
- Emotional symptoms: ${emotional_symptoms?.join(', ') || 'none reported'}

Help them understand their results, provide appropriate guidance, and explore what these patterns mean for their health and wellbeing.`;
};

/**
 * Build system prompt for follow-up conversations
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {string} - System prompt
 */
const buildFollowUpSystemPrompt = (assessmentPattern = null) => {
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
 * Call Gemini API (placeholder implementation)
 * @param {string|Array} prompt - System prompt or formatted conversation history
 * @param {string} [userPrompt] - User prompt for initial conversations
 * @returns {Promise<Object>} - AI response
 */
const callGeminiAPI = async (prompt, userPrompt = null) => {
  try {
    // TODO: Implement actual Gemini API integration
    // const { GoogleGenerativeAI } = await import('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    logger.warn('Using placeholder AI response - implement actual Gemini integration');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let responseContent;
    
    if (userPrompt) {
      // Initial conversation
      responseContent = "Thank you for starting this conversation! I'm here to help you explore your thoughts and questions. Based on what you've shared, I'd love to learn more about what's on your mind and how I can best support you today.";
    } else {
      // Follow-up conversation - analyze the last message for context
      const lastUserMessage = Array.isArray(prompt) 
        ? prompt.filter(msg => msg.role === 'user').slice(-1)[0]?.content || ''
        : '';

      responseContent = "That's a really interesting perspective! I appreciate you sharing that with me. ";
      
      if (lastUserMessage.toLowerCase().includes('question')) {
        responseContent += "Let me help address your question and explore this topic further with you.";
      } else if (lastUserMessage.toLowerCase().includes('confused')) {
        responseContent += "I can understand how this might feel confusing. Let's break it down step by step.";
      } else {
        responseContent += "What are your thoughts on this, and how does it connect to what we've been discussing?";
      }
    }
    
    return {
      content: responseContent,
      metadata: {
        tokens_used: userPrompt ? 45 : 65,
        response_time: 1000,
        confidence: 0.8,
        context_used: Array.isArray(prompt) ? prompt.length : 0
      }
    };

  } catch (error) {
    logger.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Generate fallback initial response when AI fails
 * @param {string} messageText - User message
 * @param {Object} assessmentData - Assessment data
 * @returns {string} - Fallback response content
 */
const generateFallbackInitialResponse = (messageText, assessmentData) => {
  if (!assessmentData) {
    return "Hello! I'm here to have a conversation with you. How can I help you today?";
  }
  
  const { pattern, pain_level, cycle_length } = assessmentData;
  return `Hello! I see you've shared your menstrual health assessment results showing a ${pattern} pattern. With a ${pain_level}/10 pain level and ${cycle_length}-day cycles, there's definitely valuable information we can explore together. What aspects of your results would you like to discuss first?`;
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
 * Generate contextual AI response with enhanced analysis
 * @param {string} messageText - Current user message
 * @param {Array} conversationHistory - Previous messages
 * @param {Object} [assessmentData] - Assessment data for initial conversations
 * @param {string} [assessmentPattern] - Assessment pattern for follow-ups
 * @returns {Promise<Object>} - Enhanced AI response
 */
export const generateContextualAIResponse = async (messageText, conversationHistory, assessmentData = null, assessmentPattern = null) => {
  try {
    const isInitial = conversationHistory.length === 0;
    
    if (isInitial) {
      return await generateAIResponse(messageText, conversationHistory, assessmentData);
    }

    // Analyze conversation for patterns and context
    const patterns = analyzeConversationPatterns(conversationHistory);
    
    const enhancedSystemPrompt = buildFollowUpSystemPrompt(assessmentPattern) + 
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

    const aiResponse = await callGeminiAPI(formattedHistory);
    
    const metadata = {
      model: 'gemini-pro',
      conversation_patterns: patterns,
      enhanced_context: true,
      assessment_pattern: assessmentPattern,
      conversation_length: conversationHistory.length,
      is_follow_up: true,
      generated_at: new Date().toISOString(),
      ...aiResponse.metadata
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