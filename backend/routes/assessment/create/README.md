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
    // Either flattened format
    "age": 25,
    "pattern": "regular",
    "cycle_length": 28, // or "cycleLength": 28
    "period_duration": 5, // or "periodDuration": 5
    "flow_heaviness": "medium", // or "flowHeaviness": "medium"
    "pain_level": 3, // or "painLevel": 3
    "physical_symptoms": ["bloating", "cramps"],
    "emotional_symptoms": ["irritability", "mood swings"],
    "recommendations": ["recommendation1", "recommendation2"]
    
    // OR nested format
    "assessment_data": {
      "age": 25,
      "pattern": "regular",
      "cycleLength": 28,
      "periodDuration": 5,
      "flowHeaviness": "medium",
      "painLevel": 3,
      "symptoms": {
        "physical": ["bloating", "cramps"],
        "emotional": ["irritability", "mood swings"]
      },
      "recommendations": ["recommendation1", "recommendation2"]
    }
  }
}
```

## Response

### Success (201 Created)
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
- **400 Bad Request**: Assessment data is required or validation errors
- **500 Internal Server Error**: Server-side error

## Notes
- The endpoint supports both flattened and nested data formats for backward compatibility
- Although the request can accept both formats, the response will be in the flattened format
- Assessment data is validated before creation
- For test users with IDs starting with 'test-', it may attempt direct database insertion if the USE_LEGACY_DB_DIRECT environment variable is set to 'true'
- A unique assessment ID is generated for each new assessment 