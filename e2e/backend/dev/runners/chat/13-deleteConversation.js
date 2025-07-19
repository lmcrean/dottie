/**
 * Delete Conversation Utility for Integration Tests (Playwright)
 */

/**
 * Delete a conversation
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<boolean>} True if successfully deleted
 */
export async function deleteConversation(request, token, conversationId) {
  const response = await request.delete(`/api/chat/history/${conversationId}`, {
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

  if (response.status() !== 200) {
    throw new Error(`Failed to delete conversation: ${response.status()}`);
  }

  return true;
} 