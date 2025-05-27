import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../../../services/logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('../../../../../models/chat/index.js', () => ({
  getUserConversations: vi.fn().mockResolvedValue([
    {
      id: 'conversation-1',
      lastMessageDate: '2023-01-01T12:00:00.000Z',
      preview: 'This is the first conversation preview'
    },
    {
      id: 'conversation-2',
      lastMessageDate: '2023-01-02T12:00:00.000Z',
      preview: 'This is the second conversation preview'
    }
  ])
}));

// Import controller after mocks are set up
import * as historyController from '../../../get-history/controller.js';

describe('Get History Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      user: {
        id: 'user-123'
      }
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });
  
  it('should retrieve all conversations for the user', async () => {
    // Act
    await historyController.getHistory(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      conversations: [
        {
          id: 'conversation-1',
          lastMessageDate: '2023-01-01T12:00:00.000Z',
          preview: 'This is the first conversation preview'
        },
        {
          id: 'conversation-2',
          lastMessageDate: '2023-01-02T12:00:00.000Z',
          preview: 'This is the second conversation preview'
        }
      ]
    });
  });
}); 