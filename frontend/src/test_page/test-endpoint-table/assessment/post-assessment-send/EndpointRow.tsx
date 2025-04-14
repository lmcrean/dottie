import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="POST"
      endpoint="/api/assessment/send"
      expectedOutput={{ 
        id: "assessment-id", 
        message: "Assessment saved" 
      }}
      requiresAuth={true}
      requiresParams={true}
      inputFields={[
        {
          name: "assessmentData",
          label: "Assessment Data",
          type: "json",
          required: true,
          defaultValue: JSON.stringify({
            age: "18-24",
            cycleLength: "26-30",
            periodDuration: "4-5",
            flowHeaviness: "moderate",
            painLevel: "moderate",
            symptoms: {
              physical: ["Bloating", "Headaches"],
              emotional: ["Mood swings", "Irritability"]
            }
          }, null, 2)
        }
      ]}
    />
  );
} 