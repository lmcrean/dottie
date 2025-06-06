import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="GET"
      endpoint="/api/assessment/:id"
      expectedOutput={{
        id: 'assessment-id',
        user_id: 'user-id',
        created_at: 'created-date',
        updated_at: 'updated-date',
        age: '25-plus',
        pattern: 'regular',
        cycle_length: '26-30',
        period_duration: '4-5',
        flow_heaviness: 'moderate',
        pain_level: 'mild',
        physical_symptoms: ['Bloating', 'Headaches'],
        emotional_symptoms: ['Mood swings'],
        recommendations: []
      }}
      requiresAuth={true}
      pathParams={['id']}
    />
  );
}
