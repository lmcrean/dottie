# Assessment Detail Endpoint

## Overview
This endpoint retrieves detailed information about a specific assessment by its ID. Access is restricted to the assessment owner.

## Request
- **Method**: GET
- **Endpoint**: `/api/assessment/:assessmentId`
- **Authentication**: Required (JWT token)
- **URL Parameters**:
  - `assessmentId`: ID of the assessment to retrieve

## Response

### Success (200 OK)
```json
{
  "id": "assessment-id",
  "userId": "user-id",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "age": 25,
  "pattern": "regular",
  "cycle_length": 28,
  "period_duration": 5,
  "flow_heaviness": "medium",
  "pain_level": 3,
  "physical_symptoms": ["bloating", "cramps"],
  "emotional_symptoms": ["irritability", "mood swings"],
  "recommendations": ["recommendation1", "recommendation2"]
}
```

### Error Responses
- **400 Bad Request**: Missing assessment ID or user ID
- **403 Forbidden**: Unauthorized access (user does not own the assessment)
- **404 Not Found**: Assessment not found
- **500 Internal Server Error**: Server-side error

## Notes
- The endpoint supports both flattened and nested data formats for backward compatibility
- Although legacy code can handle both formats, the response will be in the flattened format
- For test users, it may also attempt direct database access if the USE_LEGACY_DB_DIRECT environment variable is set to 'true'
- The endpoint validates ownership of the assessment before returning data 