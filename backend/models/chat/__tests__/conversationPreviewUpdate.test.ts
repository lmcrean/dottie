import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { insertChatMessage } from '../message/1-user-message/add-message/database/sendUserMessage.js';
import DbService from '../../../services/dbService.js';

// Mock DbService
vi.mock('../../../services/dbService.js', () => ({
  default: {
    create: vi.fn(),
    updateWhere: vi.fn()
  }
}));

describe('Conversation Preview Update', () => {
  const mockConversationId = 'conv-123';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should not update conversation preview when inserting a user message', async () => {
    // Mock message data
    const mockUserMessage = {
      id: 'msg-123',
      role: 'user',
      content: 'This is a test message from the user',
      created_at: new Date().toISOString()
    };

    // Mock successful message insertion
    DbService.create.mockResolvedValue(mockUserMessage);

    // Call the function
    await insertChatMessage(mockConversationId, mockUserMessage);

    // Assert create was called correctly
    expect(DbService.create).toHaveBeenCalledWith('chat_messages', {
      ...mockUserMessage,
      conversation_id: mockConversationId
    });

    // Assert updateWhere was NOT called for user messages
    expect(DbService.updateWhere).not.toHaveBeenCalled();
  });

  it('should update conversation preview when inserting an assistant message', async () => {
    // Mock assistant message data
    const mockAssistantMessage = {
      id: 'msg-456',
      role: 'assistant',
      content: 'This is a response from the assistant',
      created_at: new Date().toISOString()
    };

    // Mock successful message insertion
    DbService.create.mockResolvedValue(mockAssistantMessage);
    DbService.updateWhere.mockResolvedValue([{ id: mockConversationId, preview: 'This is a response from the assistant' }]);

    // Call the function
    await insertChatMessage(mockConversationId, mockAssistantMessage);

    // Assert create was called correctly
    expect(DbService.create).toHaveBeenCalledWith('chat_messages', {
      ...mockAssistantMessage,
      conversation_id: mockConversationId
    });

    // Assert updateWhere was called to update the preview for assistant messages
    expect(DbService.updateWhere).toHaveBeenCalledWith(
      'conversations',
      { id: mockConversationId },
      expect.objectContaining({
        preview: 'This is a response from the assistant',
        updated_at: expect.any(String)
      })
    );
  });

  it('should truncate long messages in the preview', async () => {
    // Mock message with very long content
    const longContent = 'This is a very long message that should be truncated when set as the preview. It contains more than fifty characters which is our arbitrary limit for preview length.';
    const mockLongMessage = {
      id: 'msg-456',
      role: 'assistant',
      content: longContent,
      created_at: new Date().toISOString()
    };

    // Expected truncated preview (50 chars + ellipsis)
    const expectedPreview = 'This is a very long message that should be truncated...';

    // Mock successful operations
    DbService.create.mockResolvedValue(mockLongMessage);
    DbService.updateWhere.mockResolvedValue([{ id: mockConversationId, preview: expectedPreview }]);

    // Call the function
    await insertChatMessage(mockConversationId, mockLongMessage);

    // Assert the preview was properly truncated
    expect(DbService.updateWhere).toHaveBeenCalledWith(
      'conversations',
      { id: mockConversationId },
      expect.objectContaining({
        preview: expect.stringContaining('This is a very long message'),
        updated_at: expect.any(String)
      })
    );
    
    // Check truncation
    const updateCall = DbService.updateWhere.mock.calls[0][2];
    expect(updateCall.preview.length).toBeLessThanOrEqual(53); // 50 chars + "..."
    expect(updateCall.preview.endsWith('...')).toBe(true);
  });

  it('should handle empty message content gracefully', async () => {
    // Mock message with empty content
    const mockEmptyMessage = {
      id: 'msg-789',
      role: 'assistant', // Must be assistant to update preview
      content: '',
      created_at: new Date().toISOString()
    };

    // Mock successful operations
    DbService.create.mockResolvedValue(mockEmptyMessage);
    DbService.updateWhere.mockResolvedValue([{ id: mockConversationId, preview: '' }]);

    // Call the function
    await insertChatMessage(mockConversationId, mockEmptyMessage);

    // Assert create was called
    expect(DbService.create).toHaveBeenCalledWith('chat_messages', {
      ...mockEmptyMessage,
      conversation_id: mockConversationId
    });

    // For empty content assistant messages, still update the preview to empty
    expect(DbService.updateWhere).toHaveBeenCalledWith(
      'conversations',
      { id: mockConversationId },
      expect.objectContaining({
        preview: '',
        updated_at: expect.any(String)
      })
    );
  });
}); 