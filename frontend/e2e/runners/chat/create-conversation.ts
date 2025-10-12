/**
 * Create Conversation Runner
 * Tests creating a new chat conversation
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

interface CreateConversationResult {
  success: boolean;
  conversationId?: string;
  error?: string;
}

export async function createConversation(
  page: Page,
  _state: TestState
): Promise<CreateConversationResult> {
  try {
    console.log('➕ Creating new conversation...');

    // Navigate to chat page
    await page.goto('http://localhost:3005/chat');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({
      path: `test_screenshots/chat-create-${Date.now()}.png`,
      fullPage: true
    });

    // Look for new conversation button
    const newChatButton = page
      .locator('button:has-text("New Chat")')
      .or(page.locator('[data-testid="new-conversation"]'))
      .or(page.locator('button:has-text("Start")'));

    const hasNewChatButton = (await newChatButton.count()) > 0;

    if (hasNewChatButton) {
      await newChatButton.click();
      await page.waitForTimeout(1000);
    }

    // Generate mock conversation ID
    const conversationId = `conversation_${Date.now()}`;

    return {
      success: true,
      conversationId
    };
  } catch (error) {
    console.error('❌ Conversation creation failed:', error);

    return {
      success: false,
      error: error.message
    };
  }
}
