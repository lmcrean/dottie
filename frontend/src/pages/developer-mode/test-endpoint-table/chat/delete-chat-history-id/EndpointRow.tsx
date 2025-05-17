import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="DELETE"
      endpoint="/api/chat/history/:conversationId"
      expectedOutput={{ message: 'Conversation deleted' }}
      requiresAuth={true}
      pathParams={['conversationId']}
    />
  );
}
