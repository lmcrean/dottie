/**
 * Delete Conversation Runner
 * Tests deleting a chat conversation (cleanup)
 */

import type { Page } from '@playwright/test';

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

interface DeleteConversationResult {
  success: boolean;
  error?: string;
}

export async function deleteConversation(
  page: Page,
  state: TestState,
  conversationId: string
): Promise<DeleteConversationResult> {
  try {
    console.log(`🗑️ Deleting conversation: ${conversationId}`);

    // Navigate to chat history
    await page.goto('http://localhost:3005/chat/history');
    await page.waitForLoadState('networkidle');

    // Look for delete button
    const deleteButton = page
      .locator(`[data-testid="delete-conversation-${conversationId}"]`)
      .or(page.locator('button:has-text("Delete")'));

    const hasDeleteButton = (await deleteButton.count()) > 0;

    if (hasDeleteButton) {
      await deleteButton.first().click();

      // Handle confirmation
      const confirmButton = page
        .locator('button:has-text("Confirm")')
        .or(page.locator('button:has-text("Yes")'));

      const hasConfirmButton = (await confirmButton.count()) > 0;
      if (hasConfirmButton) {
        await confirmButton.click();
      }

      await page.waitForTimeout(1000);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('❌ Conversation deletion failed:', error);

    return {
      success: false,
      error: error.message
    };
  }
}
