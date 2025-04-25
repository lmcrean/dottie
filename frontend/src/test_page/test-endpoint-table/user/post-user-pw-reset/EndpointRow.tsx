import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="POST"
      endpoint="/api/user/pw/reset"
      expectedOutput={{ message: 'We have sent a password reset link to user@example.com' }}
      requiresParams={false}
      inputFields={[
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: false,
          placeholder: 'user@example.com'
        }
      ]}
    />
  );
}
