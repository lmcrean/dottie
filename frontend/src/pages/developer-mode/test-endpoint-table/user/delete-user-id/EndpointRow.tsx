import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="DELETE"
      endpoint="/api/user/:id"
      expectedOutput={{ message: 'User deleted' }}
      requiresAuth={true}
      pathParams={['id']}
    />
  );
}
