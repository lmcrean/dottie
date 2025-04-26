# Assessment Update Endpoint

## Overview
This endpoint updates an existing assessment by its ID. Access is restricted to the assessment owner.

## Request
- **Method**: PUT
- **Endpoint**: `/api/assessment/:userId/:assessmentId`
- **Authentication**: Required (JWT token)
- **URL Parameters**:
  - `userId`: ID of the user who owns the assessment
  - `assessmentId`: ID of the assessment to update
- **Request Body**:
```json
{
  "assessmentData": {
    // Either flattened format
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
  }
}
```

## Response

### Success (200 OK)
```json
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
}
```

### Error Responses
- **400 Bad Request**: Assessment data is required
- **403 Forbidden**: Unauthorized access (user does not own the assessment)
- **404 Not Found**: Assessment not found
- **500 Internal Server Error**: Server-side error

## Notes
- The endpoint supports both flattened and nested data formats for backward compatibility
- Although the request can accept both formats, the response will be in the flattened format with all properties in snake_case
- The endpoint validates ownership of the assessment before allowing updates
- For test users with IDs starting with 'test-', it may attempt direct database update if the USE_LEGACY_DB_DIRECT environment variable is set to 'true'
- The updated_at timestamp is automatically updated to the current time 