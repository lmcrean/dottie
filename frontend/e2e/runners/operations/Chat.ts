/**
 * Chat Operations Controller
 *
 * This controller orchestrates all chat-related test operations
 * It delegates to specific chat runners for different actions
 */

import type { Page } from '@playwright/test';

// Import specific chat runners (these will be created)
import { getChatHistory } from '../chat/get-chat-history';
import { createConversation } from '../chat/create-conversation';
import { sendMessage } from '../chat/send-message';
import { deleteConversation } from '../chat/delete-conversation';

interface TestState {
  userId: string | null;
  username: string;
  email: string;
  password: string;
  authToken: string | null;
  assessmentIds: string[];
  conversationId: string | null;
  screenshotCount: number;
}

interface ChatOperationResult {
  success: boolean;
  conversationId: string | null;
  error?: string;
}

export class ChatOperations {
  private page: Page;
  private state: TestState;

  constructor(page: Page, state: TestState) {
    this.page = page;
    this.state = state;
  }

  /**
   * Run the complete chat operation flow
   * 1. Get chat history
   * 2. Create new conversation
   * 3. Send messages
   * 4. View conversation details
   */
  async runCompleteFlow(): Promise<ChatOperationResult> {
    try {
      console.log('💬 Starting Chat Operations Flow...');

      // Step 1: Get chat history
      console.log('📜 Step 1: Getting chat history...');
      const historyResult = await getChatHistory(this.page, this.state);
      if (!historyResult.success) {
        throw new Error(`Chat history failed: ${historyResult.error}`);
      }
      console.log('✅ Chat history retrieved successfully');

      // Step 2: Create new conversation
      console.log('➕ Step 2: Creating new conversation...');
      const createResult = await createConversation(this.page, this.state);
      if (!createResult.success) {
        throw new Error(`Conversation creation failed: ${createResult.error}`);
      }

      // Update state with new conversation ID
      this.state.conversationId = createResult.conversationId;
      console.log('✅ Conversation created successfully');

      // Step 3: Send messages
      console.log('📨 Step 3: Sending messages...');
      const messageResult = await sendMessage(
        this.page,
        this.state,
        'Hello, this is a test message from the automated test suite.'
      );
      if (!messageResult.success) {
        throw new Error(`Message sending failed: ${messageResult.error}`);
      }
      console.log('✅ Messages sent successfully');

      console.log('🎉 Chat Operations Flow completed successfully!');

      return {
        success: true,
        conversationId: this.state.conversationId
      };
    } catch (error) {
      console.error('❌ Chat Operations Flow failed:', error);

      return {
        success: false,
        conversationId: this.state.conversationId,
        error: error.message
      };
    }
  }

  /**
   * Cleanup chat resources
   */
  async cleanup(): Promise<void> {
    console.log('🗑️ Cleaning up chat resources...');

    if (this.state.conversationId) {
      try {
        await deleteConversation(this.page, this.state, this.state.conversationId);
        console.log(`✅ Deleted conversation: ${this.state.conversationId}`);
        this.state.conversationId = null;
      } catch (error) {
        console.error(`❌ Failed to delete conversation ${this.state.conversationId}:`, error);
      }
    }
  }
}
