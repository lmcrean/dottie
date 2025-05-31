import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="POST"
      endpoint="/api/user/pw/update"
      expectedOutput={{ message: 'Password updated successfully' }}
      requiresAuth={true}
      requiresParams={true}
      inputFields={[
        {
          name: 'currentPassword',
          label: 'Current Password',
          type: 'password',
          required: true
        },
        {
          name: 'newPassword',
          label: 'New Password',
          type: 'password',
          required: true
        }
      ]}
    />
  );
}
