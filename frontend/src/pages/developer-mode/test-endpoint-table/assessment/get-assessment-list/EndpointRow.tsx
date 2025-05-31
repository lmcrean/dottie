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
        },
        {
          id: 'assessment-id-2',
          user_id: 'user-id',
          created_at: 'created-date',
          updated_at: 'updated-date',
          age: '18-24',
          pattern: 'irregular',
          cycle_length: '31-35',
          period_duration: '6-7',
          flow_heaviness: 'heavy',
          pain_level: 'severe',
          physical_symptoms: ['Cramps', 'Fatigue'],
          emotional_symptoms: ['Irritability'],
          recommendations: []
        }
      ]}
      requiresAuth={true}
    />
  );
}
