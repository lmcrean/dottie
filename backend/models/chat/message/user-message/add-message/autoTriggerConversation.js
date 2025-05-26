import { createInitialMessage } from '../../chatbot-message/createInitialMessage.js';

/**
 * Auto-trigger initial conversation with default message
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {Object} assessmentData - Full assessment object with results (required)
 * @returns {Promise<Object>} - Initial conversation state
 */
export async function autoTriggerInitialConversation(conversationId, userId, assessmentData) {
  if (!assessmentData || typeof assessmentData !== 'object') {
    throw new Error('Assessment data is required - system error if missing');
  }
  
  // Create a detailed message with assessment context
  const { pattern, cycle_length, period_duration, pain_level, physical_symptoms, emotional_symptoms } = assessmentData;
  const defaultMessage = `Hi! I just completed my menstrual health assessment and got a ${pattern} pattern result. I'd like to discuss these results and get some guidance. Here's my assessment summary: cycle length is ${cycle_length} days, period duration is ${period_duration} days, pain level is ${pain_level}/10, and I experience symptoms like ${[...(physical_symptoms || []), ...(emotional_symptoms || [])].join(', ') || 'none reported'}.`;
    
  return await createInitialMessage(conversationId, userId, defaultMessage, assessmentData);
} 