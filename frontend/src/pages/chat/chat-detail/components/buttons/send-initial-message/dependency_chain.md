# Dependency Chain: Chat Creation and Data Flow

## POST Flow (Chat Creation)

**User Journey: Click "Chat with Dottie" → Create Chat & Send Initial Message**

1. `frontend/src/pages/chat/chat-detail/components/buttons/send-initial-message/SendInitialMessageButton.tsx` - **User clicks "Chat with Dottie" button**
2. `frontend/src/pages/chat/sidebar/api/create-new/api/createNewChat.ts` - Create new chat (POST request)
3. `frontend/src/pages/chat/chat-detail/components/buttons/send-initial-message/api/sendInitialMessage.ts` - Send first message (POST request)
4. `backend/routes/chat/create/controller.js` - Process chat creation
5. `backend/routes/chat/message/controller.js` - Process initial message

## GET Flow (Chat Loading & Data Display)

**Final Interface: User receives responses in chat**

6. `frontend/src/pages/chat/chat-detail/FullScreenChat.tsx` - **Display chat interface (final destination)**
7. `frontend/src/pages/chat/chat-detail/hooks/useChatState.ts` - Fetch conversation history (GET request)
8. `frontend/src/pages/chat/chat-detail/components/AssessmentDataDisplay.tsx` - Load assessment details (GET request)

## Core Infrastructure

9. `frontend/src/api/core/apiClient.ts` - HTTP client for API calls
10. `frontend/src/api/core/tokenManager.ts` - User authentication
11. `frontend/src/pages/assessment/steps/context/types/recommendations.ts` - Pattern data definitions
