import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow 
      method="PUT"
      endpoint="/api/assessment/:userId/:id"
      expectedOutput={{
        "id": "assessment-id",
        "userId": "user-id",
        "assessment_data": "{updated-assessment-data}",
        "createdAt": "created-date",
        "updatedAt": "updated-date"
      }}
      requiresAuth={true}
      pathParams={["userId", "id"]}
      requiresParams={true}
      inputFields={[
        {
          name: "assessmentData",
          label: "Updated Assessment Data",
          type: "json",
          required: true,
          defaultValue: JSON.stringify({
            "date": "2025-04-16T12:04:26.237Z",
            "pattern": "Irregular",
            "age": "25-30",
            "cycleLength": "31-35",
            "periodDuration": "5-6",
            "flowHeaviness": "light",
            "painLevel": "severe",
            "symptoms": {
              "physical": [
                "Bloating",
                "Fatigue"
              ],
              "emotional": [
                "Irritability"
              ]
            },
            "recommendations": [
              {
                "title": "Stay Hydrated",
                "description": "Increase water intake to help with fatigue and bloating. Aim for 10 glasses of water per day."
              },
              {
                "title": "Balanced Diet",
                "description": "Incorporate more fruits and vegetables to reduce inflammation and ease cramps."
              }
            ]
          }, null, 2)
        }
      ]}
    />
  );
} 

