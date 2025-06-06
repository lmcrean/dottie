// Message APIs - Individual functions for backward compatibility
export { sendMessage, sendInitialMessage } from './messageService';
export type { 
  SendMessageRequest, 
  SendMessageResponse,
  SendInitialMessageRequest,
  SendInitialMessageResponse 
} from './messageService';

// Unified Message Service - New consolidated service
export { default as messageService, sendMessageGeneric } from './messageService';
export type {
  BaseMessageRequest,
  BaseMessageResponse,
  FollowUpMessageRequest,
  FollowUpMessageResponse,
  InitialMessageRequest,
  InitialMessageResponse
} from './messageService';

// Message hooks
export { 
  useMessageState,
  useInputState,
  useMessageSender
} from './hooks'; 