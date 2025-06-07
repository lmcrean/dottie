# Conversation API Layer

This directory contains HTTP communication logic for conversation-related operations with the backend.

## Architecture

The API layer provides a clean interface between the frontend services and backend endpoints:
- **Direct HTTP Calls**: Using apiClient for authenticated requests
- **Error Handling**: Axios error processing and graceful failures
- **Type Safety**: Strongly typed request/response interfaces
- **Response Transformation**: Converting backend data to frontend types

## Files

### `conversationApi.ts`
Core API functions for conversation operations:

**Main Functions:**
- `fetchConversation(conversationId: string)` - Get conversation data and messages

**Key Features:**
- Handles 404 responses gracefully (returns null)
- Converts conversationId to string for API compatibility
- Includes assessment data when available
- Full error logging and propagation

**Response Types:**
```typescript
interface ConversationResponse {
  id: string;
  messages: ApiMessage[];
  assessment_id?: string;
  assessment_object?: AssessmentData;
}
```

### `index.ts`
Export aggregation for API functions:
- `conversationApi` - Main API object with all conversation endpoints

## Usage Pattern

```typescript
import { conversationApi } from './api';

// Fetch conversation data
try {
  const conversation = await conversationApi.fetchConversation('conv-123');
  if (conversation) {
    // Handle successful load
    console.log('Messages:', conversation.messages);
  } else {
    // Handle 404 - conversation not found
    console.log('Conversation not found');
  }
} catch (error) {
  // Handle other errors (network, auth, etc.)
  console.error('Failed to load conversation:', error);
}
```

## Error Handling Strategy

1. **404 Errors**: Return `null` instead of throwing (conversation not found)
2. **Network Errors**: Throw error for upstream handling
3. **Auth Errors**: Throw error for auth system to handle
4. **Unknown Errors**: Log and throw for debugging

## Backend Endpoints

- `GET /api/chat/history/:conversationId` - Fetch conversation with messages

## Dependencies

- `apiClient` - Authenticated HTTP client from core API
- `axios` - For error type checking and handling
- Type definitions from `../../../types` for response interfaces

## Testing

See `__tests__/conversationApi.test.ts` for comprehensive unit tests covering:
- Successful conversation fetching
- 404 error handling
- Network error handling
- Parameter conversion 