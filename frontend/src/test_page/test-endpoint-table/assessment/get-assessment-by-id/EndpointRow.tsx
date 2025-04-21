import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="GET"
      endpoint="/api/assessment/:id"
      expectedOutput={{ id: "assessment-id", "userId": "user-id", "assessmentData": "{}", "createdAt": "created-date", "updatedAt": "updated-date" }}
      requiresAuth={true}
      pathParams={["id"]}
    />
  );
} 

