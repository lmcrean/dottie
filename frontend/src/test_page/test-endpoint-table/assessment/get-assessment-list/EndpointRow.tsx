import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/assessment/list"
      expectedOutput={[
        {
          id: 'assessment-id-1',
          userId: 'user-id',
          assessment_data: '{}',
          createdAt: 'created-date',
          updatedAt: 'updated-date'
        },
        {
          id: 'assessment-id-2',
          userId: 'user-id',
          assessment_data: '{}',
          createdAt: 'created-date',
          updatedAt: 'updated-date'
        }
      ]}
      requiresAuth={true}
    />
  );
}
