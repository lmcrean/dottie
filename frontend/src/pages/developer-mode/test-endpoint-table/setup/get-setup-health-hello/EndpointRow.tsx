import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/setup/health/hello"
      expectedOutput={{ message: 'Hello World from Dottie API!' }}
    />
  );
}
