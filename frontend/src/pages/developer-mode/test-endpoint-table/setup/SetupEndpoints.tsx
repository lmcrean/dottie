import React from 'react';
import { EndpointTable } from '../../page-components';
import GetSetupHealthHello from './get-setup-health-hello/EndpointRow';
import GetSetupDatabaseStatus from './get-setup-database-status/EndpointRow';
import GetSetupDatabaseHello from './get-setup-database-hello/EndpointRow';

/**
 * Container component for setup endpoints
 */
export default function SetupEndpoints() {
  return (
    <EndpointTable title="Setup Endpoints">
      <GetSetupHealthHello />
      <GetSetupDatabaseStatus />
      <GetSetupDatabaseHello />
    </EndpointTable>
  );
}
