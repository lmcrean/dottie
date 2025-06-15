# Send Message API

This directory contains the API function for sending follow-up messages in existing chat conversations.

## Endpoint

**POST** `/api/chat/:chatId/message`

## Request Body

```typescript
{
  message: string; // The message content to send
  conversationId?: string; // Optional conversation ID for context
}
```

## Response

```typescript
{
  id: string; // Unique message ID
  chat_id: string; // ID of the chat this message belongs to
  role: 'user' | 'assistant'; // Role of the message sender
  content: string; // Message content
  created_at: string; // ISO timestamp of creation
}
```

## Usage

```typescript
import { sendMessage } from './api/sendMessage';

const response = await sendMessage({
  chat_id: 'chat-123',
  message: 'This is my follow-up question about my results.'
});
```

## Behavior

- Saves the user message to the database with the conversation context
- Sends the message to the AI for a response
- Returns both user and AI messages
- Maintains conversation history for context
- Works both with and without environment variables (fallback to placeholder message)

## Error Handling

- Throws error if user is not authenticated
- Throws error if chat ID is invalid
- Throws error if API request fails
- All errors are logged to console with `[sendMessage]` prefix
