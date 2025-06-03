// Import from the new unified service
export { sendMessage, sendInitialMessage } from '../messageService';
export type { 
  SendMessageRequest, 
  SendMessageResponse,
  SendInitialMessageRequest,
  SendInitialMessageResponse,
  // Export new base types as well
  BaseMessageRequest,
  BaseMessageResponse,
  FollowUpMessageRequest,
  FollowUpMessageResponse,
  InitialMessageRequest,
  InitialMessageResponse
} from '../messageService'; 