import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../../services/logger.js';
import { insertChatMessage, getConversation, updateConversationAssessmentLinks } from '../../../models/chat/index.js';

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY;

// Check if API key is available 
const isMockMode = !API_KEY;
if (isMockMode) {
  logger.info('Gemini API key is missing. Using mock AI responses for initial messages.');
} else {
  logger.info('Using Gemini API for initial message responses.');
}

// Initialize genAI with API key or create mock
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Enhanced system prompt that includes assessment context understanding
const SYSTEM_PROMPT = `You are Dottie, a supportive AI assistant for women's health and period tracking. 
You provide empathetic, accurate information about menstrual cycles, symptoms, and reproductive health. 
Your tone is friendly and non-judgmental. Always make it clear that your advice is informational, 
not medical, and encourage users to consult healthcare providers for medical concerns.

When users share their assessment results, acknowledge their specific pattern and symptoms, 
and provide personalized guidance while always emphasizing that this is general information 
and not medical advice.`;

// Mock response generator that understands assessment context
const getMockInitialResponse = (message, assessmentId) => {
  const baseResponse = "Thank you for sharing your assessment results with me! I can see you've completed your menstrual health assessment. ";
  
  if (message.toLowerCase().includes('irregular')) {
    return baseResponse + "Irregular periods can have many causes, including stress, hormonal changes, or lifestyle factors. I'd be happy to discuss what might help regulate your cycle, but remember that a healthcare provider can give you personalized medical advice.";
  } else if (message.toLowerCase().includes('heavy')) {
    return baseResponse + "Heavy periods can be challenging to manage. There are various approaches that might help, from lifestyle changes to medical treatments. I can share some general information, but it's important to discuss heavy bleeding with your healthcare provider.";
  } else if (message.toLowerCase().includes('pain')) {
    return baseResponse + "Period pain can significantly impact your daily life. There are both self-care strategies and medical options that might help. Let's explore some options together, and I'll also recommend discussing severe pain with a healthcare professional.";
  } else {
    return baseResponse + "I'm here to help you understand your results and provide general guidance about menstrual health. Feel free to ask me any questions about your cycle, symptoms, or general reproductive health!";
  }
};

/**
 * Send an initial message with assessment context
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendInitialMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, assessment_id, is_initial } = req.body;
    // Get userId from req.user, supporting both id and userId fields
    const userId = req.user.userId || req.user.id;
    
    // Log request received
    console.log(`[sendInitialMessage] Request received:`, {
      chatId: req.params.chatId,
      chatIdType: typeof req.params.chatId,
      message: req.body.message?.substring(0, 50) + '...',
      assessment_id: req.body.assessment_id,
      is_initial: req.body.is_initial,
      userId: req.user.userId || req.user.id
    });
    
    // Ensure chatId is a string
    const chatIdString = String(chatId);
    
    // Log after type conversion
    console.log(`[sendInitialMessage] Converted data:`, {
      chatIdString,
      chatIdStringType: typeof chatIdString,
      userIdString: userId,
      userIdStringType: typeof userId,
      assessmentIdString: req.body.assessment_id,
      assessmentIdStringType: req.body.assessment_id ? typeof req.body.assessment_id : 'null'
    });
    
    logger.info(`[sendInitialMessage] Processing initial message for user: ${userId}`, { 
      chatId: chatIdString, 
      assessment_id, 
      is_initial,
      hasMessage: !!message 
    });

    if (!userId) {
      logger.error('[sendInitialMessage] User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!chatIdString) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    // Log before getConversation call
    console.log(`[sendInitialMessage] Looking up conversation with ID: ${chatIdString}, user: ${userId}`);

    // Verify the conversation exists and belongs to this user
    const conversation = await getConversation(chatIdString, userId);
    
    // Log after getConversation
    console.log(`[sendInitialMessage] Conversation found:`, {
      conversationExists: !!conversation,
      conversationId: conversation?.id,
      belongsToUser: conversation?.user_id === userId
    });
    
    if (!conversation) {
      logger.error(`[sendInitialMessage] Conversation ${chatIdString} not found for user ${userId}`);
      return res.status(404).json({ error: 'Chat conversation not found' });
    }

    // If assessment_id is provided, link it to the conversation
    if (assessment_id) {
      // Log before updateConversationAssessmentLinks
      console.log(`[sendInitialMessage] Linking assessment ${assessment_id} to conversation ${chatIdString}`);
      
      await updateConversationAssessmentLinks(chatIdString, userId, assessment_id);
      logger.info(`[sendInitialMessage] Linked assessment ${assessment_id} to conversation ${chatIdString}`);
    }

    // Log before insertChatMessage (User Message)
    console.log(`[sendInitialMessage] Inserting user message to chat ${chatIdString}, message length: ${message.length}`);
    
    // Save user message to database
    const userMessage = { role: 'user', content: message };
    await insertChatMessage(chatIdString, userMessage);
    
    let aiResponse;
    
    if (isMockMode) {
      // Use mock response when API key is not available
      aiResponse = getMockInitialResponse(message, assessment_id);
    } else {
      // Use real Gemini API when key is available
      try {
        // Initialize the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Create enhanced prompt with assessment context
        const enhancedMessage = assessment_id 
          ? `Assessment Context: The user has completed assessment ${assessment_id}. Their message: ${message}`
          : message;
  
        // Start the chat session for initial message
        const chat = model.startChat({
          history: [], // Fresh conversation for initial message
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
  
        // Send system prompt first
        await chat.sendMessage(SYSTEM_PROMPT);
        
        // Get AI response with assessment context
        const result = await chat.sendMessage(enhancedMessage);
        aiResponse = result.response.text();
      } catch (apiError) {
        // Fallback to mock response on API error
        logger.error('[sendInitialMessage] Gemini API error, using mock response:', apiError);
        aiResponse = getMockInitialResponse(message, assessment_id);
      }
    }
    
    // Log before insertChatMessage (Assistant Message)
    console.log(`[sendInitialMessage] Inserting assistant message to chat ${chatIdString}, message length: ${aiResponse.length}`);
    
    // Save AI response to database
    const assistantMessage = { role: 'assistant', content: aiResponse };
    await insertChatMessage(chatIdString, assistantMessage);

    // Return the response in the format frontend expects
    const response = {
      id: `msg_${Date.now()}`, // Simple message ID
      chat_id: chatIdString,
      role: 'assistant',
      content: aiResponse,
      created_at: new Date().toISOString(),
      assessment_context: assessment_id ? {
        assessment_id,
        pattern: message.includes('Pattern') ? message.match(/(\w+)\s+Pattern/)?.[1]?.toLowerCase() : undefined,
        key_findings: [] // Could be enhanced to extract findings from assessment
      } : undefined
    };

    // Log response payload
    console.log(`[sendInitialMessage] Sending response:`, response);

    logger.info(`[sendInitialMessage] Successfully sent initial message response for chat ${chatIdString}`);

    return res.status(200).json(response);
  } catch (error) {
    logger.error('[sendInitialMessage] Error sending initial message:', error);
    return res.status(500).json({ 
      error: 'Failed to send initial message', 
      details: error.message 
    });
  }
}; 