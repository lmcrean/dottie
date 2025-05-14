import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/setup/database/hello"
      expectedOutput={{
        message: 'Hello World from SQLite!',
        dbType: 'sqlite3',
        isConnected: true
      }}
    />
  );
}
