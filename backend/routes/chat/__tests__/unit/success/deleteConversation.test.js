import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../../services/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

vi.mock('../../../../../models/chat/index.js', () => ({
  deleteConversation: vi.fn().mockImplementation((conversationId, userId) => {
    if (conversationId === 'valid-conversation-id' && userId === 'user-123') {
      return Promise.resolve(true);
    } else if (conversationId === 'nonexistent-conversation-id') {
      return Promise.resolve(false);
    }
    return Promise.resolve(false);
  })
}));

// Import the controller after all mocks are set up
import * as deleteController from '../../../delete-conversation/controller.js';

describe('Delete Conversation Controller', () => {
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

  it('should delete a specific conversation successfully', async () => {
    // Arrange
    req.params.conversationId = 'valid-conversation-id';
    
    // Act
    await deleteController.deleteConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Conversation deleted successfully'
    });
  });
  
  it('should return 404 if conversation not found', async () => {
    // Arrange
    req.params.conversationId = 'nonexistent-conversation-id';
    
    // Act
    await deleteController.deleteConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation not found' });
  });
  
  it('should return 400 if conversation ID is missing', async () => {
    // Arrange
    req.params.conversationId = '';
    
    // Act
    await deleteController.deleteConversation(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Conversation ID is required' });
  });
}); 