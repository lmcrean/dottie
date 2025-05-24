# Create New Chat API

This directory contains the API function for creating new chat conversations.

## Endpoint

**POST** `/api/chat`

## Request Body

```typescript
{
  assessment_id?: string;  // Optional assessment ID to link the chat
  initial_message?: string; // Optional initial message content
}
```

## Response

```typescript
{
  id: string;              // Unique chat ID
  user_id: string;         // ID of the user who created the chat
  assessment_id?: string;  // Assessment ID if provided
  created_at: string;      // ISO timestamp of creation
  updated_at: string;      // ISO timestamp of last update
}
```

## Usage

```typescript
import { createNewChat } from './api/createNewChat';

// Create a basic chat
const chat = await createNewChat();

// Create a chat linked to an assessment
const chatWithAssessment = await createNewChat({
  assessment_id: 'assessment-123',
  initial_message: 'Hi! I just completed my assessment.'
});
```

## Error Handling

- Throws error if user is not authenticated
- Throws error if API request fails
- All errors are logged to console with `[createNewChat]` prefix
