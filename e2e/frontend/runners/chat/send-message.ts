/**
 * Send Message Runner
 * Tests sending a message in a chat conversation
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

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendMessage(page: Page, state: TestState, message: string): Promise<SendMessageResult> {
  try {
    console.log(`📨 Sending message: "${message}"`);
    
    // Look for message input
    const messageInput = page.locator('input[placeholder*="message"]').or(
      page.locator('textarea[placeholder*="message"]')
    ).or(
      page.locator('[data-testid="message-input"]')
    );
    
    const hasMessageInput = await messageInput.count() > 0;
    
    if (hasMessageInput) {
      await messageInput.fill(message);
      
      // Look for send button
      const sendButton = page.locator('button:has-text("Send")').or(
        page.locator('[data-testid="send-button"]')
      ).or(
        page.locator('button[type="submit"]')
      );
      
      const hasSendButton = await sendButton.count() > 0;
      
      if (hasSendButton) {
        await sendButton.click();
        await page.waitForTimeout(1000);
      } else {
        // Try pressing Enter
        await messageInput.press('Enter');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: `test_screenshots/chat-message-sent-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Generate mock message ID
      const messageId = `message_${Date.now()}`;
      
      return {
        success: true,
        messageId
      };
    }
    
    throw new Error('Message input not found');
    
  } catch (error) {
    console.error('❌ Message sending failed:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
} 