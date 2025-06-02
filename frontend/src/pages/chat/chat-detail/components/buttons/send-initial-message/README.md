# Send Initial Message API

This component is actually rendered in the assessment page, not the chat page, but it's here as it's more relevant to the chat page functionality.

This component contains the API function for sending initial messages with assessment context.

## Endpoint

**POST** `/api/chat/:chatId/message/initial`

## Request Body

```typescript
{
  message: string; // The message content to send
  assessment_id: string; // Assessment ID for context
  is_initial: true; // Flag indicating this is an initial message
}
```

## Response

```typescript
{
  id: string;              // Unique message ID
  chat_id: string;         // ID of the chat this message belongs to
  role: 'user' | 'assistant'; // Role of the message sender
  content: string;         // Message content
  created_at: string;      // ISO timestamp of creation
  assessment_context?: {   // Optional assessment context
    assessment_id: string;
    pattern: string;
    key_findings: string[];
  };
}
```

## Usage

```typescript
import { sendInitialMessage } from './api/sendInitialMessage';

const response = await sendInitialMessage({
  chat_id: 'chat-123',
  assessment_id: 'assessment-456',
  message: 'Hi! I just completed my assessment and would like to discuss my results.'
});
```

## Error Handling

- Throws error if user is not authenticated
- Throws error if chat ID or assessment ID is invalid
- Throws error if API request fails
- All errors are logged to console with `[sendInitialMessage]` prefix
