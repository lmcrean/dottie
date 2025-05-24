import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="POST"
      endpoint="/api/chat/send"
      expectedOutput={{
        message: 'AI response message',
        conversationId: 'conversation-id'
      }}
      requiresAuth={true}
      requiresParams={true}
      inputFields={[
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          required: true,
          placeholder: 'Enter your message to the AI'
        },
        {
          name: 'conversationId',
          label: 'Conversation ID (optional)',
          type: 'text',
          placeholder: 'Leave empty for a new conversation'
        }
      ]}
    />
  );
}
