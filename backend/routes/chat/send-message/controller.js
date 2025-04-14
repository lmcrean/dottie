import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../../services/logger.js';
import { insertChatMessage, createConversation, getConversation } from '../../../models/chat.js';

// Initialize Gemini API
const API_KEY = process.env.VITE_GEMINI_API_KEY;

// Check if API key is available 
const isMockMode = !API_KEY;
if (isMockMode) {
  logger.info('Gemini API key is missing. Using mock AI responses.');
} else {
  logger.info('Using Gemini API for chat responses.');
}

// Initialize genAI with API key or create mock
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// The system prompt provides context about Dottie to the AI
const SYSTEM_PROMPT = `You are Dottie, a supportive AI assistant for women's health and period tracking. 
You provide empathetic, accurate information about menstrual cycles, symptoms, and reproductive health. 
Your tone is friendly and non-judgmental. Always make it clear that your advice is informational, 
not medical, and encourage users to consult healthcare providers for medical concerns.`;

// Mock response generator for local development without API key
const getMockResponse = (message) => {
  const responses = [
    "I understand your concerns about your cycle. Remember that variations can be normal, but it's always best to consult with a healthcare provider for personalized advice.",
    "Thank you for sharing that information. While I can provide general guidance, your healthcare provider can offer advice specific to your situation.",
    "Many people experience similar symptoms. It's important to track them consistently to identify patterns, which can help when discussing with your doctor.",
    "Self-care is crucial during your period. Consider gentle exercise, staying hydrated, and using a heating pad for cramps.",
    "It's completely normal to have questions about your reproductive health. I'm here to provide information, but medical concerns should always be addressed by a healthcare professional."
  ];
  
  // Choose a response based on the content of the message
  if (message.toLowerCase().includes('pain') || message.toLowerCase().includes('cramp')) {
    return "For menstrual pain, some find relief with over-the-counter pain relievers, heating pads, or gentle yoga. If pain is severe or disruptive to daily life, it's important to consult with a healthcare provider.";
  } else if (message.toLowerCase().includes('late') || message.toLowerCase().includes('missed')) {
    return "Many factors can affect cycle length, including stress, exercise, weight changes, and more. If you're concerned about a missed period, a healthcare provider can help determine the cause.";
  } else if (message.toLowerCase().includes('heavy') || message.toLowerCase().includes('flow')) {
    return "Flow varies from person to person. Heavy flow that soaks through protection every hour or includes large clots should be discussed with a healthcare provider.";
  } else {
    // Return a random general response
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

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

    // Save user message to database
    const userMessage = { role: 'user', content: message };
    await insertChatMessage(currentConversationId, userMessage);
    
    let aiResponse;
    
    if (isMockMode) {
      // Use mock response when API key is not available
      aiResponse = getMockResponse(message);
    } else {
      // Use real Gemini API when key is available
      try {
        // Initialize the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
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
        
        // Get AI response
        const result = await chat.sendMessage(message);
        aiResponse = result.response.text();
      } catch (apiError) {
        // Fallback to mock response on API error
        logger.error('Gemini API error, using mock response:', apiError);
        aiResponse = getMockResponse(message);
      }
    }
    
    // Save AI response to database
    const assistantMessage = { role: 'assistant', content: aiResponse };
    await insertChatMessage(currentConversationId, assistantMessage);

    // Return the response
    return res.status(200).json({
      message: aiResponse,
      conversationId: currentConversationId,
    });
  } catch (error) {
    logger.error('Error in sendMessage controller:', error);
    return res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
};