/**
 * Mock data for message flow dialogue integration tests
 */

export const messageFlowTestData = {
  mockUserId: 'test-user-123',
  mockConversationId: 'test-conversation-789',
  mockUserMessageId: 'msg-user-456',
  mockAssistantMessageId: 'msg-assistant-789',
  
  mockUserMessage: {
    id: 'msg-user-456',
    conversation_id: 'test-conversation-789',
    role: 'user',
    content: 'How can I manage my irregular periods better?',
    user_id: 'test-user-123',
    created_at: '2024-01-15T10:00:00.000Z'
  },

  mockAssistantMessage: {
    id: 'msg-assistant-789',
    conversationId: 'test-conversation-789',
    role: 'assistant',
    content: 'Based on your irregular period pattern, I recommend tracking your cycle...',
    created_at: '2024-01-15T10:01:00.000Z',
    parent_message_id: 'msg-user-456'
  },

  mockConversation: {
    id: 'test-conversation-789',
    user_id: 'test-user-123',
    messages: [
      {
        id: 'msg-user-456',
        role: 'user',
        content: 'How can I manage my irregular periods better?',
        created_at: '2024-01-15T10:00:00.000Z'
      },
      {
        id: 'msg-assistant-789',
        role: 'assistant', 
        content: 'Based on your irregular period pattern, I recommend tracking your cycle...',
        created_at: '2024-01-15T10:01:00.000Z'
      }
    ],
    created_at: '2024-01-15T09:30:00.000Z'
  }
}; 