// APIs
export { conversationApi } from './conversation';
export { sendMessage, sendInitialMessage, messageService, sendMessageGeneric } from './messages';

// Message types - Legacy exports for backward compatibility
export type { 
  SendMessageRequest, 
  SendMessageResponse,
  SendInitialMessageRequest,
  SendInitialMessageResponse 
} from './messages';

// New unified message types
export type {
  BaseMessageRequest,
  BaseMessageResponse,
  FollowUpMessageRequest,
  FollowUpMessageResponse,
  InitialMessageRequest,
  InitialMessageResponse
} from './messages';

// Main orchestration hook
export { useConversationPageState } from './conversation/hooks/useConversationPageState';

// Message hooks
export { 
  useMessageState,
  useInputState,
  useMessageSender
} from './messages';

// Conversation hooks
export { useConversationData } from './conversation/hooks/data/useConversationData';
export { useConversationState } from './conversation/hooks/data/useConversationState';
export { useConversationLoader } from './conversation/hooks/data/useConversationLoader';
export { useConversationNavigation } from './conversation/hooks/navigation/useConversationNavigation';

// Types
export type { UseChatPageStateProps, UseChatPageStateReturn, ChatState } from '../types';
