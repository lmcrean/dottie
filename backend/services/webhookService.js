import logger from './logger.js';

/**
 * Webhook service for notifying external systems of conversation updates
 */
class WebhookService {
  constructor() {
    this.webhookEndpoints = [];
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Register a webhook endpoint
   * @param {string} url - Webhook URL
   * @param {string} event - Event type ('conversation.created', 'message.added', etc.)
   */
  registerWebhook(url, event) {
    this.webhookEndpoints.push({ url, event });
    logger.info(`Webhook registered: ${url} for event: ${event}`);
  }

  /**
   * Send webhook notification
   * @param {string} event - Event type
   * @param {Object} payload - Event payload
   */
  async sendWebhook(event, payload) {
    const relevantWebhooks = this.webhookEndpoints.filter(webhook => webhook.event === event);
    
    if (relevantWebhooks.length === 0) {
      logger.debug(`No webhooks registered for event: ${event}`);
      return;
    }

    const promises = relevantWebhooks.map(webhook => 
      this.deliverWebhook(webhook.url, event, payload)
    );

    await Promise.allSettled(promises);
  }

  /**
   * Deliver webhook with retry logic
   * @param {string} url - Webhook URL
   * @param {string} event - Event type
   * @param {Object} payload - Event payload
   */
  async deliverWebhook(url, event, payload, attempt = 1) {
    try {
      const webhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data: payload
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Dottie-Webhook/1.0'
        },
        body: JSON.stringify(webhookPayload),
        timeout: 5000 // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      logger.info(`Webhook delivered successfully to ${url} for event: ${event}`);
      return true;

    } catch (error) {
      logger.error(`Webhook delivery failed (attempt ${attempt}/${this.retryAttempts}) to ${url}:`, error);

      if (attempt < this.retryAttempts) {
        await this.delay(this.retryDelay * attempt);
        return this.deliverWebhook(url, event, payload, attempt + 1);
      }

      logger.error(`Webhook delivery permanently failed to ${url} after ${this.retryAttempts} attempts`);
      return false;
    }
  }

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Notify conversation created
   * @param {Object} conversationData - Conversation data
   */
  async notifyConversationCreated(conversationData) {
    await this.sendWebhook('conversation.created', conversationData);
  }

  /**
   * Notify message added
   * @param {Object} messageData - Message data
   */
  async notifyMessageAdded(messageData) {
    await this.sendWebhook('message.added', messageData);
  }

  /**
   * Notify conversation updated
   * @param {Object} conversationData - Updated conversation data
   */
  async notifyConversationUpdated(conversationData) {
    await this.sendWebhook('conversation.updated', conversationData);
  }
}

// Create singleton instance
const webhookService = new WebhookService();

// Load webhook endpoints from environment variables or config
if (process.env.WEBHOOK_CONVERSATION_CREATED) {
  webhookService.registerWebhook(process.env.WEBHOOK_CONVERSATION_CREATED, 'conversation.created');
}

if (process.env.WEBHOOK_MESSAGE_ADDED) {
  webhookService.registerWebhook(process.env.WEBHOOK_MESSAGE_ADDED, 'message.added');
}

if (process.env.WEBHOOK_CONVERSATION_UPDATED) {
  webhookService.registerWebhook(process.env.WEBHOOK_CONVERSATION_UPDATED, 'conversation.updated');
}

export default webhookService; 