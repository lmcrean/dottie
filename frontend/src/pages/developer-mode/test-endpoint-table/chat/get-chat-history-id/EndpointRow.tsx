import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/chat/history/:conversationId"
      expectedOutput={{
        id: 'conversation-id',
        messages: [
          { role: 'user', content: 'Hello, can you help with my period symptoms?' },
          { role: 'assistant', content: "I'd be happy to help with your period symptoms..." }
        ]
      }}
      requiresAuth={true}
      pathParams={['conversationId']}
    />
  );
}
