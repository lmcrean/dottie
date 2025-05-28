/**
 * Generate Assessment-Aware Test Messages for Integration Tests
 */

/**
 * Generate a test message that references assessment data
 * @returns {string} A random assessment-aware test message
 */
export function generateAssessmentAwareMessage() {
  const messages = [
    "Based on my recent assessment, can you provide personalized recommendations for my cycle?",
    "I just completed an assessment showing moderate pain levels. What can I do to manage this?",
    "My assessment indicates irregular cycles. Should I be concerned?",
    "According to my assessment, I experience heavy flow. What are some management strategies?",
    "The assessment shows I have several PMS symptoms. Can you help me understand what's normal?",
    "Can you explain my assessment results and what they mean for my health?",
    "I'd like to discuss the patterns identified in my assessment. What do you recommend?",
    "My assessment revealed some concerning symptoms. When should I see a doctor?"
  ];
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

/**
 * Generate a follow-up message that references assessment context
 * @returns {string} A random follow-up message for assessment-linked conversations
 */
export function generateAssessmentFollowUpMessage() {
  const messages = [
    "Can you explain how my specific cycle patterns compare to normal ranges?",
    "Based on my assessment data, what lifestyle changes would you recommend?",
    "Are there any red flags in my assessment that I should be aware of?",
    "How does my pain level compare to what other people experience?",
    "What supplements might help with the symptoms shown in my assessment?",
    "Should I track any additional symptoms beyond what was in my assessment?",
    "Can you provide more specific advice based on my assessment results?"
  ];
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
} 