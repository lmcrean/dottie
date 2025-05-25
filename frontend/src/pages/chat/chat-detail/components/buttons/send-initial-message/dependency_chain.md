# Dependency Chain: Assessment to Chat Files

## POST Flow (Assessment → Chat Creation)

1. `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts` - Submit assessment data
2. `backend/routes/assessment/create/controller.js` - Process assessment submission
3. `frontend/src/pages/chat/sidebar/api/create-new/api/createNewChat.ts` - Create new chat
4. `frontend/src/pages/chat/chat-detail/components/buttons/send-initial-message/api/sendInitialMessage.ts` - Send first message
5. `frontend/src/pages/chat/chat-detail/components/buttons/send-initial-message/SendInitialMessageButton.tsx` - Orchestrate the flow

## GET Flow (Chat Loading)

6. `frontend/src/pages/chat/chat-detail/hooks/useChatState.ts` - Fetch conversation history
7. `frontend/src/pages/chat/chat-detail/components/AssessmentDataDisplay.tsx` - Load assessment details
8. `frontend/src/pages/chat/chat-detail/FullScreenChat.tsx` - Display chat interface

## Core Infrastructure

9. `frontend/src/api/core/apiClient.ts` - HTTP client for API calls
10. `frontend/src/api/core/tokenManager.ts` - User authentication
11. `frontend/src/pages/assessment/steps/context/types/recommendations.ts` - Pattern data definitions
