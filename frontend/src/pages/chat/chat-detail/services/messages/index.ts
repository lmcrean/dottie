// Message APIs
export { sendMessage, sendInitialMessage } from './api';
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