import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../../services/logger.js';
import { insertChatMessage, createConversation, getConversation } from '../../../models/chat.js';

// Initialize Gemini API
const API_KEY = process.env.VITE_GEMINI_API_KEY;

// Validate API key is available
if (!API_KEY) {
  logger.error('Gemini API key is missing. Please check your environment variables.');
}

// Initialize genAI with API key
const genAI = new GoogleGenerativeAI(API_KEY); 

// The system prompt provides context about Dottie to the AI
const SYSTEM_PROMPT = `You are Dottie, a supportive AI assistant for women's health and period tracking. 
You provide empathetic, accurate information about menstrual cycles, symptoms, and reproductive health. 
Your tone is friendly and non-judgmental. Always make it clear that your advice is informational, 
not medical, and encourage users to consult healthcare providers for medical concerns.`;

/**
 * Send a message to the Gemini AI and get a response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMessage = async (req, res) => {
  try {    
    const { message, conversationId } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get conversation history if conversationId provided
    let history = [];
    let currentConversationId = conversationId;

    if (conversationId) {
      // Verify the conversation belongs to this user
      const conversation = await getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      // Get message history for context
      history = conversation.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      }));
    } else {
      // Create a new conversation
      currentConversationId = await createConversation(userId);
    }

    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    try {
      // Start the chat session
      const chat = model.startChat({
        history,
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

      // Add system prompt if this is a new conversation
      if (!conversationId) {
        await chat.sendMessage(SYSTEM_PROMPT);
      }

      // Send user message to Gemini
      const userMessage = { role: 'user', content: message };
      await insertChatMessage(currentConversationId, userMessage);
      
      // Get AI response
      const result = await chat.sendMessage(message);
      const aiResponse = result.response.text();
      
      // Save AI response to database using 'assistant' role
      const assistantMessage = { role: 'assistant', content: aiResponse };
      await insertChatMessage(currentConversationId, assistantMessage);

      // Return the response
      return res.status(200).json({
        message: aiResponse,
        conversationId: currentConversationId,
      });
    } catch (apiError) {
      // Specific error handling for API calls
      logger.error('Gemini API error:', apiError);
      
      // Check for common API errors
      if (apiError.message?.includes('API key')) {
        return res.status(401).json({ error: 'Invalid API key or authentication error' });
      }
      
      throw apiError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    logger.error('Error in sendMessage controller:', error);
    return res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
};