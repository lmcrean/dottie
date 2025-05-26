import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../../types/common';
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

vi.mock('../../../../../models/chat/chat.js', () => ({
  insertChatMessage: vi.fn().mockResolvedValue(true),
  createConversation: vi.fn().mockResolvedValue('new-conversation-id'),
  getConversation: vi.fn().mockImplementation((conversationId) => {
    if (conversationId === 'valid-conversation-id') {
      return Promise.resolve({
        id: 'valid-conversation-id',
        userId: 'user-123',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there, how can I help you?' }
        ]
      });
    }
    return Promise.resolve(null);
  })
}));

// Import the controller after all mocks are set up
import * as sendMessageController from '';

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

