import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ReadUser from './ReadUser.js';
import type { UserRecord, DeletionPreview, OperationResult } from '../types.js';

interface CascadeDeleteResult {
  success: boolean;
  deletedData?: {
    conversations: number;
    chatMessages: number;
    assessments: number;
    periodLogs: number;
    symptoms: number;
  };
  errors?: string[];
}

/**
 * User deletion service with cascade cleanup
 */
class DeleteUser {
  static async deleteUser(userId: string): Promise<OperationResult<{ deletedUserId: string; deletedData: any }>> {
    try {
      const user = await ReadUser.findById(userId, false);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const cascadeResult = await this.cascadeDelete(userId);
      if (!cascadeResult.success) {
        return { success: false, error: cascadeResult.errors?.join(', ') || 'Cascade deletion failed' };
      }

      await DbService.delete(UserBase.getTableName(), userId);

      return {
        success: true,
        data: {
          deletedUserId: userId,
          deletedData: cascadeResult.deletedData
        }
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

  static async cascadeDelete(userId: string): Promise<CascadeDeleteResult> {
    const deletedData = {
      conversations: 0,
      chatMessages: 0,
      assessments: 0,
      periodLogs: 0,
      symptoms: 0
    };

    try {
      const conversations = await DbService.findBy('conversations', 'user_id', userId);

      for (const conversation of conversations) {
        try {
          const chatMessages = await DbService.findBy('chat_messages', 'conversation_id', conversation.id);
          deletedData.chatMessages += chatMessages.length;
          await DbService.delete('chat_messages', { conversation_id: conversation.id });
        } catch (error) {
          console.warn(`Error deleting chat messages for conversation ${conversation.id}:`, error);
        }
      }

      deletedData.conversations = conversations.length;
      await DbService.delete('conversations', { user_id: userId });

      try {
        const assessments = await DbService.findBy('assessments', 'user_id', userId);
        deletedData.assessments = assessments.length;
        await DbService.delete('assessments', { user_id: userId });
      } catch (error) {
        console.warn('Error deleting assessments:', error);
      }

      try {
        const periodLogs = await DbService.findBy('period_logs', 'user_id', userId);
        deletedData.periodLogs = periodLogs.length;
        await DbService.delete('period_logs', { user_id: userId });
      } catch (error) {
        console.warn('Error deleting period logs:', error);
      }

      try {
        const symptoms = await DbService.findBy('symptoms', 'user_id', userId);
        deletedData.symptoms = symptoms.length;
        await DbService.delete('symptoms', { user_id: userId });
      } catch (error) {
        console.warn('Error deleting symptoms (table may not exist):', error);
      }

      return { success: true, deletedData };
    } catch (error: any) {
      console.error('Error during cascade deletion:', error);
      return { success: false, errors: ['Failed to delete related data'] };
    }
  }

  static async softDeleteUser(userId: string): Promise<OperationResult<{ softDeletedUserId: string; user: any }>> {
    try {
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = await DbService.update<UserRecord>(
        UserBase.getTableName(),
        userId,
        {
          deleted_at: new Date().toISOString(),
          email: `deleted_${Date.now()}_${userId}@deleted.com`,
          username: `deleted_${Date.now()}_${userId}`
        }
      );

      return {
        success: true,
        data: {
          user: updatedUser,
          softDeletedUserId: userId
        }
      };
    } catch (error: any) {
      console.error('Error soft deleting user:', error);
      return { success: false, error: 'Failed to soft delete user' };
    }
  }

  static async getDeletionPreview(userId: string): Promise<OperationResult<any>> {
    try {
      const user = await ReadUser.findById(userId, true);
      if (!user) {
        return { success: false, error: 'User not found' };
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

      try {
        const conversations = await DbService.findBy('conversations', 'user_id', userId);
        preview.relatedData.conversations = conversations.length;

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
          preview.relatedData.symptoms = 0;
        }
      } catch (error) {
        console.warn('Error counting related data:', error);
      }

      return { success: true, data: preview };
    } catch (error: any) {
      console.error('Error getting deletion preview:', error);
      return { success: false, error: 'Failed to get deletion preview' };
    }
  }
}

export default DeleteUser;
