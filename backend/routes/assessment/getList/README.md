# Assessment List Endpoint

## Overview
This endpoint retrieves a list of all assessments for the authenticated user.

## Request
- **Method**: GET
- **Endpoint**: `/api/assessment/list`
- **Authentication**: Required (JWT token)

## Response

### Success (200 OK)
```json
[
  {
    "id": "uuid-here",
    "user_id": "user-uuid-here",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
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
  },
  // Additional assessments...
]
```

### Not Found (404)
```json
{
  "message": "No assessments found for this user"
}
```

### Error Responses
- **400 Bad Request**: Missing user ID
- **500 Internal Server Error**: Server-side error

## Notes
- The response will use the flattened format with all properties in snake_case
- Symptoms are split into physical_symptoms and emotional_symptoms arrays
- Recommendations have one level of nesting with title and description properties
- For test users, it may attempt direct database access if the USE_LEGACY_DB_DIRECT environment variable is set to 'true' 