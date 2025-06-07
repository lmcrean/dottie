import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockImplementation(() => {
          return {
            startChat: vi.fn().mockImplementation(() => {
              return {
                sendMessage: vi.fn().mockResolvedValue({
                  response: {
                    text: vi.fn().mockReturnValue('This is a mock AI response')
                  }
                })
              };
            })
          };
        })
      };
    })
  };
});

vi.mock('../../../../../services/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

// Mock the conversation functions used by sendMessageFlow
vi.mock('../../../../../models/chat/conversation/read-conversation/getConversation.js', () => ({
  getConversationForUser: vi.fn().mockImplementation((conversationId, userId) => {
    if (conversationId === 'valid-conversation-id') {
      return Promise.resolve({
        success: true,
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there, how can I help you?' }
        ]
      });
    }
    return Promise.resolve({ success: false });
  })
}));

vi.mock('../../../../../models/chat/conversation/create-new-conversation/database/conversationCreate.js', () => ({
  createConversation: vi.fn().mockResolvedValue('new-conversation-id')
}));

// Mock Chat.isOwner used by addUserMessage
vi.mock('../../../../../models/chat/list/chat.js', () => ({
  default: {
    isOwner: vi.fn().mockResolvedValue(true)
  }
}));

// Mock the message functions
vi.mock('../../../../../models/chat/message/1-user-message/add-message/sendUserMessage.js', () => ({
  addUserMessage: vi.fn().mockResolvedValue({
    userMessage: {
      id: 'user-msg-123',
      content: 'Test message',
      role: 'user'
    },
    conversationId: 'new-conversation-id',
    timestamp: new Date().toISOString()
  })
}));

vi.mock('../../../../../models/chat/message/2-chatbot-message/generateResponse.js', () => ({
  generateAndSaveResponse: vi.fn().mockResolvedValue({
    chatbotMessage: {
      id: 'assistant-msg-123',
      content: 'This is a mock AI response',
      role: 'assistant'
    },
    conversationId: 'new-conversation-id',
    timestamp: new Date().toISOString()
  })
}));

vi.mock('../../../../../services/dbService.js', () => ({
  default: {
    create: vi.fn().mockResolvedValue({ id: 'message-id' })
  }
}));

// Import the controller after all mocks are set up
import * as sendMessageController from '../../../send-message/controller.js';

describe('Send Message Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        message: 'Test message',
      },
      user: {
        id: 'user-123'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('should send a message and receive a response (new conversation)', async () => {
    // Act
    await sendMessageController.sendMessage(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'This is a mock AI response',
      conversationId: 'new-conversation-id'
    });
  });

  it('should send a message in an existing conversation', async () => {
    // Arrange
    req.body.conversationId = 'valid-conversation-id';
    
    // Act
    await sendMessageController.sendMessage(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'This is a mock AI response',
      conversationId: 'valid-conversation-id'
    });
  });
  
  it('should return 400 if message is missing', async () => {
    // Arrange
    req.body.message = undefined;
    
    // Act
    await sendMessageController.sendMessage(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
  });
  
  it('should return 404 if conversation not found', async () => {
    // Arrange
    req.body.conversationId = 'invalid-conversation-id';
    
    // Act
    await sendMessageController.sendMessage(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation not found' });
  });
}); 