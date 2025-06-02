// Message service and API
export { messageService } from './messageService';
export type { 
  SendMessageRequest, 
  SendMessageResponse,
  SendInitialMessageRequest,
  SendInitialMessageResponse 
} from './api';

// Message hooks
export { 
  useMessageState,
  useInputState,
  useMessageSender,
  useMessageSending,
  useInputSender
} from './hooks'; 