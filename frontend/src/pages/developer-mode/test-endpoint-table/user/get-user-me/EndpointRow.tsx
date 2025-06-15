import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/user/me"
      expectedOutput={{
        id: 'user-id',
        email: 'user@example.com',
        name: 'User Name'
      }}
      requiresAuth={true}
    />
  );
}
