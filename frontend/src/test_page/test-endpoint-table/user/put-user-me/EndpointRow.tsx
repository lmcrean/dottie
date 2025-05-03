import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="PUT"
      endpoint="/api/user/me"
      expectedOutput={{ message: 'User updated' }}
      requiresAuth={true}
      requiresParams={true}
      inputFields={[
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          defaultValue: `UpdatedUser_${Date.now()}`
        },
        {
          name: 'email',
          label: 'Email',
          type: 'text',
          required: true,
          defaultValue: `updated_${Date.now()}@example.com`
        }
      ]}
    />
  );
}
