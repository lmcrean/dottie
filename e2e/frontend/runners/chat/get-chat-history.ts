/**
 * Chat History Runner
 * Tests getting chat history/conversation list
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

interface ChatHistoryResult {
  success: boolean;
  conversationCount: number;
  error?: string;
}

export async function getChatHistory(page: Page, state: TestState): Promise<ChatHistoryResult> {
  try {
    console.log('📜 Getting chat history...');
    
    // Navigate to chat history page
    await page.goto('http://localhost:3005/chat/history');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ 
      path: `test_screenshots/chat-history-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Look for chat history elements
    const historyContainer = page.locator('[data-testid="chat-history"]').or(
      page.locator('.chat-history')
    ).or(
      page.locator('h1:has-text("Chat")')
    );
    
    // Count conversations
    const conversationItems = page.locator('[data-testid="conversation-item"]').or(
      page.locator('.conversation-item')
    );
    
    const conversationCount = await conversationItems.count();
    console.log(`Found ${conversationCount} conversations`);
    
    return {
      success: true,
      conversationCount
    };
    
  } catch (error) {
    console.error('❌ Chat history failed:', error);
    
    return {
      success: false,
      conversationCount: 0,
      error: error.message
    };
  }
} 