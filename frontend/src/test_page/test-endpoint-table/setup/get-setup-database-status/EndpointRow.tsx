import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/setup/database/status"
      expectedOutput={{ status: 'connected' }}
    />
  );
}
