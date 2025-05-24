import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/chat/history"
      expectedOutput={{
        conversations: [
          {
            id: 'conversation-1',
            lastMessageDate: '2023-06-15T10:30:00Z',
            preview: 'Hello, can you help with...'
          },
          {
            id: 'conversation-2',
            lastMessageDate: '2023-06-16T14:20:00Z',
            preview: "I'm having trouble with..."
          }
        ]
      }}
      requiresAuth={true}
    />
  );
}
