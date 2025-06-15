import DbService from "../../../services/dbService.js";
import {
  decryptMessage,
  isLikelyEncrypted,
} from "../../../services/encryptionUtils.js";
import logger from "../../../services/logger.js";

/**
 * Get all conversations for a user (with preview of last message)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of conversations
 */
export const getUserConversations = async (userId, decryptedUserKeyBuffer) => {
  try {
    console.log(
      `[getUserConversations] Starting with userId: ${userId}, type: ${typeof userId}`
    );

    const conversations = await DbService.getConversationsWithPreviews(userId, decryptedUserKeyBuffer);

    console.log(
      `[getUserConversations] DbService.getConversationsWithPreviews returned:`,
      conversations
    );

    // Handle null or undefined results
    if (!conversations) {
      console.log(
        `[getUserConversations] No conversations returned, returning empty array`
      );
      return [];
    }

    console.log(
      `[getUserConversations] Processing ${conversations.length} conversations`
    );

    const decryptedpreview = (preview) => {
      // Check if the preview string is likely encrypted for legacy compatibility
      if (isLikelyEncrypted(preview)) {
        try {
          return decryptMessage(decryptedUserKeyBuffer, preview);
        } catch (decryptError) {
          logger.warn(`[getUserConversations] Failed to decrypt preview for conversation. Returning original. Error: ${decryptError.message}`);
          return preview;
        }
      }
      return preview;
    };

    const result = conversations.map((conversation) => ({
      id: conversation.id,
      last_message_date: conversation.last_message_date,
      preview: conversation.preview
        ? decryptedpreview(conversation.preview) +
          (decryptedpreview(conversation.preview).length >= 50 ? "..." : "")
        : "No messages yet",
      message_count: conversation.message_count || 0,
      assessment_id: conversation.assessment_id,
      assessment_pattern: conversation.assessment_pattern,
      user_id: conversation.user_id,
    }));

    console.log(
      `[getUserConversations] Final result:`,
      JSON.stringify(result, null, 2)
    );
    return result;
  } catch (error) {
    logger.error(
      "[getUserConversations] Error getting user conversations:",
      error
    );
    console.error("[getUserConversations] Detailed error:", {
      message: error.message,
      stack: error.stack,
      userId: userId,
      userIdType: typeof userId,
    });
    throw error;
  }
};
