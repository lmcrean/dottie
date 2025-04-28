# Chat Model Dependency Chain

This document lists the files that depend on the Chat model.

## Files in Sequence 🔗

### Controllers
1. `backend/routes/chat/send-message/controller.js` - Handles sending messages, creates conversations, and fetches conversation data
2. `backend/routes/chat/get-conversation/controller.js` - Retrieves a specific conversation
3. `backend/routes/chat/get-history/controller.js` - Gets the user's conversation history
4. `backend/routes/chat/delete-conversation/controller.js` - Deletes a conversation and its messages

### Routes
1. These controllers are used in corresponding route handlers in `backend/routes/chat/`

### Frontend API Integration
1. `frontend/src/api/message/requests/send/Request.ts` - Sends chat messages to the backend
2. `frontend/src/api/message/requests/send.ts` - Chat message request handlers
3. `frontend/src/api/message/index.ts` - Chat API client
4. `frontend/src/api/index.ts` - Exports chat types and API

### UI Components
1. `frontend/src/pages/chat/page.tsx` - Main chat interface
2. `frontend/src/pages/assessment/results/page.tsx` - Uses chat modals with assessment results
3. `frontend/src/test_page/test-endpoint-table/chat/services/ChatApiService.ts` - Testing service for chat functionality

### Testing
1. `frontend/src/api/message/__tests__/unit/chat.test.ts` - Unit tests for chat functionality
2. `frontend/src/test_page/test-endpoint-table/chat/__tests__/unit/ChatApiService.test.ts` - Tests for chat API service 