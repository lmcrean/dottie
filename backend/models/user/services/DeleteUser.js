import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ReadUser from './ReadUser.js';

/**
 * User deletion service with cascade cleanup
 */
class DeleteUser {
  /**
   * Delete a user and all related data
   * @param {string} userId - User ID to delete
   * @returns {Promise<object>} - Deletion result
   */
  static async deleteUser(userId) {
    try {
      // Check if user exists
      const user = await ReadUser.findById(userId, false);
      if (!user) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      // Perform cascade deletion
      const cascadeResult = await this.cascadeDelete(userId);
      if (!cascadeResult.success) {
        return cascadeResult;
      }

      // Delete the user
      const deleteResult = await DbService.delete(UserBase.getTableName(), userId);

      return {
        success: true,
        deletedUserId: userId,
        deletedData: cascadeResult.deletedData
      };

    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        errors: ['Failed to delete user']
      };
    }
  }

  /**
   * Perform cascade deletion of related data
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Cascade deletion result
   */
  static async cascadeDelete(userId) {
    const deletedData = {
      conversations: 0,
      chatMessages: 0,
      assessments: 0,
      periodLogs: 0,
      symptoms: 0
    };

    try {
      // 1. Find all conversations for this user
      const conversations = await DbService.findBy('conversations', 'user_id', userId);
      
      // 2. Delete all chat messages for each conversation
      for (const conversation of conversations) {
        try {
          const chatMessages = await DbService.findBy('chat_messages', 'conversation_id', conversation.id);
          deletedData.chatMessages += chatMessages.length;
          await DbService.delete('chat_messages', { conversation_id: conversation.id });
        } catch (error) {
          console.warn(`Error deleting chat messages for conversation ${conversation.id}:`, error);
        }
      }
      
      // 3. Delete all conversations for this user
      deletedData.conversations = conversations.length;
      await DbService.delete('conversations', { user_id: userId });
      
      // 4. Delete all assessments for this user
      try {
        const assessments = await DbService.findBy('assessments', 'user_id', userId);
        deletedData.assessments = assessments.length;
        await DbService.delete('assessments', { user_id: userId });
      } catch (error) {
        console.warn('Error deleting assessments:', error);
      }
      
      // 5. Delete all period logs for this user
      try {
        const periodLogs = await DbService.findBy('period_logs', 'user_id', userId);
        deletedData.periodLogs = periodLogs.length;
        await DbService.delete('period_logs', { user_id: userId });
      } catch (error) {
        console.warn('Error deleting period logs:', error);
      }
      
      // 6. Delete all symptoms for this user (if table exists)
      try {
        const symptoms = await DbService.findBy('symptoms', 'user_id', userId);
        deletedData.symptoms = symptoms.length;
        await DbService.delete('symptoms', { user_id: userId });
      } catch (error) {
        // Table might not exist, ignore the error
        console.warn('Error deleting symptoms (table may not exist):', error);
      }

      return {
        success: true,
        deletedData
      };

    } catch (error) {
      console.error('Error during cascade deletion:', error);
      return {
        success: false,
        errors: ['Failed to delete related data']
      };
    }
  }

  /**
   * Soft delete a user (mark as deleted without removing data)
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Soft deletion result
   */
  static async softDeleteUser(userId) {
    try {
      // Check if user exists
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      // Mark user as deleted
      const updatedUser = await DbService.update(
        UserBase.getTableName(), 
        userId, 
        { 
          deleted_at: new Date().toISOString(),
          email: `deleted_${Date.now()}_${userId}@deleted.com`, // Ensure email uniqueness
          username: `deleted_${Date.now()}_${userId}` // Ensure username uniqueness
        }
      );

      return {
        success: true,
        user: updatedUser,
        softDeletedUserId: userId
      };

    } catch (error) {
      console.error('Error soft deleting user:', error);
      return {
        success: false,
        errors: ['Failed to soft delete user']
      };
    }
  }

  /**
   * Get deletion preview (what would be deleted)
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Preview of what would be deleted
   */
  static async getDeletionPreview(userId) {
    try {
      // Check if user exists
      const user = await ReadUser.findById(userId, true);
      if (!user) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      const preview = {
        user: user,
        relatedData: {
          conversations: 0,
          chatMessages: 0,
          assessments: 0,
          periodLogs: 0,
          symptoms: 0
        }
      };

      // Count related data
      try {
        const conversations = await DbService.findBy('conversations', 'user_id', userId);
        preview.relatedData.conversations = conversations.length;

        // Count chat messages across all conversations
        for (const conversation of conversations) {
          try {
            const chatMessages = await DbService.findBy('chat_messages', 'conversation_id', conversation.id);
            preview.relatedData.chatMessages += chatMessages.length;
          } catch (error) {
            console.warn(`Error counting chat messages for conversation ${conversation.id}:`, error);
          }
        }

        const assessments = await DbService.findBy('assessments', 'user_id', userId);
        preview.relatedData.assessments = assessments.length;

        const periodLogs = await DbService.findBy('period_logs', 'user_id', userId);
        preview.relatedData.periodLogs = periodLogs.length;

        try {
          const symptoms = await DbService.findBy('symptoms', 'user_id', userId);
          preview.relatedData.symptoms = symptoms.length;
        } catch (error) {
          // Table might not exist
          preview.relatedData.symptoms = 0;
        }
      } catch (error) {
        console.warn('Error counting related data:', error);
      }

      return {
        success: true,
        preview
      };

    } catch (error) {
      console.error('Error getting deletion preview:', error);
      return {
        success: false,
        errors: ['Failed to get deletion preview']
      };
    }
  }
}

export default DeleteUser; 