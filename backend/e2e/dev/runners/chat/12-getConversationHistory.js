/**
 * Get Conversation History Utility for Integration Tests (Playwright)
 */

/**
 * Get all conversations for a user
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of conversations
 */
export async function getConversationHistory(request, token) {
  const response = await request.get("/api/chat/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  let responseText;
  try {
    responseText = await response.text();
  } catch (error) {
    console.error("Failed to get response text:", error);
  }

  let result;
  try {
    if (responseText) {
      result = JSON.parse(responseText);
    }
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error(`Failed to parse conversation history response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to get conversation history: ${response.status()}`);
  }
  
  // Log conversation details for debugging, especially in prod tests
  const prodEnv = process.env.NODE_ENV === 'production' || process.env.TEST_ENV === 'prod';
  const testType = prodEnv ? 'PROD' : 'DEV';
  
  console.log(`\n[${testType}] Conversation History Retrieved - Count: ${result.conversations?.length || 0}`);
  if (result.conversations && result.conversations.length > 0) {
    result.conversations.forEach((conv, index) => {
      console.log(`\n[${testType}] Conversation ${index + 1}/${result.conversations.length}:`);
      console.log(`[${testType}] ID: ${conv.id}`);
      console.log(`[${testType}] Assessment ID: ${conv.assessment_id}`);
      console.log(`[${testType}] Preview: "${conv.preview || 'null'}"`);
      console.log(`[${testType}] Message Count: ${conv.message_count || 0}`);
      console.log(`[${testType}] Last Message Date: ${conv.last_message_date || 'unknown'}`);
    });
    console.log('\n');
  }

  return result.conversations || [];
} 