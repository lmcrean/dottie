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
    "id": "assessment-id",
    "user_id": "user-id",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "age": 25,
    "pattern": "regular",
    "cycle_length": 28,
    "period_duration": 5,
    "flow_heaviness": "medium",
    "pain_level": 3,
    "physical_symptoms": ["bloating", "cramps"],
    "emotional_symptoms": ["irritability", "mood swings"],
    "recommendations": ["recommendation1", "recommendation2"]
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
- The endpoint supports both flattened and nested data formats for backward compatibility
- Although legacy code can handle both formats, the response will be in the flattened format with all properties in snake_case
- For test users, it may also attempt direct database access if the USE_LEGACY_DB_DIRECT environment variable is set to 'true' 