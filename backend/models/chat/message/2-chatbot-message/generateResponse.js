import logger from '../../../../services/logger.js';
import { sendChatbotMessage } from './database/sendChatbotMessage.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getConversationForUser } from '../../conversation/read-conversation/getConversation.js';

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY;
const isMockMode = !API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Mock response generator
const getMockResponse = (message) => {
  const responses = [
    "I understand your concerns about your cycle. Remember that variations can be normal, but it's always best to consult with a healthcare provider for personalized advice.",
    "Thank you for sharing that information. While I can provide general guidance, your healthcare provider can offer advice specific to your situation.",
    "Many people experience similar symptoms. It's important to track them consistently to identify patterns, which can help when discussing with your doctor.",
    "Self-care is crucial during your period. Consider gentle exercise, staying hydrated, and using a heating pad for cramps.",
    "It's completely normal to have questions about your reproductive health. I'm here to provide information, but medical concerns should always be addressed by a healthcare professional."
  ];
  
  // Guard against undefined or null message
  if (!message || typeof message !== 'string') {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('pain') || lowerMessage.includes('cramp')) {
    return "For menstrual pain, some find relief with over-the-counter pain relievers, heating pads, or gentle yoga. If pain is severe or disruptive to daily life, it's important to consult with a healthcare provider.";
  } else if (lowerMessage.includes('late') || lowerMessage.includes('missed')) {
    return "Many factors can affect cycle length, including stress, exercise, weight changes, and more. If you're concerned about a missed period, a healthcare provider can help determine the cause.";
  } else if (lowerMessage.includes('heavy') || lowerMessage.includes('flow')) {
    return "Flow varies from person to person. Heavy flow that soaks through protection every hour or includes large clots should be discussed with a healthcare provider.";
  } else {
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

/**
 * Generate and save an AI response to a user message
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID (for conversation verification)
 * @param {string} userMessageId - User message ID to respond to
 * @param {string} messageText - User message text
 * @returns {Promise<Object>} - Generated and saved assistant message
 */
export async function generateAndSaveResponse(conversationId, userId, userMessageId, messageText) {
  try {
    logger.info(`Generating AI response for message ${userMessageId} in conversation ${conversationId}`);
    
    // Get conversation history for context
    let history = [];
    const result = await getConversationForUser(conversationId, userId);
    if (result.success && result.messages) {
      history = result.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      }));
    }

    // Generate AI response
    let aiResponse;
    if (isMockMode) {
      aiResponse = getMockResponse(messageText);
    } else {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const chat = model.startChat({
          history,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });
        const result = await chat.sendMessage(messageText);
        aiResponse = result.response.text();
      } catch (apiError) {
        logger.error('Gemini API error, using mock response:', apiError);
        aiResponse = getMockResponse(messageText);
      }
    }

    // Save assistant message to database
    const assistantResult = await sendChatbotMessage(conversationId, aiResponse, {
      parentMessageId: userMessageId
    });

    logger.info(`AI response generated and saved for conversation ${conversationId}`);

    return assistantResult;

  } catch (error) {
    logger.error('Error generating AI response:', error);
    throw error;
  }
}

// Keep legacy function name for backward compatibility
export const generateResponseToMessage = generateAndSaveResponse; 