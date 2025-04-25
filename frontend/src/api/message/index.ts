import { sendMessage, getHistory, getConversation, deleteConversation } from './requests';

// Export types
export * from './types';

// Export individual endpoints
export { sendMessage, getHistory, getConversation, deleteConversation };

// Chat API object for backward compatibility
export const chatApi = {
  sendMessage,
  getHistory,
  getConversation,
  deleteConversation,
};

export default chatApi;
