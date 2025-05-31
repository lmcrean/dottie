/**
 * Updates the conversation preview with content from the latest assistant message
 * @param {Object} db - Database instance
 * @param {string} conversationId - ID of the conversation to update
 * @param {string} messageContent - Content of the assistant message to use for preview
 * @returns {Promise<boolean>} - Success status
 */
export const updateConversationPreview = async (db, conversationId, messageContent) => {
  try {
    console.log(`[updateConversationPreview] Updating preview for conversation: ${conversationId}`);
    
    // Generate preview - truncate to reasonable length and add ellipsis
    const previewMaxLength = 50;
    let preview = messageContent;
    if (preview.length > previewMaxLength) {
      preview = preview.substring(0, previewMaxLength) + '...';
    }
    
    console.log(`[updateConversationPreview] New preview: "${preview}"`);
    
    // Update conversation with new preview
    const result = await db.updateWhere(
      'conversations',
      { id: conversationId },
      { 
        preview,
        updated_at: new Date().toISOString()
      }
    );
    
    console.log(`[updateConversationPreview] Update result:`, result);
    return true;
  } catch (error) {
    console.error(`[updateConversationPreview] Error updating preview: ${error.message}`);
    return false;
  }
};
