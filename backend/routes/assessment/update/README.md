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

### Success (200 OK)
```json
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
}
```

### Error Responses
- **400 Bad Request**: Assessment data is required
- **403 Forbidden**: Unauthorized access (user does not own the assessment)
- **404 Not Found**: Assessment not found
- **500 Internal Server Error**: Server-side error

## Notes
- The endpoint supports flattened data format
- All properties in the response will use snake_case format
- Symptoms are split into physical_symptoms and emotional_symptoms arrays
- Recommendations have one level of nesting with title and description properties
- The endpoint validates ownership of the assessment before allowing updates
- For test users with IDs starting with 'test-', it may attempt direct database update if the USE_LEGACY_DB_DIRECT environment variable is set to 'true'
- The updated_at timestamp is automatically updated to the current time 