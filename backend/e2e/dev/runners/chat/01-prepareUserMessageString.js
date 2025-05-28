/**
 * Prepares user message content for chat testing
 * Uses centralized utility functions for message generation
 */

import { 
    getTestUserMessage, 
    getRandomTestUserMessage, 
    prepareUserMessageStrings 
} from './utils/userMessageString.js';

// Re-export utility functions for backward compatibility
export { 
    getTestUserMessage, 
    getRandomTestUserMessage, 
    prepareUserMessageStrings 
}; 