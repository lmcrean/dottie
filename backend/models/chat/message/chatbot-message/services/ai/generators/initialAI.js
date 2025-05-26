import logger from '../../../../../../../../services/logger.js';
import { buildAIResponse, buildFallbackResponse } from '../../../../shared/utils/responseBuilders.js';

/**
 * Generate initial AI response for new conversations
 * @param {string} messageText - User's initial message
 * @param {Object} assessmentData - Full assessment data (required)
 * @returns {Promise<Object>} - AI response object
 */
export const generateInitialResponse = async (messageText, assessmentData) => {
  if (!assessmentData || typeof assessmentData !== 'object') {
    throw new Error('Assessment data is required - system error if missing');
  }
  try {
    logger.info('Generating initial AI response');

    // TODO: Implement actual AI integration with Gemini
    // For now, return a structured response that mimics AI behavior
    
    const systemPrompt = buildSystemPrompt(assessmentData);
    const userPrompt = `Initial message: ${messageText}`;

    // Placeholder: This would be replaced with actual AI API call
    const aiResponse = await callGeminiAPI(systemPrompt, userPrompt);
    
    const metadata = {
      model: 'gemini-pro',
      assessment_pattern: assessmentData.pattern,
      assessment_data: assessmentData,
      is_initial: true,
      system_prompt_used: true,
      generated_at: new Date().toISOString()
    };

    return buildAIResponse(aiResponse.content, metadata);

  } catch (error) {
    logger.error('Error generating initial AI response:', error);
    
    // Fallback to mock-style response with assessment context
    const fallbackContent = generateFallbackInitialResponse(messageText, assessmentData);
    return buildFallbackResponse(fallbackContent);
  }
};

/**
 * Build system prompt for initial conversations
 * @param {Object} assessmentData - Full assessment data
 * @returns {string} - System prompt
 */
const buildSystemPrompt = (assessmentData) => {
  const { pattern, cycle_length, period_duration, pain_level, physical_symptoms, emotional_symptoms } = assessmentData;
  
  return `You are a helpful AI conversation partner specializing in menstrual health and wellness. 
You should be empathetic, insightful, and encourage deeper exploration of health topics.
Always ask follow-up questions to keep the conversation engaging.

The user has completed a menstrual health assessment with the following results:
- Pattern: ${pattern}
- Age: ${age}
- Cycle length: ${cycle_length} days
- Period duration: ${period_duration} days  
- Pain level: ${pain_level}/10
- Physical symptoms: ${physical_symptoms?.join(', ') || 'none reported'}
- Emotional symptoms: ${emotional_symptoms?.join(', ') || 'none reported'}

Help them understand their results, provide appropriate guidance, and explore what these patterns mean for their health and wellbeing.`;
};

/**
 * Call Gemini API (placeholder implementation)
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt
 * @returns {Promise<Object>} - AI response
 */
const callGeminiAPI = async (systemPrompt, userPrompt) => {
  try {
    // TODO: Implement actual Gemini API integration
    // const { GoogleGenerativeAI } = await import('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // For now, return a structured placeholder response
    logger.warn('Using placeholder AI response - implement actual Gemini integration');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      content: "Thank you for starting this conversation! I'm here to help you explore your thoughts and questions. Based on what you've shared, I'd love to learn more about what's on your mind and how I can best support you today.",
      metadata: {
        tokens_used: 45,
        response_time: 1000,
        confidence: 0.8
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
  const { pattern, pain_level, cycle_length } = assessmentData;
  return `Hello! I see you've shared your menstrual health assessment results showing a ${pattern} pattern. With a ${pain_level}/10 pain level and ${cycle_length}-day cycles, there's definitely valuable information we can explore together. What aspects of your results would you like to discuss first?`;
}; 