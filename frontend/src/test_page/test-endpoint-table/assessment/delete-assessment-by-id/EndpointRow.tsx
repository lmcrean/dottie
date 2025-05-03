import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="DELETE"
      endpoint="/api/assessment/:userId/:id"
      expectedOutput={{ message: 'Assessment deleted successfully' }}
      requiresAuth={true}
      pathParams={['userId', 'id']}
    />
  );
}
