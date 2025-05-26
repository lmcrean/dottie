import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../../services/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('../../../../../models/chat/chat.js', () => ({
  getConversation: vi.fn().mockImplementation((conversationId, userId) => {
    if (conversationId === 'valid-conversation-id' && userId === 'user-123') {
      return Promise.resolve({
        id: 'valid-conversation-id',
        messages: [
          { role: 'user', content: 'Hello AI', createdAt: '2023-01-01T10:00:00.000Z' },
          { role: 'assistant', content: 'Hello User!', createdAt: '2023-01-01T10:01:00.000Z' }
        ]
      });
    }
    return Promise.resolve(null);
  })
}));

// Import the controller after all mocks are set up
import * as conversationController from '../../../get-conversation/controller.js';

describe('Get Conversation Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      user: {
        id: 'user-123'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  it('should retrieve a specific conversation with messages', async () => {
    // Arrange
    req.params.conversationId = 'valid-conversation-id';
    
    // Act
    await conversationController.getConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'valid-conversation-id',
      messages: [
        { role: 'user', content: 'Hello AI', createdAt: '2023-01-01T10:00:00.000Z' },
        { role: 'assistant', content: 'Hello User!', createdAt: '2023-01-01T10:01:00.000Z' }
      ]
    });
  });
  
  it('should return 404 if conversation not found', async () => {
    // Arrange
    req.params.conversationId = 'invalid-conversation-id';
    
    // Act
    await conversationController.getConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation not found' });
  });
  
  it('should return 400 if conversation ID is missing', async () => {
    // Arrange
    req.params.conversationId = '';
    
    // Act
    await conversationController.getConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation ID is required' });
  });
}); 