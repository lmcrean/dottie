/**
 * Generate Test Message Utility for Integration Tests
 */

/**
 * Generate a sample chat message
 * @returns {string} A random test message
 */
export function generateTestMessage() {
  const messages = [
    "Hello, how can you help me with my period health?",
    "I've been experiencing severe cramps lately",
    "Can you provide advice on managing PMS symptoms?",
    "What are some natural remedies for menstrual pain?",
    "I'd like to track my cycle, what information should I record?"
  ];
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
} 