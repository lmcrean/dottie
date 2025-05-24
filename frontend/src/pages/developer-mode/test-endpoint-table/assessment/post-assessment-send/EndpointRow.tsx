import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="POST"
      endpoint="/api/assessment/send"
      expectedOutput={{
        id: 'assessment-id',
        user_id: 'user-id',
        created_at: 'created-date',
        age: '18-24',
        pattern: 'Regular',
        cycle_length: '26-30',
        period_duration: '4-5',
        flow_heaviness: 'moderate',
        pain_level: 'moderate',
        physical_symptoms: ['Bloating', 'Headaches'],
        emotional_symptoms: [],
        recommendations: [
          {
            title: 'Stay Hydrated',
            description: 'Drink at least 8 glasses of water daily to help reduce bloating.'
          },
          {
            title: 'Regular Exercise',
            description: 'Engage in light activities like walking or yoga to ease cramps.'
          }
        ]
      }}
      requiresAuth={true}
      requiresParams={true}
      inputFields={[
        {
          name: 'assessmentData',
          label: 'Assessment Data',
          type: 'json',
          required: true,
          defaultValue: JSON.stringify(
            {
              age: '18-24',
              pattern: 'Regular',
              cycle_length: '26-30',
              period_duration: '4-5',
              flow_heaviness: 'moderate',
              pain_level: 'moderate',
              physical_symptoms: ['Bloating', 'Headaches'],
              emotional_symptoms: [],
              recommendations: [
                {
                  title: 'Stay Hydrated',
                  description: 'Drink at least 8 glasses of water daily to help reduce bloating.'
                },
                {
                  title: 'Regular Exercise',
                  description: 'Engage in light activities like walking or yoga to ease cramps.'
                }
              ]
            },
            null,
            2
          )
        }
      ]}
    />
  );
}
