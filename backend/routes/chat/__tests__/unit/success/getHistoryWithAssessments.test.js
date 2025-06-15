import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getHistory } from '../../../get-history/controller.js';

// Mock the logger
vi.mock('../../../../../services/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock the chat model with enhanced conversation data
vi.mock('../../../../../models/chat/index.js', () => ({
  getUserConversations: vi.fn().mockResolvedValue([
    {
      id: 'conversation-1',
      last_message_date: '2023-01-01T12:00:00.000Z',
      preview: 'This is the first conversation preview',
      message_count: 5,
      assessment_id: 'assessment-123',
      assessment_pattern: 'regular_cycle',
      user_id: 'user-456'
    },
    {
      id: 'conversation-2',
      last_message_date: '2023-01-02T12:00:00.000Z',
      preview: 'This is the second conversation preview',
      message_count: 3,
      assessment_id: null,
      assessment_pattern: null,
      user_id: 'user-456'
    },
    {
      id: 'conversation-3',
      last_message_date: '2023-01-03T12:00:00.000Z',
      preview: 'Assessment-linked conversation',
      message_count: 8,
      assessment_id: 'assessment-789',
      assessment_pattern: 'irregular_cycle',
      user_id: 'user-456'
    }
  ])
}));

describe('getHistory with Assessment Fields', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        userId: 'user-456'
      }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return conversations with all assessment fields', async () => {
    await getHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      conversations: [
        {
          id: 'conversation-1',
          last_message_date: '2023-01-01T12:00:00.000Z',
          preview: 'This is the first conversation preview',
          message_count: 5,
          assessment_id: 'assessment-123',
          assessment_pattern: 'regular_cycle',
          user_id: 'user-456'
        },
        {
          id: 'conversation-2',
          last_message_date: '2023-01-02T12:00:00.000Z',
          preview: 'This is the second conversation preview',
          message_count: 3,
          assessment_id: null,
          assessment_pattern: null,
          user_id: 'user-456'
        },
        {
          id: 'conversation-3',
          last_message_date: '2023-01-03T12:00:00.000Z',
          preview: 'Assessment-linked conversation',
          message_count: 8,
          assessment_id: 'assessment-789',
          assessment_pattern: 'irregular_cycle',
          user_id: 'user-456'
        }
      ]
    });
  });

  it('should include conversations both with and without assessment links', async () => {
    await getHistory(req, res);

    const responseData = res.json.mock.calls[0][0];
    const conversations = responseData.conversations;

    // Check that we have conversations with assessment links
    const withAssessments = conversations.filter(conv => conv.assessment_id);
    expect(withAssessments).toHaveLength(2);

    // Check that we have conversations without assessment links  
    const withoutAssessments = conversations.filter(conv => !conv.assessment_id);
    expect(withoutAssessments).toHaveLength(1);

    // Verify all conversations have user_id
    conversations.forEach(conv => {
      expect(conv.user_id).toBe('user-456');
    });
  });

  it('should maintain all required fields for each conversation', async () => {
    await getHistory(req, res);

    const responseData = res.json.mock.calls[0][0];
    const conversations = responseData.conversations;

    conversations.forEach(conversation => {
      // Core required fields
      expect(conversation).toHaveProperty('id');
      expect(conversation).toHaveProperty('last_message_date');
      expect(conversation).toHaveProperty('preview');
      expect(conversation).toHaveProperty('message_count');
      expect(conversation).toHaveProperty('user_id');
      
      // Assessment fields (can be null)
      expect(conversation).toHaveProperty('assessment_id');
      expect(conversation).toHaveProperty('assessment_pattern');
      
      // Type checks
      expect(typeof conversation.id).toBe('string');
      expect(typeof conversation.last_message_date).toBe('string');
      expect(typeof conversation.preview).toBe('string');
      expect(typeof conversation.message_count).toBe('number');
      expect(typeof conversation.user_id).toBe('string');
    });
  });
}); 