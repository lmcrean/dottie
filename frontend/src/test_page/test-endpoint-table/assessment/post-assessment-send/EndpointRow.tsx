import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="POST"
      endpoint="/api/assessment/send"
      expectedOutput={{ 
        id: "assessment-id",
        userId: "user-id",
        assessment_data: {
          date: "date created",
          pattern: "Regular",
          age: "18-24",
          cycleLength: "26-30",
          periodDuration: "4-5",
          flowHeaviness: "moderate",
          painLevel: "moderate",
          symptoms: {
            physical: ["Bloating", "Headaches"],
            emotional: []
          },
          recommendations: [
            {
              title: "Stay Hydrated",
              description: "Drink at least 8 glasses of water daily to help reduce bloating."
            },
            {
              title: "Regular Exercise",
              description: "Engage in light activities like walking or yoga to ease cramps."
            }
          ]
        },
        createdAt: "created-date",
        updatedAt: "updated-date",
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
            userId: "", // set by backend
            createdAt: new Date().toISOString(),
            assessment_data: {
              date: new Date().toISOString(),
              pattern: "Regular",
              age: "18-24",
              cycleLength: "26-30",
              periodDuration: "4-5",
              flowHeaviness: "moderate",
              painLevel: "moderate",
              symptoms: {
                physical: ["Bloating", "Headaches"],
                emotional: []
              },
              recommendations: [
                {
                  title: "Stay Hydrated",
                  description: "Drink at least 8 glasses of water daily to help reduce bloating."
                },
                {
                  title: "Regular Exercise",
                  description: "Engage in light activities like walking or yoga to ease cramps."
                }
              ]
            }
          }, null, 2)
        }
      ]}
    />
  );
}
