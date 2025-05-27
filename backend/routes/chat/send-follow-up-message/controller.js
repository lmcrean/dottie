import logger from '../../../services/logger.js';
import { getConversation, insertChatMessage } from '../../../models/chat/index.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Check if we're in mock mode (no API key)
const isMockMode = !process.env.GEMINI_API_KEY;

// System prompt for consistent AI responses
const SYSTEM_PROMPT = `You are Dottie, a friendly and supportive AI health advisor specializing in menstrual health. 

Your role is to:
- Provide helpful, accurate information about menstrual health
- Be supportive and understanding
- Answer follow-up questions with context from the conversation
- Encourage users to consult healthcare providers for serious concerns
- Maintain a warm, approachable tone

Keep responses concise but informative. Always prioritize user safety and recommend professional medical advice when appropriate.`;

/**
 * Generate a mock response for development without API key
 */
const getMockFollowUpResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('pain') || lowerMessage.includes('cramp')) {
    return "For menstrual pain, some find relief with over-the-counter pain relievers, heating pads, or gentle yoga. If pain is severe or disruptive to daily life, it's important to consult with a healthcare provider. This is a placeholder message confirming that our conversation has been saved in SQLite.";
  } else if (lowerMessage.includes('cycle') || lowerMessage.includes('period')) {
    return "Menstrual cycles can vary from person to person. Tracking your cycle can help you understand your patterns better. If you notice significant changes, consider discussing them with your healthcare provider. This is a placeholder message confirming that our conversation has been saved in SQLite.";
  } else if (lowerMessage.includes('flow') || lowerMessage.includes('heavy')) {
    return "Flow heaviness varies between individuals. If your flow has changed significantly or you're concerned about it, consulting with a healthcare provider can provide personalized guidance. This is a placeholder message confirming that our conversation has been saved in SQLite.";
  } else {
    return "Thank you for your question. I'm here to help with any menstrual health concerns. For personalized medical advice, I always recommend consulting with a healthcare provider. This is a placeholder message confirming that our conversation has been saved in SQLite.";
  }
};

/**
 * Send a follow-up message to a specific chat conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendFollowUpMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, conversationId } = req.body;
    // Get userId from req.user, supporting both id and userId fields
    const userId = req.user.userId || req.user.id;
    
    logger.info(`[sendFollowUpMessage] Processing follow-up message for user: ${userId}`, { 
      chatId, 
      conversationId,
      hasMessage: !!message 
    });

    if (!userId) {
      logger.error('[sendFollowUpMessage] User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    // Use conversationId from body if provided, otherwise use chatId from params
    const targetConversationId = conversationId || chatId;

    // Verify the conversation exists and belongs to this user
    const conversation = await getConversation(targetConversationId, userId);
    if (!conversation) {
      logger.error(`[sendFollowUpMessage] Conversation ${targetConversationId} not found for user ${userId}`);
      return res.status(404).json({ error: 'Chat conversation not found' });
    }

    // Save user message to database
    const userMessage = { role: 'user', content: message };
    await insertChatMessage(targetConversationId, userMessage);
    
    let aiResponse;
    
    if (isMockMode) {
      // Use mock response when API key is not available
      aiResponse = getMockFollowUpResponse(message);
    } else {
      // Use real Gemini API when key is available
      try {
        // Initialize the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Get conversation history for context
        const history = conversation.messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : msg.role,
          parts: [{ text: msg.content }],
        }));
  
        // Start the chat session with history
        const chat = model.startChat({
          history: history,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        });
  
        // Send system prompt if this is a new conversation
        if (conversation.messages.length === 0) {
          await chat.sendMessage(SYSTEM_PROMPT);
        }
        
        // Get AI response
        const result = await chat.sendMessage(message);
        aiResponse = result.response.text();
      } catch (apiError) {
        // Fallback to mock response on API error
        logger.error('[sendFollowUpMessage] Gemini API error, using mock response:', apiError);
        aiResponse = getMockFollowUpResponse(message);
      }
    }
    
    // Save AI response to database
    const assistantMessage = { role: 'assistant', content: aiResponse };
    await insertChatMessage(targetConversationId, assistantMessage);

    // Return the response in the format frontend expects
    const response = {
      id: `msg_${Date.now()}`, // Simple message ID
      chat_id: targetConversationId,
      role: 'assistant',
      content: aiResponse,
      created_at: new Date().toISOString(),
    };

    logger.info(`[sendFollowUpMessage] Successfully sent follow-up message response for chat ${targetConversationId}`);

    return res.status(200).json(response);
  } catch (error) {
    logger.error('[sendFollowUpMessage] Error sending follow-up message:', error);
    return res.status(500).json({ 
      error: 'Failed to send follow-up message', 
      details: error.message 
    });
  }
}; 