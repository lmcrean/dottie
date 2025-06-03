// Message APIs - Individual functions for backward compatibility
export { sendMessage, sendInitialMessage } from './api';
export type { 
  SendMessageRequest, 
  SendMessageResponse,
  SendInitialMessageRequest,
  SendInitialMessageResponse 
} from './api';

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
  useMessageSender,
  useMessageSending,
  useInputSender
} from './hooks'; 