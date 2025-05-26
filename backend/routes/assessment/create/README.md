# Assessment Create Endpoint

## Overview
This endpoint creates a new assessment for the authenticated user.

## Request
- **Method**: POST
- **Endpoint**: `/api/assessment/send`
- **Authentication**: Required (JWT token)
- **Request Body**:
```json
{
  "assessmentData": {
    "age": "25-34",
    "pattern": "regular",
    "cycle_length": "26-30",
    "period_duration": "4-5",
    "flow_heaviness": "moderate",
    "pain_level": "moderate",
    "physical_symptoms": ["Bloating", "Headaches"],
    "emotional_symptoms": ["Mood swings", "Irritability"],
    "recommendations": [
      {
        "title": "Recommendation 1",
        "description": "Description for recommendation 1"
      },
      {
        "title": "Recommendation 2",
        "description": "Description for recommendation 2"
      }
    ]
  }
}
```

## Response

### Success (201 Created)
```json
{
  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "created_at": "2023-01-01T00:00:00.000Z",
  "age": "25-34",
  "pattern": "regular",
  "cycle_length": "26-30",
  "period_duration": "4-5",
  "flow_heaviness": "moderate",
  "pain_level": "moderate",
  "physical_symptoms": ["Bloating", "Headaches"],
  "emotional_symptoms": ["Mood swings", "Irritability"],
  "recommendations": [
    {
      "title": "Recommendation 1",
      "description": "Description for recommendation 1"
    },
    {
      "title": "Recommendation 2",
      "description": "Description for recommendation 2"
    }
  ],
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### Error Responses
- **400 Bad Request**: Assessment data is required or validation errors
- **500 Internal Server Error**: Server-side error

## Notes
- The endpoint supports flattened data format
- All properties in the response will use snake_case format
- Symptoms are split into physical_symptoms and emotional_symptoms arrays
- Recommendations have one level of nesting with title and description properties
- Assessment data is validated before creation
- For test users with IDs starting with 'test-', it may attempt direct database insertion if the USE_LEGACY_DB_DIRECT environment variable is set to 'true'
- A unique assessment ID is generated for each new assessment 